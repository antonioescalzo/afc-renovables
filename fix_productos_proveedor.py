#!/usr/bin/env python3
"""
Script para cargar correctamente los productos por proveedor en Supabase
Lee los CSVs de facturas y los vincula con los proveedores correctamente
"""

import pandas as pd
import subprocess
import json
import os
import time
import sys
from pathlib import Path

# ═══════════════════════════════════════════════════════════
# CONFIGURACIÓN
# ═══════════════════════════════════════════════════════════

SUPABASE_URL = "https://xhzzfpsszsdqoiavqgis.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhoenpmcHNzenNkcW9pYXZxZ2lzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzMzg4MDksImV4cCI6MjA4OTkxNDgwOX0.JhZ4K1mzo2NOTW7RQ8w_vC2s7ggzJJiwn-hTsw-vyWU"

FACTURAS_DIR = "/home/user/afc-renovables/costes_general/facturas_2026"
PROVEEDORES_FILE = "/home/user/afc-renovables/costes_general/facturas_2026/proveedores.csv"

def make_request(method, endpoint, data=None):
    """Helper para hacer requests a Supabase"""
    cmd = ["curl", "-s", "-X", method, f"{SUPABASE_URL}/rest/v1{endpoint}"]
    cmd.extend(["-H", f"apikey: {SUPABASE_KEY}"])
    cmd.extend(["-H", "Content-Type: application/json"])
    if data:
        cmd.extend(["-d", json.dumps(data)])

    response = subprocess.run(cmd, capture_output=True, text=True)
    try:
        return json.loads(response.stdout) if response.stdout else None
    except:
        return response.stdout

print("🚀 CARGAR PRODUCTOS Y VINCULAR CON PROVEEDORES")
print("=" * 70)

# ═══════════════════════════════════════════════════════════
# 1. CARGAR PROVEEDORES Y CREAR MAPEO
# ═══════════════════════════════════════════════════════════

print("\n1️⃣ Cargando mapeo de proveedores...")
try:
    df_prov = pd.read_csv(PROVEEDORES_FILE, sep=';', encoding='latin1')
    print(f"   ✅ {len(df_prov)} registros de proveedores cargados")

    # Crear mapeo de nombre a ID (obteniendo IDs de Supabase)
    prov_response = make_request("GET", "/proveedores?select=id,nombre")

    if isinstance(prov_response, list):
        prov_map = {p['nombre']: p['id'] for p in prov_response}
        print(f"   ✅ Mapeo creado para {len(prov_map)} proveedores")
    else:
        print("   ❌ No se pudo obtener proveedores de Supabase")
        sys.exit(1)

except Exception as e:
    print(f"   ❌ Error: {e}")
    sys.exit(1)

# ═══════════════════════════════════════════════════════════
# 2. OBTENER MAPEO DE FACTURAS EXISTENTES
# ═══════════════════════════════════════════════════════════

print("\n2️⃣ Obteniendo facturas existentes...")
try:
    fact_response = make_request("GET", "/facturas_compra?select=id,numero_factura,proveedor_id")

    if isinstance(fact_response, list):
        fact_map = {f['numero_factura']: {'id': f['id'], 'proveedor_id': f['proveedor_id']} for f in fact_response}
        print(f"   ✅ {len(fact_map)} facturas encontradas")
    else:
        print("   ⚠️  No se encontraron facturas")
        fact_map = {}

except Exception as e:
    print(f"   ⚠️  Error: {e}")
    fact_map = {}

# ═══════════════════════════════════════════════════════════
# 3. PROCESAR ARCHIVOS CSV Y CARGAR PRODUCTOS
# ═══════════════════════════════════════════════════════════

print("\n3️⃣ Procesando archivos CSV de facturas...")

lineas_to_update = []
lineas_to_insert = []

csv_files = sorted([f for f in os.listdir(FACTURAS_DIR) if f.endswith('.csv') and f[0].isdigit()])

for csv_file in csv_files:
    filepath = os.path.join(FACTURAS_DIR, csv_file)
    try:
        df = pd.read_csv(filepath, sep=';', encoding='latin1', on_bad_lines='skip')

        if len(df) == 0:
            continue

        # Obtener proveedor del archivo
        proveedor = df['Proveedor'].iloc[0] if 'Proveedor' in df.columns else None
        if not proveedor:
            continue

        # Obtener número de factura
        factura_num = df['Nº Factura/ Regis.'].iloc[0] if 'Nº Factura/ Regis.' in df.columns else None
        if not factura_num:
            continue

        # Obtener IDs
        proveedor_id = prov_map.get(proveedor)
        factura_info = fact_map.get(factura_num)

        if not proveedor_id:
            print(f"   ⚠️  {csv_file}: Proveedor '{proveedor}' no encontrado")
            continue

        if not factura_info:
            print(f"   ⚠️  {csv_file}: Factura '{factura_num}' no encontrada")
            continue

        factura_id = factura_info['id']

        # Crear líneas de factura
        for _, row in df.iterrows():
            try:
                linea = {
                    "factura_id": factura_id,
                    "proveedor_id": proveedor_id,  # Agregar para facilitar búsquedas
                    "ref": str(row.get('Referencia', '')).strip(),
                    "descripcion": str(row.get('Descripción', '')).strip(),
                    "cantidad": float(row.get('Cantidad', 0)) if pd.notna(row.get('Cantidad')) else 0,
                    "precio": float(row.get('P.U.', 0)) if pd.notna(row.get('P.U.')) else 0,
                    "descuento": float(row.get('Dto. %', 0)) if pd.notna(row.get('Dto. %')) else 0,
                    "importe_total": float(row.get('Importe', 0)) if pd.notna(row.get('Importe')) else 0
                }
                lineas_to_insert.append(linea)
            except Exception as e:
                continue

        print(f"   ✓ {csv_file}: {len(df)} líneas procesadas")

    except Exception as e:
        print(f"   ❌ {csv_file}: {e}")

print(f"\n   📊 Total de líneas a insertar: {len(lineas_to_insert)}")

# ═══════════════════════════════════════════════════════════
# 4. INSERTAR LÍNEAS DE FACTURA
# ═══════════════════════════════════════════════════════════

if lineas_to_insert:
    print("\n4️⃣ Insertando/actualizando líneas de factura...")

    # Limpiar tabla existente (opcional - comentar si quieres preservar)
    # print("   Limpiando registros existentes...")
    # make_request("DELETE", "/lineas_factura", {})

    # Insertar por lotes
    batch_size = 100
    for i in range(0, len(lineas_to_insert), batch_size):
        batch = lineas_to_insert[i:i+batch_size]

        # Usar UPSERT para evitar duplicados
        result = make_request("POST", "/lineas_factura?on_conflict=factura_id,ref", batch)

        print(f"   ✓ Lote {i//batch_size + 1}: {len(batch)} registros")
        time.sleep(0.5)

    print(f"\n   ✅ {len(lineas_to_insert)} líneas procesadas")

# ═══════════════════════════════════════════════════════════
# 5. VERIFICAR RESULTADOS
# ═══════════════════════════════════════════════════════════

print("\n5️⃣ Verificando resultados...")

result = make_request("GET", "/lineas_factura?select=count()")
if result:
    print(f"   Total líneas en BD: {result}")

# Verificar por proveedor
print("\n   Líneas por proveedor:")
result = make_request("GET", "/lineas_factura?select=proveedor_id,count()")
if isinstance(result, list):
    for row in result[:5]:
        print(f"     Proveedor {row.get('proveedor_id')}: {row.get('count', 0)} líneas")

print("\n" + "=" * 70)
print("✅ PROCESO COMPLETADO")
print("=" * 70)

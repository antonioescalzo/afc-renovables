#!/usr/bin/env python3
"""
Script simple para cargar productos desde Excel
Lee archivos 4.csv a 77.csv y los carga en Supabase
"""

import pandas as pd
import subprocess
import json
import os
import glob

print("=" * 80)
print("📦 CARGAR PRODUCTOS DESDE EXCEL A SUPABASE")
print("=" * 80)

# URLs y credenciales
SUPABASE_URL = "https://xhzzfpsszsdqoiavqgis.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhoenpmcHNzenNkcW9pYXZxZ2lzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzMzg4MDksImV4cCI6MjA4OTkxNDgwOX0.JhZ4K1mzo2NOTW7RQ8w_vC2s7ggzJJiwn-hTsw-vyWU"

# Buscar carpeta de facturas
possible_paths = [
    "/home/user/afc-renovables/costes_general/facturas_2026",
    "costes_general/facturas_2026",
    "./costes_general/facturas_2026"
]

facturas_dir = None
for path in possible_paths:
    if os.path.isdir(path):
        facturas_dir = path
        break

if not facturas_dir:
    print("❌ Error: No se encontró carpeta de facturas")
    print(f"   Buscadas en: {possible_paths}")
    exit(1)

print(f"\n✅ Carpeta encontrada: {facturas_dir}")

# ═══════════════════════════════════════════════════════════════════════════
# PASO 1: OBTENER PROVEEDORES
# ═══════════════════════════════════════════════════════════════════════════

print("\n1️⃣ Obteniendo proveedores de Supabase...")
try:
    result = subprocess.run([
        "curl", "-s", "-X", "GET",
        f"{SUPABASE_URL}/rest/v1/proveedores?select=id,nombre",
        "-H", f"apikey: {SUPABASE_KEY}"
    ], capture_output=True, text=True, timeout=10)

    prov_list = json.loads(result.stdout)
    prov_map = {p['nombre']: p['id'] for p in prov_list}
    print(f"   ✅ {len(prov_map)} proveedores encontrados")
except Exception as e:
    print(f"   ❌ Error: {e}")
    exit(1)

# ═══════════════════════════════════════════════════════════════════════════
# PASO 2: OBTENER FACTURAS
# ═══════════════════════════════════════════════════════════════════════════

print("\n2️⃣ Obteniendo facturas de Supabase...")
try:
    result = subprocess.run([
        "curl", "-s", "-X", "GET",
        f"{SUPABASE_URL}/rest/v1/facturas_compra?select=id,numero_factura,proveedor_id",
        "-H", f"apikey: {SUPABASE_KEY}"
    ], capture_output=True, text=True, timeout=10)

    fact_list = json.loads(result.stdout)
    fact_map = {f['numero_factura']: {'id': f['id'], 'proveedor_id': f['proveedor_id']}
               for f in fact_list}
    print(f"   ✅ {len(fact_map)} facturas encontradas")
except Exception as e:
    print(f"   ⚠️  Error: {e}")
    fact_map = {}

# ═══════════════════════════════════════════════════════════════════════════
# PASO 3: LEER ARCHIVOS CSV Y CREAR LINEAS
# ═══════════════════════════════════════════════════════════════════════════

print("\n3️⃣ Leyendo archivos CSV...")

csv_files = sorted(glob.glob(os.path.join(facturas_dir, "[0-9]*.csv")))
print(f"   Encontrados {len(csv_files)} archivos")

lineas_to_insert = []
total_productos = 0

for csv_file in csv_files:
    filename = os.path.basename(csv_file)

    try:
        # Leer CSV
        df = pd.read_csv(csv_file, sep=';', encoding='latin1', on_bad_lines='skip')

        if len(df) == 0:
            continue

        # Obtener info
        proveedor = df['Proveedor'].iloc[0] if 'Proveedor' in df.columns else None
        factura_num = df['Nº Factura/ Regis.'].iloc[0] if 'Nº Factura/ Regis.' in df.columns else None

        if not proveedor or not factura_num:
            continue

        # Obtener IDs
        proveedor_id = prov_map.get(proveedor)
        fact_info = fact_map.get(factura_num)

        if not proveedor_id or not fact_info:
            print(f"   ⚠️  {filename}: No encontrado en BD")
            continue

        factura_id = fact_info['id']

        # Procesar líneas (SIN proveedor_id - se obtiene del JOIN con facturas_compra)
        for _, row in df.iterrows():
            try:
                linea = {
                    'factura_id': factura_id,
                    'ref': str(row.get('Referencia', '')).strip(),
                    'descripcion': str(row.get('Descripción', '')).strip(),
                    'cantidad': float(row.get('Cantidad', 0)) if pd.notna(row.get('Cantidad')) else 0,
                    'precio': float(row.get('P.U.', 0)) if pd.notna(row.get('P.U.')) else 0,
                    'descuento': float(row.get('Dto. %', 0)) if pd.notna(row.get('Dto. %')) else 0,
                    'importe': float(row.get('Importe', 0)) if pd.notna(row.get('Importe')) else 0
                }
                lineas_to_insert.append(linea)
                total_productos += 1
            except:
                continue

        print(f"   ✓ {filename}: {len(df)} líneas")

    except Exception as e:
        print(f"   ❌ {filename}: {e}")

print(f"\n   📊 Total productos a cargar: {total_productos}")

# ═══════════════════════════════════════════════════════════════════════════
# PASO 4: CARGAR EN SUPABASE
# ═══════════════════════════════════════════════════════════════════════════

if lineas_to_insert:
    print(f"\n4️⃣ Cargando {len(lineas_to_insert)} productos en Supabase...")

    # Limpiar primero
    print("   Limpiando registros existentes...")
    subprocess.run([
        "curl", "-s", "-X", "DELETE",
        f"{SUPABASE_URL}/rest/v1/lineas_factura",
        "-H", f"apikey: {SUPABASE_KEY}",
        "-H", "Content-Type: application/json"
    ], timeout=10)

    # Insertar por lotes
    batch_size = 100
    for i in range(0, len(lineas_to_insert), batch_size):
        batch = lineas_to_insert[i:i+batch_size]

        result = subprocess.run([
            "curl", "-s", "-X", "POST",
            f"{SUPABASE_URL}/rest/v1/lineas_factura",
            "-H", f"apikey: {SUPABASE_KEY}",
            "-H", "Content-Type: application/json",
            "-d", json.dumps(batch)
        ], capture_output=True, text=True, timeout=10)

        print(f"   ✓ Lote {i//batch_size + 1}: {len(batch)} registros")

    print(f"\n   ✅ {len(lineas_to_insert)} líneas cargadas")

print("\n" + "=" * 80)
print("✅ PROCESO COMPLETADO")
print("=" * 80)
print("\nLos productos deberían aparecer en el dropdown 'PRODUCTOS POR PROVEEDOR'")

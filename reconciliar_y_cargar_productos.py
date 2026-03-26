#!/usr/bin/env python3
"""
Script para reconciliar proveedores con facturas
Lee los Excel de facturas_2026/ y valida totales contra proveedores.csv
Luego carga los productos correctamente en Supabase
"""

import pandas as pd
import os
from pathlib import Path
import subprocess
import json
import time

# ═══════════════════════════════════════════════════════════════════════════
# CONFIGURACIÓN
# ═══════════════════════════════════════════════════════════════════════════

import os
import sys

# Detectar ruta correctamente (funciona en local y GitHub Actions)
if os.path.exists("/home/user/afc-renovables"):
    BASE_DIR = "/home/user/afc-renovables"
else:
    BASE_DIR = os.getcwd()

FACTURAS_DIR = os.path.join(BASE_DIR, "costes_general/facturas_2026")
PROVEEDORES_FILE = os.path.join(FACTURAS_DIR, "proveedores.csv")
SUPABASE_URL = "https://xhzzfpsszsdqoiavqgis.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhoenpmcHNzenNkcW9pYXZxZ2lzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzMzg4MDksImV4cCI6MjA4OTkxNDgwOX0.JhZ4K1mzo2NOTW7RQ8w_vC2s7ggzJJiwn-hTsw-vyWU"

print("🔍 RECONCILIAR PRODUCTOS CON PROVEEDORES")
print("=" * 80)

# ═══════════════════════════════════════════════════════════════════════════
# PASO 1: CARGAR proveedores.csv
# ═══════════════════════════════════════════════════════════════════════════

print("\n1️⃣ Cargando proveedores.csv...")
try:
    df_prov = pd.read_csv(PROVEEDORES_FILE, sep=';', encoding='latin1')
    print(f"   ✅ {len(df_prov)} registros cargados")
    print(f"   Columnas: {df_prov.columns.tolist()}")

    # Mostrar primeras filas
    print("\n   Primeras 5 registros:")
    print(df_prov.head()[['Nº Factura/ Regis.', 'Proveedor', 'Total']].to_string())

except Exception as e:
    print(f"   ❌ Error: {e}")
    exit(1)

# ═══════════════════════════════════════════════════════════════════════════
# PASO 2: OBTENER MAPEO DE PROVEEDORES DE SUPABASE
# ═══════════════════════════════════════════════════════════════════════════

print("\n2️⃣ Obteniendo proveedores de Supabase...")
try:
    result = subprocess.run([
        "curl", "-s", "-X", "GET",
        f"{SUPABASE_URL}/rest/v1/proveedores?select=id,nombre",
        "-H", f"apikey: {SUPABASE_KEY}"
    ], capture_output=True, text=True)

    prov_list = json.loads(result.stdout) if result.stdout else []
    prov_map = {p['nombre']: p['id'] for p in prov_list}
    print(f"   ✅ Mapeo de {len(prov_map)} proveedores creado")

except Exception as e:
    print(f"   ⚠️  Error: {e}")
    prov_map = {}

# ═══════════════════════════════════════════════════════════════════════════
# PASO 3: RECONCILIAR ARCHIVOS CSV
# ═══════════════════════════════════════════════════════════════════════════

print("\n3️⃣ Leyendo archivos de facturas (4.csv a 77.csv)...")
print("   Buscando coincidencias por IMPORTE total vs TOTAL proveedores.csv\n")

csv_files = sorted([f for f in os.listdir(FACTURAS_DIR)
                    if f.endswith('.csv') and f[0].isdigit()])

reconciliacion = []
productos_data = []

for csv_file in csv_files:
    filepath = os.path.join(FACTURAS_DIR, csv_file)

    try:
        # Leer CSV
        df_csv = pd.read_csv(filepath, sep=';', encoding='latin1', on_bad_lines='skip')

        if len(df_csv) == 0:
            continue

        # Obtener información de factura
        proveedor = df_csv['Proveedor'].iloc[0] if 'Proveedor' in df_csv.columns else None
        factura_num = df_csv['Nº Factura/ Regis.'].iloc[0] if 'Nº Factura/ Regis.' in df_csv.columns else None

        # Sumar importes
        total_csv = df_csv['Importe'].sum() if 'Importe' in df_csv.columns else 0

        if not proveedor or not factura_num:
            continue

        # Buscar en proveedores.csv
        match = df_prov[
            (df_prov['Nº Factura/ Regis.'] == factura_num) &
            (df_prov['Proveedor'] == proveedor)
        ]

        if not match.empty:
            total_prov = match['Total'].iloc[0]
            coincide = abs(total_csv - total_prov) < 0.01  # Tolerancia 0.01€
            estado = "✅" if coincide else "❌"

            print(f"{estado} {csv_file}: {proveedor} | "
                  f"CSV: €{total_csv:,.2f} | Prov: €{total_prov:,.2f} | "
                  f"Productos: {len(df_csv)}")

            reconciliacion.append({
                'archivo': csv_file,
                'proveedor': proveedor,
                'factura': factura_num,
                'total_csv': total_csv,
                'total_prov': total_prov,
                'coincide': coincide,
                'num_productos': len(df_csv)
            })

            # Guardar productos si coincide
            if coincide:
                for _, row in df_csv.iterrows():
                    productos_data.append({
                        'proveedor': proveedor,
                        'factura': factura_num,
                        'ref': str(row.get('Referencia', '')).strip(),
                        'descripcion': str(row.get('Descripción', '')).strip(),
                        'cantidad': float(row.get('Cantidad', 0)) if pd.notna(row.get('Cantidad')) else 0,
                        'precio': float(row.get('P.U.', 0)) if pd.notna(row.get('P.U.')) else 0,
                        'importe': float(row.get('Importe', 0)) if pd.notna(row.get('Importe')) else 0,
                        'descuento': float(row.get('Dto. %', 0)) if pd.notna(row.get('Dto. %')) else 0
                    })

    except Exception as e:
        print(f"   ⚠️  {csv_file}: {e}")
        continue

# ═══════════════════════════════════════════════════════════════════════════
# PASO 4: RESUMEN DE RECONCILIACIÓN
# ═══════════════════════════════════════════════════════════════════════════

print("\n" + "=" * 80)
print("📊 RESUMEN RECONCILIACIÓN")
print("=" * 80)

df_recon = pd.DataFrame(reconciliacion)
if not df_recon.empty:
    total_coinciden = df_recon['coincide'].sum()
    total_archivos = len(df_recon)
    print(f"\n✅ Coincidencias: {total_coinciden}/{total_archivos}")
    print(f"📦 Total productos a cargar: {len(productos_data)}")
    print(f"💰 Total importe: €{df_recon['total_csv'].sum():,.2f}")

    if total_coinciden < total_archivos:
        print(f"\n⚠️  ARCHIVOS SIN COINCIDENCIA:")
        no_coinciden = df_recon[~df_recon['coincide']]
        for _, row in no_coinciden.iterrows():
            dif = abs(row['total_csv'] - row['total_prov'])
            print(f"   {row['archivo']}: {row['proveedor']} | "
                  f"Diferencia: €{dif:,.2f}")

# ═══════════════════════════════════════════════════════════════════════════
# PASO 5: CARGAR PRODUCTOS EN SUPABASE (SOLO SI COINCIDEN)
# ═══════════════════════════════════════════════════════════════════════════

if productos_data and len(df_recon[df_recon['coincide']]) > 0:
    print("\n" + "=" * 80)
    print("4️⃣ CARGANDO PRODUCTOS EN SUPABASE")
    print("=" * 80)

    # Obtener mapeo de facturas
    try:
        result = subprocess.run([
            "curl", "-s", "-X", "GET",
            f"{SUPABASE_URL}/rest/v1/facturas_compra?select=id,numero_factura,proveedor_id",
            "-H", f"apikey: {SUPABASE_KEY}"
        ], capture_output=True, text=True)

        fact_list = json.loads(result.stdout) if result.stdout else []
        fact_map = {f['numero_factura']: {'id': f['id'], 'proveedor_id': f['proveedor_id']}
                   for f in fact_list}
        print(f"   ✅ Mapeo de {len(fact_map)} facturas obtenido")

    except:
        fact_map = {}

    # Preparar datos para cargar
    lineas_to_insert = []

    for prod in productos_data:
        fact_info = fact_map.get(prod['factura'])

        if not fact_info:
            continue

        proveedor_id = prov_map.get(prod['proveedor'])
        if not proveedor_id:
            continue

        linea = {
            'factura_id': fact_info['id'],
            'proveedor_id': proveedor_id,
            'ref': prod['ref'],
            'descripcion': prod['descripcion'],
            'cantidad': prod['cantidad'],
            'precio': prod['precio'],
            'descuento': prod['descuento'],
            'importe': prod['importe'],
            'numero_factura': prod['factura']
        }
        lineas_to_insert.append(linea)

    print(f"\n   Total líneas a cargar: {len(lineas_to_insert)}")

    # Insertar por lotes
    if lineas_to_insert:
        batch_size = 100
        for i in range(0, len(lineas_to_insert), batch_size):
            batch = lineas_to_insert[i:i+batch_size]

            result = subprocess.run([
                "curl", "-s", "-X", "POST",
                f"{SUPABASE_URL}/rest/v1/lineas_factura",
                "-H", f"apikey: {SUPABASE_KEY}",
                "-H", "Content-Type: application/json",
                "-d", json.dumps(batch)
            ], capture_output=True, text=True)

            print(f"   ✓ Lote {i//batch_size + 1}: {len(batch)} registros")
            time.sleep(0.3)

        print(f"\n   ✅ {len(lineas_to_insert)} líneas cargadas correctamente")

print("\n" + "=" * 80)
print("✅ PROCESO COMPLETADO")
print("=" * 80)

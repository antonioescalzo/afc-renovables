#!/usr/bin/env python3
"""
Script MEJORADO para cargar productos desde Excel
Más flexible con nombres de columnas
"""

import pandas as pd
import subprocess
import json
import os
import glob

print("=" * 80)
print("📦 CARGAR PRODUCTOS - VERSIÓN MEJORADA")
print("=" * 80)

SUPABASE_URL = "https://xhzzfpsszsdqoiavqgis.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhoenpmcHNzenNkcW9pYXZxZ2lzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzMzg4MDksImV4cCI6MjA4OTkxNDgwOX0.JhZ4K1mzo2NOTW7RQ8w_vC2s7ggzJJiwn-hTsw-vyWU"

# Buscar carpeta
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
    print("❌ Carpeta no encontrada")
    exit(1)

print(f"✅ Carpeta: {facturas_dir}\n")

# OBTENER PROVEEDORES
print("1️⃣ Obteniendo proveedores...")
try:
    result = subprocess.run([
        "curl", "-s", "-X", "GET",
        f"{SUPABASE_URL}/rest/v1/proveedores?select=id,nombre",
        "-H", f"apikey: {SUPABASE_KEY}"
    ], capture_output=True, text=True, timeout=10)
    prov_list = json.loads(result.stdout)
    prov_map = {p['nombre']: p['id'] for p in prov_list}
    print(f"   ✅ {len(prov_map)} proveedores\n")
except Exception as e:
    print(f"   ❌ Error: {e}")
    exit(1)

# OBTENER FACTURAS
print("2️⃣ Obteniendo facturas...")
try:
    result = subprocess.run([
        "curl", "-s", "-X", "GET",
        f"{SUPABASE_URL}/rest/v1/facturas_compra?select=id,numero_factura",
        "-H", f"apikey: {SUPABASE_KEY}"
    ], capture_output=True, text=True, timeout=10)
    fact_list = json.loads(result.stdout)
    fact_map = {f['numero_factura']: f['id'] for f in fact_list}
    print(f"   ✅ {len(fact_map)} facturas\n")
except Exception as e:
    print(f"   ⚠️  Error: {e}")
    fact_map = {}

# LEER CSV
print("3️⃣ Leyendo archivos...")
csv_files = sorted(glob.glob(os.path.join(facturas_dir, "[0-9]*.csv")))
print(f"   Encontrados {len(csv_files)} archivos\n")

lineas_to_insert = []

for csv_file in csv_files[:2]:  # Primeros 2 para diagnosticar
    filename = os.path.basename(csv_file)
    try:
        df = pd.read_csv(csv_file, sep=';', encoding='latin1', on_bad_lines='skip')

        if len(df) == 0:
            continue

        # Mostrar columnas
        print(f"📄 {filename}:")
        print(f"   Columnas: {df.columns.tolist()}")
        print(f"   Filas: {len(df)}")

        # Obtener valores
        proveedor = None
        factura_num = None

        # Buscar columna de proveedor (flexible)
        for col in df.columns:
            if 'proveedor' in col.lower():
                proveedor = df[col].iloc[0]
                print(f"   Proveedor encontrado en '{col}': {proveedor}")
                break

        # Buscar columna de factura
        for col in df.columns:
            if 'factura' in col.lower() or 'nº' in col.lower():
                factura_num = df[col].iloc[0]
                print(f"   Factura encontrada en '{col}': {factura_num}")
                break

        if not proveedor or not factura_num:
            print(f"   ⚠️  Falta proveedor o factura\n")
            continue

        # Obtener IDs
        proveedor_id = prov_map.get(proveedor)
        factura_id = fact_map.get(factura_num)

        print(f"   Proveedor ID: {proveedor_id}, Factura ID: {factura_id}\n")

        if not proveedor_id or not factura_id:
            continue

        # Procesar líneas
        for _, row in df.iterrows():
            try:
                # Buscar columnas flexiblemente
                ref = None
                descripcion = None
                cantidad = None
                precio = None
                descuento = None
                importe = None

                for col in df.columns:
                    col_lower = col.lower()
                    if 'ref' in col_lower:
                        ref = str(row[col]).strip()
                    elif 'desc' in col_lower and 'cantidad' not in col_lower:
                        descripcion = str(row[col]).strip()
                    elif 'cantidad' in col_lower:
                        cantidad = float(row[col]) if pd.notna(row[col]) else 0
                    elif 'p.u' in col_lower or 'precio' in col_lower:
                        precio = float(row[col]) if pd.notna(row[col]) else 0
                    elif 'dto' in col_lower:
                        descuento = float(row[col]) if pd.notna(row[col]) else 0
                    elif 'importe' in col_lower:
                        importe = float(row[col]) if pd.notna(row[col]) else 0

                if ref and descripcion:
                    linea = {
                        'factura_id': factura_id,
                        'ref': ref,
                        'descripcion': descripcion,
                        'cantidad': cantidad or 0,
                        'precio': precio or 0,
                        'descuento': descuento or 0,
                        'importe': importe or 0
                    }
                    lineas_to_insert.append(linea)
            except Exception as e:
                continue

    except Exception as e:
        print(f"   ❌ Error: {e}\n")

print(f"\n📊 Total productos encontrados: {len(lineas_to_insert)}")

# CARGAR EN SUPABASE
if lineas_to_insert:
    print(f"\n4️⃣ Cargando...")

    # Limpiar primero
    subprocess.run([
        "curl", "-s", "-X", "DELETE",
        f"{SUPABASE_URL}/rest/v1/lineas_factura",
        "-H", f"apikey: {SUPABASE_KEY}"
    ], timeout=10)

    # Insertar
    batch_size = 100
    for i in range(0, len(lineas_to_insert), batch_size):
        batch = lineas_to_insert[i:i+batch_size]
        subprocess.run([
            "curl", "-s", "-X", "POST",
            f"{SUPABASE_URL}/rest/v1/lineas_factura",
            "-H", f"apikey: {SUPABASE_KEY}",
            "-H", "Content-Type: application/json",
            "-d", json.dumps(batch)
        ], capture_output=True, text=True, timeout=10)

    print(f"   ✅ {len(lineas_to_insert)} productos cargados")

print("\n" + "=" * 80)
print("✅ DIAGNÓSTICO COMPLETADO")
print("=" * 80)

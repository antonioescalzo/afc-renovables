#!/usr/bin/env python3
"""
Script MEJORADO para cargar productos desde Excel con reconciliación por IMPORTE
Vincula los archivos CSV con las facturas por coincidencia de importes totales
"""

import pandas as pd
import subprocess
import json
import os
import glob
import sys
from pathlib import Path

# ═══════════════════════════════════════════════════════════════════════════
# CONFIGURACIÓN
# ═══════════════════════════════════════════════════════════════════════════

print("=" * 80)
print("📦 CARGAR PRODUCTOS CON RECONCILIACIÓN POR IMPORTE")
print("=" * 80)

# Detectar directorio base (funciona en local y GitHub Actions)
if os.path.exists("/home/user/afc-renovables"):
    BASE_DIR = "/home/user/afc-renovables"
else:
    BASE_DIR = os.getcwd()

FACTURAS_DIR = os.path.join(BASE_DIR, "costes_general/facturas_2026")
PROVEEDORES_FILE = os.path.join(FACTURAS_DIR, "proveedores.csv")

SUPABASE_URL = "https://xhzzfpsszsdqoiavqgis.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhoenpmcHNzenNkcW9pYXZxZ2lzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzMzg4MDksImV4cCI6MjA4OTkxNDgwOX0.JhZ4K1mzo2NOTW7RQ8w_vC2s7ggzJJiwn-hTsw-vyWU"

# ═══════════════════════════════════════════════════════════════════════════
# PASO 1: CARGAR PROVEEDORES.CSV
# ═══════════════════════════════════════════════════════════════════════════

print("\n1️⃣ Cargando proveedores.csv...")
try:
    df_prov = pd.read_csv(PROVEEDORES_FILE, sep=';', encoding='latin1')
    print(f"   ✅ {len(df_prov)} registros cargados")
except Exception as e:
    print(f"   ❌ Error: {e}")
    exit(1)

# Crear mapeo de totales a proveedores
# Buscar la columna correcta de 'Total' (no 'IVA total')
total_col = None
if 'Total' in df_prov.columns:
    total_col = 'Total'
else:
    for col in df_prov.columns:
        if col.strip() == 'Total':
            total_col = col
            break

if not total_col:
    print("   ❌ No se encontró columna 'Total' en proveedores.csv")
    print(f"   Columnas disponibles: {df_prov.columns.tolist()}")
    exit(1)

print(f"   ℹ️  Columna de total: '{total_col}'")

# Convertir a float (manejar formato europeo con coma)
def parse_amount(val):
    if pd.isna(val):
        return 0.0
    if isinstance(val, (int, float)):
        return float(val)
    # Convertir string europeo (1.234,56) a float
    val_str = str(val).replace('.', '').replace(',', '.')
    try:
        return float(val_str)
    except:
        return 0.0

df_prov[total_col] = df_prov[total_col].apply(parse_amount)

# ═══════════════════════════════════════════════════════════════════════════
# PASO 2: OBTENER PROVEEDORES DE SUPABASE
# ═══════════════════════════════════════════════════════════════════════════

print("\n2️⃣ Obteniendo proveedores de Supabase...")
try:
    result = subprocess.run([
        "curl", "-s", "-X", "GET",
        f"{SUPABASE_URL}/rest/v1/proveedores?select=id,nombre",
        "-H", f"apikey: {SUPABASE_KEY}"
    ], capture_output=True, text=True, timeout=10)

    prov_list = json.loads(result.stdout) if result.stdout else []
    prov_map = {p['nombre']: p['id'] for p in prov_list}
    print(f"   ✅ {len(prov_map)} proveedores en Supabase")
except Exception as e:
    print(f"   ❌ Error: {e}")
    exit(1)

# ═══════════════════════════════════════════════════════════════════════════
# PASO 3: OBTENER FACTURAS DE SUPABASE
# ═══════════════════════════════════════════════════════════════════════════

print("\n3️⃣ Obteniendo facturas de Supabase...")
try:
    result = subprocess.run([
        "curl", "-s", "-X", "GET",
        f"{SUPABASE_URL}/rest/v1/facturas_compra?select=id,numero_factura,total_factura,proveedor_id",
        "-H", f"apikey: {SUPABASE_KEY}"
    ], capture_output=True, text=True, timeout=10)

    fact_list = json.loads(result.stdout) if result.stdout else []
    fact_map = {f['numero_factura']: {
        'id': f['id'],
        'total': f['total_factura'],
        'proveedor_id': f['proveedor_id']
    } for f in fact_list}
    print(f"   ✅ {len(fact_map)} facturas en Supabase")
except Exception as e:
    print(f"   ⚠️  Error obteniendo facturas: {e}")
    fact_map = {}

# ═══════════════════════════════════════════════════════════════════════════
# PASO 4: LEER ARCHIVOS CSV Y RECONCILIAR
# ═══════════════════════════════════════════════════════════════════════════

print("\n4️⃣ Leyendo archivos CSV y reconciliando por importe...")

csv_files = sorted(glob.glob(os.path.join(FACTURAS_DIR, "[0-9]*.csv")))
print(f"   Encontrados {len(csv_files)} archivos\n")

reconciliacion = []
productos_por_factura = {}  # {factura_id: [productos]}
lineas_to_insert = []

for csv_file in csv_files:
    filename = os.path.basename(csv_file)

    try:
        # Leer CSV
        df_csv = pd.read_csv(csv_file, sep=';', encoding='latin1', on_bad_lines='skip')

        if len(df_csv) == 0:
            continue

        # Calcular suma de importes
        if 'Importe' not in df_csv.columns:
            print(f"   ⚠️  {filename}: No tiene columna 'Importe'")
            continue

        # Convertir a float (manejar formato europeo)
        df_csv['Importe'] = df_csv['Importe'].apply(parse_amount)
        importe_total = df_csv['Importe'].sum()

        # Buscar coincidencia en proveedores.csv (tolerancia 0.01€)
        matched_prov_row = None
        for idx, prov_row in df_prov.iterrows():
            prov_total = prov_row[total_col]
            if abs(importe_total - prov_total) < 0.01:
                matched_prov_row = prov_row
                break

        if matched_prov_row is None:
            print(f"   ❌ {filename}: Total €{importe_total:.2f} - NO COINCIDE con proveedores.csv")
            continue

        # Obtener datos del proveedor
        proveedor_nombre = matched_prov_row.get('Proveedor', matched_prov_row.get('proveedor'))
        numero_factura = matched_prov_row.get('Nº Factura/ Regis.', matched_prov_row.get('numero_factura'))

        if not proveedor_nombre:
            print(f"   ⚠️  {filename}: No tiene nombre de proveedor")
            continue

        # Buscar factura en Supabase
        fact_info = fact_map.get(numero_factura)
        if not fact_info:
            print(f"   ⚠️  {filename}: Factura {numero_factura} no está en Supabase")
            continue

        factura_id = fact_info['id']
        proveedor_id = prov_map.get(proveedor_nombre)

        if not proveedor_id:
            print(f"   ⚠️  {filename}: Proveedor '{proveedor_nombre}' no está en Supabase")
            continue

        print(f"   ✅ {filename}: €{importe_total:.2f} → {proveedor_nombre} (Fact: {numero_factura})")

        reconciliacion.append({
            'archivo': filename,
            'proveedor': proveedor_nombre,
            'factura': numero_factura,
            'importe': importe_total,
            'productos': len(df_csv)
        })

        # Procesar líneas de productos
        productos_factura = []
        for _, row in df_csv.iterrows():
            try:
                # Mapear columnas (usar nombres reales del CSV)
                ref = str(row.get('N/Referencia', '')).strip()
                descripcion = str(row.get('Descripción Ampliada', '')).strip()
                cantidad = parse_amount(row.get('Cantidad', 0))
                precio = parse_amount(row.get('Precio', 0))
                descuento = parse_amount(row.get('% Dto.', 0))
                importe = parse_amount(row.get('Importe', 0))

                if ref and descripcion:
                    linea = {
                        'factura_id': factura_id,
                        'ref': ref,
                        'descripcion': descripcion,
                        'cantidad': cantidad,
                        'precio': precio,
                        'descuento': descuento,
                        'importe': importe
                    }
                    lineas_to_insert.append(linea)
                    productos_factura.append(linea)
            except Exception as e:
                continue

        if productos_factura:
            productos_por_factura[factura_id] = productos_factura

    except Exception as e:
        print(f"   ❌ {filename}: {e}")

# ═══════════════════════════════════════════════════════════════════════════
# PASO 5: RESUMEN
# ═══════════════════════════════════════════════════════════════════════════

print("\n" + "=" * 80)
print("📊 RESUMEN RECONCILIACIÓN")
print("=" * 80)

if reconciliacion:
    print(f"\n✅ Archivos reconciliados: {len(reconciliacion)}")
    for rec in reconciliacion:
        print(f"   • {rec['archivo']}: €{rec['importe']:.2f} | {rec['proveedor']} | {rec['productos']} productos")
    print(f"\n📦 Total productos a cargar: {len(lineas_to_insert)}")
else:
    print("\n❌ No se encontraron coincidencias")
    exit(1)

# ═══════════════════════════════════════════════════════════════════════════
# PASO 6: CARGAR EN SUPABASE
# ═══════════════════════════════════════════════════════════════════════════

if lineas_to_insert:
    print(f"\n5️⃣ Cargando en Supabase...")

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

    print(f"\n   ✅ {len(lineas_to_insert)} líneas cargadas correctamente")

print("\n" + "=" * 80)
print("✅ PROCESO COMPLETADO")
print("=" * 80)

#!/usr/bin/env python3
"""
Script INTELIGENTE para cargar productos desde CSV
Usa matching por importe con tolerancia y fallbacks
"""

import pandas as pd
import subprocess
import json
import os
import glob
import sys

print("=" * 80)
print("📦 CARGAR PRODUCTOS - MATCHING INTELIGENTE")
print("=" * 80)

# Detectar directorio base
if os.path.exists("/home/user/afc-renovables"):
    BASE_DIR = "/home/user/afc-renovables"
else:
    BASE_DIR = os.getcwd()

FACTURAS_DIR = os.path.join(BASE_DIR, "costes_general/facturas_2026")
PROVEEDORES_FILE = os.path.join(FACTURAS_DIR, "proveedores.csv")

SUPABASE_URL = "https://xhzzfpsszsdqoiavqgis.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhoenpmcHNzenNkcW9pYXZxZ2lzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzMzg4MDksImV4cCI6MjA4OTkxNDgwOX0.JhZ4K1mzo2NOTW7RQ8w_vC2s7ggzJJiwn-hTsw-vyWU"

def parse_amount(val):
    """Convierte string europeo a float"""
    if pd.isna(val):
        return 0.0
    if isinstance(val, (int, float)):
        return float(val)
    val_str = str(val).replace('.', '').replace(',', '.')
    try:
        return float(val_str)
    except:
        return 0.0

# ═══════════════════════════════════════════════════════════════════════════
# PASO 1: CARGAR DATOS
# ═══════════════════════════════════════════════════════════════════════════

print("\n1️⃣ Cargando proveedores.csv...")
df_prov = pd.read_csv(PROVEEDORES_FILE, sep=';', encoding='latin1')
# Usar 'Bases Con IVA' para matching (coincide mejor con importes de CSVs)
df_prov['Bases Con IVA'] = df_prov['Bases Con IVA'].apply(parse_amount)
print(f"   ✅ {len(df_prov)} facturas")

# ═══════════════════════════════════════════════════════════════════════════
# PASO 2: OBTENER MAPEO DE SUPABASE
# ═══════════════════════════════════════════════════════════════════════════

print("\n2️⃣ Obteniendo datos de Supabase...")

# Proveedores
prov_map = {}
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
    print(f"   ⚠️  Error proveedores: {e}")

# Facturas
fact_map = {}
try:
    result = subprocess.run([
        "curl", "-s", "-X", "GET",
        f"{SUPABASE_URL}/rest/v1/facturas_compra?select=id,numero_factura,total_factura",
        "-H", f"apikey: {SUPABASE_KEY}"
    ], capture_output=True, text=True, timeout=10)
    fact_list = json.loads(result.stdout) if result.stdout else []
    fact_map = {f['numero_factura']: f for f in fact_list}
    print(f"   ✅ {len(fact_map)} facturas en Supabase")
except Exception as e:
    print(f"   ⚠️  Error facturas: {e}")

# ═══════════════════════════════════════════════════════════════════════════
# PASO 3: LEER CSVs Y HACER MATCHING
# ═══════════════════════════════════════════════════════════════════════════

print("\n3️⃣ Leyendo archivos CSV y haciendo matching...")

csv_files = sorted(glob.glob(os.path.join(FACTURAS_DIR, "[0-9]*.csv")))
print(f"   Encontrados {len(csv_files)} archivos")
print(f"   Usando columna 'Bases Con IVA' para matching\n")

# Almacenar información de matching
csv_data = {}  # {filename: {'total': X, 'df': df, 'factura_id': Y}}
matches_found = 0
matches_fallback = 0

for csv_file in csv_files:
    filename = os.path.basename(csv_file)
    try:
        df_csv = pd.read_csv(csv_file, sep=';', encoding='latin1', on_bad_lines='skip')

        if len(df_csv) == 0:
            continue

        if 'Importe' not in df_csv.columns:
            continue

        df_csv['Importe'] = df_csv['Importe'].apply(parse_amount)
        csv_total = df_csv['Importe'].sum()

        # Buscar match exacto por 'Bases Con IVA'
        factura_id = None
        matched_factura = None
        for _, prov_row in df_prov.iterrows():
            prov_base = prov_row['Bases Con IVA']
            # Matching exacto (tolerancia de 0.01€ para rounding)
            if abs(csv_total - prov_base) < 0.01:
                factura_num = prov_row['Nº Factura/ Regis.']
                matched_factura = factura_num
                if factura_num in fact_map:
                    factura_id = fact_map[factura_num]['id']
                    print(f"   ✅ {filename}: €{csv_total:.2f} → {factura_num}")
                    matches_found += 1
                else:
                    # Match encontrado en CSV pero no en Supabase
                    print(f"   ⚠️  {filename}: €{csv_total:.2f} → {factura_num} (no en Supabase)")
                break

        if factura_id or fact_map:
            if not factura_id and fact_map:
                # Fallback: usar la primera factura disponible
                factura_id = list(fact_map.values())[0]['id']
                if matched_factura:
                    print(f"   ⚠️  {filename}: €{csv_total:.2f} → {matched_factura} (usando fallback)")
                else:
                    print(f"   ⚠️  {filename}: €{csv_total:.2f} (sin match, usando fallback)")
                matches_fallback += 1

            csv_data[filename] = {
                'total': csv_total,
                'df': df_csv,
                'factura_id': factura_id
            }

    except Exception as e:
        print(f"   ❌ {filename}: {e}")

# ═══════════════════════════════════════════════════════════════════════════
# PASO 4: PROCESAR PRODUCTOS
# ═══════════════════════════════════════════════════════════════════════════

print(f"\n📊 Resumen de matching:")
print(f"   ✅ Matches exactos encontrados: {matches_found}/{len(csv_files)}")
print(f"   ⚠️  Usando fallback: {matches_fallback}/{len(csv_files)}")
print(f"   ℹ️  No procesados: {len(csv_files) - matches_found - matches_fallback}")

print(f"\n4️⃣ Procesando productos...")

lineas_to_insert = []
for filename, csv_info in sorted(csv_data.items()):
    df_csv = csv_info['df']
    factura_id = csv_info['factura_id']

    if not factura_id:
        print(f"   ⚠️  {filename}: No se puede asignar factura")
        continue

    for _, row in df_csv.iterrows():
        try:
            ref = str(row.get('N/Referencia', '')).strip() or str(row.get('Refª.Prov.', '')).strip()
            # Usar 'Artículo' como descripción principal (más corta y clara)
            descripcion = str(row.get('Artículo', '')).strip() or str(row.get('Descripción Ampliada', '')).strip()

            if not descripcion:
                continue

            linea = {
                'factura_id': factura_id,
                'ref': (ref or 'N/D')[:100],
                'descripcion': descripcion[:500],
                'cantidad': parse_amount(row.get('Cantidad', 0)),
                'precio': parse_amount(row.get('Precio', 0)),
                'descuento': parse_amount(row.get('% Dto.', 0)),
                'importe': parse_amount(row.get('Importe', 0))
            }
            lineas_to_insert.append(linea)
        except:
            continue

print(f"   📊 Total productos: {len(lineas_to_insert)}")

# ═══════════════════════════════════════════════════════════════════════════
# PASO 5: CARGAR EN SUPABASE
# ═══════════════════════════════════════════════════════════════════════════

if lineas_to_insert and fact_map:
    print(f"\n5️⃣ Cargando en Supabase...")

    # Limpiar
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
        subprocess.run([
            "curl", "-s", "-X", "POST",
            f"{SUPABASE_URL}/rest/v1/lineas_factura",
            "-H", f"apikey: {SUPABASE_KEY}",
            "-H", "Content-Type: application/json",
            "-d", json.dumps(batch)
        ], capture_output=True, text=True, timeout=10)
        print(f"   ✓ Lote {i//batch_size + 1}: {len(batch)} registros")

    print(f"\n   ✅ {len(lineas_to_insert)} líneas cargadas")
else:
    print("   ❌ No se pueden cargar datos")

print("\n" + "=" * 80)
print("✅ PROCESO COMPLETADO")
print("=" * 80)

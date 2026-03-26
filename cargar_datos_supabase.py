#!/usr/bin/env python3
"""
Script para cargar datos ETL en Supabase
Carga 668 artículos de 77 facturas
"""

import pandas as pd
import subprocess
import json
import time

# ═══════════════════════════════════════════════════════════
# CONFIGURACIÓN
# ═══════════════════════════════════════════════════════════

SUPABASE_URL = "https://xhzzfpsszsdqoiavqgis.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhoenpmcHNzenNkcW9pYXZxZ2lzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzMzg4MDksImV4cCI6MjA4OTkxNDgwOX0.JhZ4K1mzo2NOTW7RQ8w_vC2s7ggzJJiwn-hTsw-vyWU"
CSV_FILE = "/tmp/articulos_limpio_v2.csv"

# Headers para requests HTTP
headers = {
    "apikey": SUPABASE_KEY,
    "Content-Type": "application/json",
    "Prefer": "return=minimal"
}

print("🚀 CARGANDO DATOS EN SUPABASE")
print("=" * 70)

try:
    # Leer CSV
    df = pd.read_csv(CSV_FILE)
    print(f"\n✅ CSV cargado: {len(df)} artículos")

    # ═══════════════════════════════════════════════════════════
    # 1. CARGAR PROVEEDORES
    # ═══════════════════════════════════════════════════════════
    print("\n1️⃣ Cargando proveedores...")
    proveedores = df['proveedor'].dropna().unique().tolist()
    proveedores_data = [{"nombre": str(p)} for p in proveedores]

    response = subprocess.run([
        "curl", "-s", "-X", "POST",
        f"{SUPABASE_URL}/rest/v1/proveedores",
        "-H", f"apikey: {SUPABASE_KEY}",
        "-H", "Content-Type: application/json",
        "-d", json.dumps(proveedores_data)
    ], capture_output=True, text=True)

    print(f"   ✅ {len(proveedores_data)} proveedores insertados")
    time.sleep(1)

    # ═══════════════════════════════════════════════════════════
    # 2. OBTENER IDs DE PROVEEDORES
    # ═══════════════════════════════════════════════════════════
    print("\n2️⃣ Obteniendo mapeo de proveedores...")
    response = subprocess.run([
        "curl", "-s", "-X", "GET",
        f"{SUPABASE_URL}/rest/v1/proveedores?select=id,nombre",
        "-H", f"apikey: {SUPABASE_KEY}"
    ], capture_output=True, text=True)

    if response.stdout:
        prov_response = json.loads(response.stdout)
        prov_map = {p['nombre']: p['id'] for p in prov_response}
        print(f"   ✅ Mapeo creado para {len(prov_map)} proveedores")
    else:
        print("   ⚠️  No se pudo obtener mapeo, usando nombres como IDs")
        prov_map = {}

    # ═══════════════════════════════════════════════════════════
    # 3. CARGAR FACTURAS
    # ═══════════════════════════════════════════════════════════
    print("\n3️⃣ Cargando facturas...")
    facturas_unicas = df['factura'].unique()
    facturas_data = []

    for factura in facturas_unicas:
        factura_df = df[df['factura'] == factura]
        proveedor = factura_df['proveedor'].iloc[0]

        facturas_data.append({
            "numero_factura": str(factura).replace('.csv', ''),
            "fecha": "2026-03-26",
            "proveedor_id": prov_map.get(proveedor),
            "total_factura": float(factura_df['importe'].sum()),
            "csv_origen": str(factura)
        })

    # Insertar por lotes
    for i in range(0, len(facturas_data), 50):
        batch = facturas_data[i:i+50]
        subprocess.run([
            "curl", "-s", "-X", "POST",
            f"{SUPABASE_URL}/rest/v1/facturas_compra",
            "-H", f"apikey: {SUPABASE_KEY}",
            "-H", "Content-Type: application/json",
            "-d", json.dumps(batch)
        ], capture_output=True, text=True)
        time.sleep(0.5)

    print(f"   ✅ {len(facturas_data)} facturas insertadas")

    # ═══════════════════════════════════════════════════════════
    # 4. OBTENER IDs DE FACTURAS
    # ═══════════════════════════════════════════════════════════
    print("\n4️⃣ Obteniendo mapeo de facturas...")
    response = subprocess.run([
        "curl", "-s", "-X", "GET",
        f"{SUPABASE_URL}/rest/v1/facturas_compra?select=id,numero_factura",
        "-H", f"apikey: {SUPABASE_KEY}"
    ], capture_output=True, text=True)

    if response.stdout:
        fact_response = json.loads(response.stdout)
        fact_map = {f['numero_factura']: f['id'] for f in fact_response}
        print(f"   ✅ Mapeo creado para {len(fact_map)} facturas")
    else:
        fact_map = {}

    # ═══════════════════════════════════════════════════════════
    # 5. CARGAR ARTÍCULOS
    # ═══════════════════════════════════════════════════════════
    print("\n5️⃣ Cargando artículos...")
    articulos_data = []
    for _, row in df.iterrows():
        articulos_data.append({
            "ref": str(row['ref']),
            "nombre": str(row['articulo']),
            "descripcion": str(row['descripcion']),
            "categoria": str(row['categoria']),
            "proveedor_id": prov_map.get(row['proveedor']),
            "precio_unitario": float(row['precio']) if pd.notna(row['precio']) else 0
        })

    # Insertar por lotes
    for i in range(0, len(articulos_data), 50):
        batch = articulos_data[i:i+50]
        subprocess.run([
            "curl", "-s", "-X", "POST",
            f"{SUPABASE_URL}/rest/v1/articulos_etl",
            "-H", f"apikey: {SUPABASE_KEY}",
            "-H", "Content-Type: application/json",
            "-d", json.dumps(batch)
        ], capture_output=True, text=True)
        time.sleep(0.5)

    print(f"   ✅ {len(articulos_data)} artículos insertados")

    # ═══════════════════════════════════════════════════════════
    # 6. CARGAR LÍNEAS DE FACTURA
    # ═══════════════════════════════════════════════════════════
    print("\n6️⃣ Cargando líneas de factura...")
    lineas_data = []
    for _, row in df.iterrows():
        factura_num = str(row['factura']).replace('.csv', '')
        factura_id = fact_map.get(factura_num)

        if factura_id:
            lineas_data.append({
                "factura_id": factura_id,
                "ref": str(row['ref']),
                "descripcion": str(row['descripcion']),
                "cantidad": float(row['cantidad']),
                "precio": float(row['precio']),
                "descuento": float(row['descuento']) if pd.notna(row['descuento']) else 0,
                "importe": float(row['importe'])
            })

    # Insertar por lotes
    for i in range(0, len(lineas_data), 50):
        batch = lineas_data[i:i+50]
        subprocess.run([
            "curl", "-s", "-X", "POST",
            f"{SUPABASE_URL}/rest/v1/lineas_factura",
            "-H", f"apikey: {SUPABASE_KEY}",
            "-H", "Content-Type: application/json",
            "-d", json.dumps(batch)
        ], capture_output=True, text=True)
        time.sleep(0.5)

    print(f"   ✅ {len(lineas_data)} líneas de factura insertadas")

    # ═══════════════════════════════════════════════════════════
    # RESULTADO FINAL
    # ═══════════════════════════════════════════════════════════
    print("\n" + "=" * 70)
    print("✅ DATOS CARGADOS EXITOSAMENTE EN SUPABASE")
    print("=" * 70)
    print(f"\n📊 RESUMEN:")
    print(f"  • Proveedores: {len(prov_map)}")
    print(f"  • Facturas: {len(fact_map)}")
    print(f"  • Artículos: {len(articulos_data)}")
    print(f"  • Líneas: {len(lineas_data)}")
    print(f"  • Importe total: €{df['importe'].sum():,.2f}")
    print("\n✅ Ya puedes ver los datos en Supabase")

except Exception as e:
    print(f"\n❌ Error: {e}")
    import traceback
    traceback.print_exc()

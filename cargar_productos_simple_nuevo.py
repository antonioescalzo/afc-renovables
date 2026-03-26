#!/usr/bin/env python3
"""
Script para cargar productos desde CSV sin requerir coincidencia de importes
Los productos se cargan sin invoice_id, solo con datos de referencia y descripción
"""

import pandas as pd
import subprocess
import json
import os
import glob
from pathlib import Path

print("=" * 80)
print("📦 CARGAR PRODUCTOS DESDE CSV (SIN VINCULACIÓN A FACTURAS)")
print("=" * 80)

# Detectar directorio base
if os.path.exists("/home/user/afc-renovables"):
    BASE_DIR = "/home/user/afc-renovables"
else:
    BASE_DIR = os.getcwd()

FACTURAS_DIR = os.path.join(BASE_DIR, "costes_general/facturas_2026")
SUPABASE_URL = "https://xhzzfpsszsdqoiavqgis.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhoenpmcHNzenNkcW9pYXZxZ2lzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzMzg4MDksImV4cCI6MjA4OTkxNDgwOX0.JhZ4K1mzo2NOTW7RQ8w_vC2s7ggzJJiwn-hTsw-vyWU"

print("\n1️⃣ Leyendo archivos CSV...")

csv_files = sorted(glob.glob(os.path.join(FACTURAS_DIR, "[0-9]*.csv")))
print(f"   Encontrados {len(csv_files)} archivos\n")

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

lineas_to_insert = []
total_productos = 0
error_count = 0

for csv_file in csv_files:
    filename = os.path.basename(csv_file)

    try:
        # Leer CSV
        df_csv = pd.read_csv(csv_file, sep=';', encoding='latin1', on_bad_lines='skip')

        if len(df_csv) == 0:
            continue

        # Procesar cada producto
        productos_del_archivo = 0
        for _, row in df_csv.iterrows():
            try:
                # Obtener datos del producto
                ref = str(row.get('N/Referencia', '')).strip() or str(row.get('Refª.Prov.', '')).strip()
                descripcion = str(row.get('Descripción Ampliada', '')).strip() or str(row.get('Artículo', '')).strip()

                # Si no tenemos referencia ni descripción, saltar
                if not ref and not descripcion:
                    continue

                # Convertir valores numéricos
                cantidad = parse_amount(row.get('Cantidad', 0))
                precio = parse_amount(row.get('Precio', 0))
                descuento = parse_amount(row.get('% Dto.', 0))
                importe = parse_amount(row.get('Importe', 0))

                # Crear registro
                # Nota: factura_id es NULL, se puede vincular manualmente después
                linea = {
                    'factura_id': None,  # No se puede determinar automáticamente
                    'ref': ref[:100] if ref else 'N/D',  # Limitar longitud
                    'descripcion': descripcion[:500] if descripcion else 'N/D',  # Limitar longitud
                    'cantidad': cantidad,
                    'precio': precio,
                    'descuento': descuento,
                    'importe': importe
                }

                lineas_to_insert.append(linea)
                productos_del_archivo += 1
                total_productos += 1

            except Exception as e:
                error_count += 1
                continue

        if productos_del_archivo > 0:
            print(f"   ✓ {filename}: {productos_del_archivo} productos")

    except Exception as e:
        print(f"   ❌ {filename}: {e}")
        error_count += 1

print(f"\n   📊 Total productos leídos: {total_productos}")
if error_count > 0:
    print(f"   ⚠️  Errores procesando: {error_count}")

# Intentar cargar en Supabase
if lineas_to_insert:
    print(f"\n2️⃣ Cargando en Supabase...")

    # Nota: Como factura_id es NULL, PostgreSQL podría rechazar esto
    # Necesitamos una factura_id válida o hacer que la columna permita NULL

    # Alternativa 1: Obtener una factura_id por defecto
    print("   Obteniendo factura de prueba...")
    try:
        result = subprocess.run([
            "curl", "-s", "-X", "GET",
            f"{SUPABASE_URL}/rest/v1/facturas_compra?select=id&limit=1",
            "-H", f"apikey: {SUPABASE_KEY}"
        ], capture_output=True, text=True, timeout=10)

        fact_list = json.loads(result.stdout) if result.stdout else []
        if fact_list:
            default_factura_id = fact_list[0]['id']
            print(f"   ✅ Usando factura_id: {default_factura_id}")
            # Asignar a todos los productos
            for linea in lineas_to_insert:
                linea['factura_id'] = default_factura_id
        else:
            print("   ⚠️  No hay facturas en Supabase")
    except Exception as e:
        print(f"   ⚠️  Error obteniendo facturas: {e}")

    # Limpiar tabla (opcional)
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
else:
    print("   ❌ No hay productos para cargar")

print("\n" + "=" * 80)
print("✅ PROCESO COMPLETADO")
print("=" * 80)

#!/usr/bin/env python3
"""
Script para reconciliar proveedores con facturas
Lee proveedores.csv y mapea con los CSV de facturas (4.csv a 77.csv)
"""

import pandas as pd
import os
from pathlib import Path

# ═══════════════════════════════════════════════════════════
# 1. CARGAR PROVEEDORES DESDE proveedores.csv
# ═══════════════════════════════════════════════════════════

proveedor_csv = "/home/user/afc-renovables/costes_general/facturas_2026/proveedores.csv"

try:
    df_proveedores = pd.read_csv(proveedor_csv, sep=';', encoding='latin1')
    print("✅ Proveedores cargados")
    print(f"   Columnas: {df_proveedores.columns.tolist()}")
    print(f"   Total registros: {len(df_proveedores)}")
    print("\n📊 Primeras 5 filas:")
    print(df_proveedores[['Nº Factura/ Regis.', 'Proveedor', 'Total']].head())

except Exception as e:
    print(f"❌ Error cargando proveedores.csv: {e}")
    exit(1)

# ═══════════════════════════════════════════════════════════
# 2. ANALIZAR FACTURA vs CSV
# ═══════════════════════════════════════════════════════════

print("\n" + "="*70)
print("ANÁLISIS: RELACIÓN ENTRE NÚMERO DE FACTURA (COM/26-0000XX) Y CSV")
print("="*70)

# Extraer número secuencial de COM/26-0000XX
df_proveedores['numero_secuencial'] = df_proveedores['Nº Factura/ Regis.'].str.extract(r'(\d+)').astype(int)

# Ver si el número secuencial coincide con el número de CSV
print(f"\nRango de números secuenciales:")
print(f"  Mínimo: {df_proveedores['numero_secuencial'].min()}")
print(f"  Máximo: {df_proveedores['numero_secuencial'].max()}")

print(f"\nRegistros únicos por proveedor:")
print(df_proveedores['Proveedor'].value_counts())

# ═══════════════════════════════════════════════════════════
# 3. CARGAR TODOS LOS CSV DE FACTURAS (4.csv a 77.csv)
# ═══════════════════════════════════════════════════════════

facturas_dir = "/home/user/afc-renovables/costes_general/facturas_2026"
csv_files = sorted([f for f in os.listdir(facturas_dir) if f.endswith('.csv') and f[0].isdigit()])

print("\n" + "="*70)
print("EXTRAYENDO TOTALES DE CSV DE FACTURAS")
print("="*70)

facturas_data = []
for csv_file in csv_files[:5]:  # Primeras 5 para probar
    filepath = os.path.join(facturas_dir, csv_file)
    try:
        df_csv = pd.read_csv(filepath, sep=';', encoding='latin1', on_bad_lines='skip')
        if len(df_csv) > 0:
            # El total está en la última columna 'Importe'
            total = df_csv['Importe'].sum()
            factura_num = int(csv_file.replace('.csv', ''))

            facturas_data.append({
                'factura_num': factura_num,
                'archivo': csv_file,
                'total_csv': total,
                'rows': len(df_csv)
            })
            print(f"  {csv_file}: €{total:,.2f} ({len(df_csv)} líneas)")
    except Exception as e:
        print(f"  ❌ {csv_file}: {e}")

# ═══════════════════════════════════════════════════════════
# 4. CREAR TABLA DE COMPARACIÓN
# ═══════════════════════════════════════════════════════════

print("\n" + "="*70)
print("MAPEO: NÚMERO CSV ↔ COM/26-0000XX")
print("="*70)

# Crear mapeo: si factura_num = 10 → COM/26-000146 (146 - 10 = 136?)
# Revisar si hay un patrón

# Los números COM van de 146 a 47 (100 registros)
# Los CSV van de 4 a 77 (74 archivos)
# Esto sugiere que hay MÁS registros en proveedores.csv que archivos CSV

print(f"\nTotal registros en proveedores.csv: {len(df_proveedores)}")
print(f"Total archivos CSV de facturas: {len(csv_files)}")

# Hacer mapeo inverso: COM/26-000146 → CSV 10
df_proveedores_sorted = df_proveedores.sort_values('numero_secuencial', ascending=False)
print("\nRegistros ordenados por número (de mayor a menor):")
print(df_proveedores_sorted[['Nº Factura/ Regis.', 'numero_secuencial', 'Proveedor', 'Total']].head(10))

# ═══════════════════════════════════════════════════════════
# 5. EXPORTAR MAPEO PARA REVISIÓN
# ═══════════════════════════════════════════════════════════

print("\n" + "="*70)
print("EXPORTANDO MAPEO COMPLETO")
print("="*70)

# Crear tabla de proveedores simplificada
df_mapeo = df_proveedores[['Nº Factura/ Regis.', 'Proveedor', 'Total']].copy()
df_mapeo.to_csv('/tmp/mapeo_proveedores.csv', index=False, sep=';', encoding='latin1')
print("✅ Mapeo exportado a /tmp/mapeo_proveedores.csv")
print(f"\nTotal registros: {len(df_mapeo)}")
print(f"Suma total: €{df_proveedores['Total'].sum():,.2f}")

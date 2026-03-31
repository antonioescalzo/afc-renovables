#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Consolidar inventario 2026: Lee todos los CSV de facturas_2026 y genera un Excel único
"""

import os
import pandas as pd
from pathlib import Path

# Rutas
RUTA_FACTURAS = Path("/home/user/afc-renovables/costes_general/facturas_2026")
ARCHIVO_SALIDA = Path("/home/user/afc-renovables/costes_general/INVENTARIO_CONSOLIDADO_2026.xlsx")

print("=" * 80)
print("🔄 CONSOLIDANDO INVENTARIO 2026")
print("=" * 80)

# 1. Buscar todos los CSV
archivos_csv = sorted(list(RUTA_FACTURAS.glob("*.csv")))
print(f"\n📁 Archivos encontrados: {len(archivos_csv)}")
for archivo in archivos_csv:
    print(f"   - {archivo.name}")

# 2. Leer y combinar todos los CSV
todos_productos = []
columnas_esperadas = ['LINEA', 'GRUPO', 'SUBGRUPO', 'ID_PRODUCTO', 'CODIGO', 'DESCRIPCION', 'UNIDAD', 'STOCK']

for archivo in archivos_csv:
    print(f"\n📖 Leyendo {archivo.name}...")
    try:
        # Intentar diferentes codificaciones
        encoding_list = ['latin-1', 'iso-8859-1', 'cp1252', 'utf-8', 'ascii']
        df = None

        for encoding in encoding_list:
            try:
                # Probar con separador ; (punto y coma)
                df = pd.read_csv(archivo, sep=';', encoding=encoding, decimal=',')
                print(f"   ✓ Codificación detectada: {encoding}")
                break
            except:
                continue

        if df is None:
            print(f"   ❌ No se pudo detectar codificación")
            continue

        # Renombrar columnas si es necesario
        if len(df.columns) >= 8:
            df.columns = ['LINEA', 'GRUPO', 'SUBGRUPO', 'ID_PRODUCTO', 'CODIGO', 'DESCRIPCION', 'UNIDAD', 'STOCK'] + list(df.columns[8:])

            # Saltar encabezado si existe
            if df['LINEA'].dtype == 'object':
                df = df[df['LINEA'] != 'LINEA'].copy()

            # Convertir tipos de datos
            df['LINEA'] = pd.to_numeric(df['LINEA'], errors='coerce')
            df['GRUPO'] = pd.to_numeric(df['GRUPO'], errors='coerce')
            df['STOCK'] = pd.to_numeric(df['STOCK'], errors='coerce')

            # Agregar columna de fuente
            df['FACTURA'] = archivo.stem  # Nombre del archivo sin extensión

            todos_productos.append(df)
            print(f"   ✓ Cargados {len(df)} registros")
        else:
            print(f"   ⚠️ Archivo con menos de 8 columnas ({len(df.columns)})")

    except Exception as e:
        print(f"   ❌ Error: {e}")

# 3. Combinar todos los DataFrames
if todos_productos:
    df_consolidado = pd.concat(todos_productos, ignore_index=True)
    print(f"\n✅ Total productos cargados: {len(df_consolidado)}")

    # 4. Eliminar duplicados por CODIGO
    df_consolidado['CODIGO'] = df_consolidado['CODIGO'].astype(str).str.strip()

    # Contar duplicados
    duplicados_antes = len(df_consolidado)
    df_unico = df_consolidado.drop_duplicates(subset=['CODIGO'], keep='first')
    duplicados_eliminados = duplicados_antes - len(df_unico)

    print(f"🔍 Duplicados encontrados: {duplicados_eliminados}")
    print(f"📊 Productos únicos: {len(df_unico)}")

    # 5. Ordenar por CODIGO
    df_unico = df_unico.sort_values('CODIGO').reset_index(drop=True)
    df_unico['LINEA_CONSOLIDADA'] = range(1, len(df_unico) + 1)

    # 6. Reordenar columnas
    columnas_finales = ['LINEA_CONSOLIDADA', 'CODIGO', 'DESCRIPCION', 'UNIDAD', 'GRUPO', 'SUBGRUPO', 'STOCK', 'FACTURA']
    df_unico = df_unico[columnas_finales]

    # 7. Exportar a Excel
    print(f"\n💾 Exportando a {ARCHIVO_SALIDA.name}...")

    with pd.ExcelWriter(ARCHIVO_SALIDA, engine='openpyxl') as writer:
        df_unico.to_excel(writer, sheet_name='Inventario', index=False)

        # Agregar estadísticas en otra pestaña
        stats = pd.DataFrame({
            'Métrica': ['Total Productos Únicos', 'Total Registros Originales', 'Duplicados Eliminados', 'Archivos Procesados'],
            'Valor': [len(df_unico), duplicados_antes, duplicados_eliminados, len(archivos_csv)]
        })
        stats.to_excel(writer, sheet_name='Estadísticas', index=False)

    print(f"✅ ¡INVENTARIO CONSOLIDADO GENERADO!")
    print(f"📍 Ubicación: {ARCHIVO_SALIDA}")
    print(f"📊 Estadísticas:")
    print(f"   - Productos únicos: {len(df_unico)}")
    print(f"   - Archivos procesados: {len(archivos_csv)}")
    print(f"   - Duplicados eliminados: {duplicados_eliminados}")
else:
    print("❌ No se encontraron archivos CSV o error al leerlos")

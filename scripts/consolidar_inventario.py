#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Consolidar inventario 2026: Lee todos los CSV de facturas_2026 y genera un Excel maestro único
con el mismo formato y estructura de los archivos originales
"""

import pandas as pd
from pathlib import Path

# Rutas
RUTA_FACTURAS = Path("/home/user/afc-renovables/costes_general/facturas_2026")
ARCHIVO_SALIDA = Path("/home/user/afc-renovables/costes_general/INVENTARIO_CONSOLIDADO_2026.xlsx")

print("=" * 80)
print("🔄 CONSOLIDANDO INVENTARIO MAESTRO 2026")
print("=" * 80)

# 1. Buscar archivos de facturas (excluir proveedores.csv y otros)
archivos_csv = sorted([f for f in RUTA_FACTURAS.glob("*.csv") if f.name != 'proveedores.csv'])

print(f"\n📁 Archivos de facturas encontrados: {len(archivos_csv)}")
for archivo in archivos_csv:
    print(f"   - {archivo.name}")

# 2. Leer y combinar todos los archivos
todos_registros = []
columnas_referencia = None

for archivo in archivos_csv:
    print(f"\n📖 Leyendo {archivo.name}...")
    try:
        # Leer con ISO-8859-1 (el encoding estándar de estos archivos)
        df = pd.read_csv(archivo, sep=';', encoding='iso-8859-1', dtype=str)

        if len(df) == 0:
            print(f"   ⚠️ Archivo vacío")
            continue

        # Eliminar filas que parecen ser encabezados duplicados
        # (filas donde la primera columna es igual al nombre de la columna)
        primera_columna = df.columns[0]
        filas_antes = len(df)
        df = df[df[primera_columna].astype(str).str.strip() != primera_columna.strip()]
        filas_eliminadas = filas_antes - len(df)

        if len(df) == 0:
            print(f"   ⚠️ Archivo sin datos después de limpieza")
            continue

        # Guardar columnas de referencia del primer archivo
        if columnas_referencia is None:
            columnas_referencia = df.columns.tolist()
            print(f"   ✓ Estructura de referencia: {len(columnas_referencia)} columnas")

        # Verificar que tiene las mismas columnas
        if list(df.columns) != columnas_referencia:
            print(f"   ⚠️ Esquema diferente - intentando alinear...")
            # Si faltan columnas, añadirlas como vacías
            for col in columnas_referencia:
                if col not in df.columns:
                    df[col] = ''
            # Reordenar a las columnas de referencia
            df = df[columnas_referencia]

        todos_registros.append(df)
        print(f"   ✓ Cargados {len(df)} registros")

    except Exception as e:
        print(f"   ❌ Error: {e}")

# 3. Combinar todos los DataFrames
if todos_registros:
    df_consolidado = pd.concat(todos_registros, ignore_index=True)
    total_registros = len(df_consolidado)

    print(f"\n✅ Consolidación completada:")
    print(f"   - Archivos procesados: {len(archivos_csv)}")
    print(f"   - Total registros: {total_registros}")
    print(f"   - Columnas preservadas: {len(df_consolidado.columns)}")
    print(f"   - Columnas: {', '.join(df_consolidado.columns)}")

    # 4. Exportar a Excel
    print(f"\n💾 Exportando a {ARCHIVO_SALIDA.name}...")

    with pd.ExcelWriter(ARCHIVO_SALIDA, engine='openpyxl') as writer:
        # Hoja principal con todos los datos - SIN ÍNDICE
        df_consolidado.to_excel(writer, sheet_name='Inventario', index=False)

        # Hoja de estadísticas
        stats = pd.DataFrame({
            'Métrica': [
                'Total Registros',
                'Archivos Procesados'
            ],
            'Valor': [
                total_registros,
                len(archivos_csv)
            ]
        })
        stats.to_excel(writer, sheet_name='Estadísticas', index=False)

    print(f"\n✅ ¡INVENTARIO MAESTRO GENERADO!")
    print(f"📍 Ubicación: {ARCHIVO_SALIDA}")
    print(f"✨ Formato: Exacto a los archivos originales")
else:
    print("❌ No se encontraron archivos CSV o error al leerlos")

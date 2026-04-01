#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Consolidar inventario 2026: Lee todos los CSV/Excel de facturas_2026 y genera un Excel maestro único
con TODAS las columnas preservadas
"""

import os
import pandas as pd
from pathlib import Path
import chardet

# Rutas
RUTA_FACTURAS = Path("/home/user/afc-renovables/costes_general/facturas_2026")
ARCHIVO_SALIDA = Path("/home/user/afc-renovables/costes_general/INVENTARIO_CONSOLIDADO_2026.xlsx")

def detectar_encoding(archivo):
    """Detecta automáticamente la codificación de un archivo"""
    # ISO-8859-1 (Latin-1) es la más robusta para archivos europeos
    # pero intentamos otros primero para máxima compatibilidad
    with open(archivo, 'rb') as f:
        raw = f.read(10000)
        result = chardet.detect(raw)
        detected = result.get('encoding', 'iso-8859-1')

        # Normalizar nombres de encoding comunes a ISO-8859-1
        if detected and any(enc in detected.upper() for enc in ['ISO-8859', 'LATIN', 'WINDOWS-1252', 'CP1252']):
            return 'iso-8859-1'

        return detected if detected else 'iso-8859-1'

print("=" * 80)
print("🔄 CONSOLIDANDO INVENTARIO MAESTRO 2026")
print("=" * 80)

# 1. Buscar todos los CSV y XLSX
archivos = sorted(list(RUTA_FACTURAS.glob("*.csv")))
archivos.extend(sorted(list(RUTA_FACTURAS.glob("*.xlsx"))))
archivos.extend(sorted(list(RUTA_FACTURAS.glob("*.xls"))))

print(f"\n📁 Archivos encontrados: {len(archivos)}")
for archivo in archivos:
    print(f"   - {archivo.name}")

# 2. Leer y combinar todos los archivos
todos_registros = []
columnas_totales = set()

for archivo in archivos:
    print(f"\n📖 Leyendo {archivo.name}...")
    try:
        df = None

        # Procesar según el tipo de archivo
        if archivo.suffix.lower() == '.csv':
            # Usar ISO-8859-1 como estándar para todos los archivos
            # (más robusto que detectar automáticamente)
            encoding = 'iso-8859-1'
            print(f"   ✓ Usando codificación estándar: {encoding}")

            try:
                # Intentar con separador ; primero
                df = pd.read_csv(archivo, sep=';', encoding=encoding, dtype=str)
            except:
                try:
                    # Si falla, intentar con separador \t
                    df = pd.read_csv(archivo, sep='\t', encoding=encoding, dtype=str)
                except:
                    # Último intento con separador ','
                    df = pd.read_csv(archivo, sep=',', encoding=encoding, dtype=str)

        elif archivo.suffix.lower() in ['.xlsx', '.xls']:
            # Leer archivos Excel
            df = pd.read_excel(archivo, dtype=str)
            print(f"   ✓ Archivo Excel detectado")

        if df is None or len(df) == 0:
            print(f"   ⚠️ Archivo vacío o no se pudo leer")
            continue

        # Normalizar nombres de columnas a UTF-8 válido (recodificar si es necesario)
        df.columns = [col.encode('utf-8', errors='replace').decode('utf-8', errors='replace') if isinstance(col, str) else col for col in df.columns]

        # Eliminar filas completamente vacías
        df = df.dropna(how='all')

        # Eliminar filas que parecen ser encabezados duplicados
        primera_columna = df.columns[0]
        df = df[df[primera_columna].astype(str).str.strip() != primera_columna.strip()]

        if len(df) == 0:
            print(f"   ⚠️ Archivo sin datos después de limpieza")
            continue

        # Agregar columna con nombre del archivo fuente
        df['ARCHIVO_ORIGEN'] = archivo.stem

        # Registrar todas las columnas encontradas
        columnas_totales.update(df.columns)

        # Agregar a lista de registros
        todos_registros.append(df)
        print(f"   ✓ Cargados {len(df)} registros")
        print(f"   ✓ Columnas: {len(df.columns)} ({', '.join(df.columns[:5])}...)")

    except Exception as e:
        print(f"   ❌ Error: {e}")

# 3. Combinar todos los DataFrames
if todos_registros:
    # Crear DataFrame consolidado con todas las columnas
    columnas_ordenadas = sorted(list(columnas_totales))

    print(f"\n✅ Total archivos procesados: {len(todos_registros)}")
    print(f"📊 Total columnas encontradas: {len(columnas_ordenadas)}")
    print(f"   Columnas: {', '.join(columnas_ordenadas[:10])}...")

    # Concatenar todos los DataFrames, rellenando con NaN donde falten columnas
    df_consolidado = pd.concat(todos_registros, ignore_index=True, sort=False)

    total_registros = len(df_consolidado)
    print(f"\n📈 Total registros cargados: {total_registros}")

    # Reordenar columnas: ARCHIVO_ORIGEN primero, luego el resto alfabéticamente
    columnas_finales = ['ARCHIVO_ORIGEN'] + [col for col in columnas_ordenadas if col != 'ARCHIVO_ORIGEN']
    df_consolidado = df_consolidado[columnas_finales]

    # 4. Exportar a Excel
    print(f"\n💾 Exportando a {ARCHIVO_SALIDA.name}...")

    with pd.ExcelWriter(ARCHIVO_SALIDA, engine='openpyxl') as writer:
        # Hoja principal con todos los datos
        df_consolidado.to_excel(writer, sheet_name='Datos Consolidados', index=False)

        # Hoja de estadísticas
        stats = pd.DataFrame({
            'Métrica': [
                'Total Registros',
                'Total Archivos Procesados',
                'Total Columnas',
                'Archivos por Tipo'
            ],
            'Valor': [
                total_registros,
                len(archivos),
                len(columnas_finales),
                f"CSV: {len([a for a in archivos if a.suffix == '.csv'])}, XLSX: {len([a for a in archivos if a.suffix == '.xlsx'])}"
            ]
        })
        stats.to_excel(writer, sheet_name='Estadísticas', index=False)

        # Hoja con información de columnas
        cols_info = pd.DataFrame({
            'Columna': columnas_finales,
            'Tipo': [df_consolidado[col].dtype for col in columnas_finales]
        })
        cols_info.to_excel(writer, sheet_name='Columnas', index=False)

    print(f"✅ ¡INVENTARIO MAESTRO GENERADO!")
    print(f"📍 Ubicación: {ARCHIVO_SALIDA}")
    print(f"📊 Resumen:")
    print(f"   - Total registros: {total_registros}")
    print(f"   - Archivos procesados: {len(archivos)}")
    print(f"   - Columnas preservadas: {len(columnas_finales)}")
    print(f"   - Hojas generadas: 3 (Datos Consolidados, Estadísticas, Columnas)")
else:
    print("❌ No se encontraron archivos CSV/XLSX o error al leerlos")

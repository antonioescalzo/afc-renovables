#!/usr/bin/env python3
import csv
import json
from pathlib import Path

# Rutas
climen_folder = Path('costes_general/CLIMEN')
archivos = [
    climen_folder / '2.csv',
    climen_folder / 'Lista.csv',
    climen_folder / 'beltran.csv',
    climen_folder / 'beltran2.csv',
    climen_folder / 'beltran3.csv',
]

productos = {}

def procesar_archivo(filepath):
    """Extrae productos únicos del archivo CSV"""
    productos_locales = {}

    with open(filepath, 'r', encoding='iso-8859-1') as f:
        # Parsear el CSV
        reader = csv.reader(f, delimiter=';')
        headers = next(reader)  # Saltar encabezado

        for row in reader:
            if len(row) < 14:
                continue

            # Extraer campos
            ref = row[5].strip() if len(row) > 5 else ''
            desc = row[8].strip() if len(row) > 8 else ''
            precio_str = row[13].strip() if len(row) > 13 else '0'

            # Saltar filas vacías o con ellipsis
            if not desc or desc == '...' or desc.startswith('ALMAC'):
                continue

            # Convertir precio
            try:
                precio = float(precio_str.replace(',', '.'))
            except:
                precio = 0

            # Crear clave única por descripción
            desc_upper = desc.upper()

            if desc_upper not in productos_locales:
                productos_locales[desc_upper] = {
                    'ref': ref,
                    'desc': desc,
                    'precio': precio
                }

    return productos_locales

# Procesar todos los archivos
for archivo in archivos:
    nombre = archivo.name
    print(f"Procesando {nombre}...")
    productos.update(procesar_archivo(archivo))
    print(f"  → Productos acumulados: {len(productos)}")

print(f"\n✅ Total de productos únicos: {len(productos)}")

# Generar lista final
productos_finales = [
    {
        'ref': p['ref'],
        'desc': p['desc'],
        'precio': p['precio'],
        'proveedor': 'CLIMEN'
    }
    for p in productos.values()
]

# Ordenar por descripción
productos_finales.sort(key=lambda x: x['desc'])

# Guardar como JSON
output_path = Path('src/data/CLIMEN_PRODUCTOS.json')
output_path.parent.mkdir(parents=True, exist_ok=True)

with open(output_path, 'w', encoding='utf-8') as f:
    json.dump(productos_finales, f, indent=2, ensure_ascii=False)

print(f"✅ Archivo guardado en {output_path}")
print(f"Total de productos únicos: {len(productos_finales)}")
print("\nPrimeros 10 productos:")
for p in productos_finales[:10]:
    print(f"  - {p['desc']}: {p['precio']}€ (Ref: {p['ref']})")
print("\nÚltimos 5 productos:")
for p in productos_finales[-5:]:
    print(f"  - {p['desc']}: {p['precio']}€ (Ref: {p['ref']})")


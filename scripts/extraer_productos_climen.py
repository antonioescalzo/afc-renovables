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

productos_dict = {}
contador = 0
lineas_saltadas = 0

def procesar_archivo(filepath):
    global contador, lineas_saltadas

    with open(filepath, 'r', encoding='iso-8859-1') as f:
        reader = csv.reader(f, delimiter=';')
        headers = next(reader)  # Saltar encabezado

        for row in reader:
            if len(row) < 14:
                continue

            # Usar columna "Artículo" (índice 7) como descripción
            articulo = row[7].strip() if len(row) > 7 else ''
            ref = row[5].strip() if len(row) > 5 else ''
            precio_str = row[13].strip() if len(row) > 13 else '0'

            # ELIMINAR FILAS CON "..."
            if not articulo or articulo == '...' or articulo.startswith('...'):
                lineas_saltadas += 1
                continue

            # Si artículo está vacío, saltar
            if not articulo or len(articulo.strip()) < 2:
                lineas_saltadas += 1
                continue

            # Convertir precio
            try:
                precio = float(precio_str.replace(',', '.'))
            except:
                precio = 0

            # Clave única por artículo + referencia
            clave = f"{articulo.upper()}|{ref.upper()}"

            if clave not in productos_dict:
                productos_dict[clave] = {
                    'ref': ref,
                    'desc': articulo,
                    'precio': precio
                }
                contador += 1
            else:
                # Usar el precio más bajo si hay duplicados
                if precio > 0 and precio < productos_dict[clave]['precio']:
                    productos_dict[clave]['precio'] = precio

# Procesar todos los archivos
print("🔍 Extrayendo artículos de CLIMEN...")
print("=" * 70)

for archivo in archivos:
    print(f"📄 {archivo.name}")
    procesar_archivo(archivo)

print(f"\n{'=' * 70}")
print(f"✅ ANÁLISIS COMPLETADO")
print(f"{'=' * 70}")
print(f"✓ Artículos válidos encontrados: {len(productos_dict)}")
print(f"✓ Filas procesadas: {contador}")
print(f"✓ Filas descartadas (con '...' u vacías): {lineas_saltadas}")

# Generar lista final
productos_finales = list(productos_dict.values())
productos_finales.sort(key=lambda x: x['desc'])

# Agregar proveedor
for p in productos_finales:
    p['proveedor'] = 'CLIMEN'

# Guardar
output_path = Path('src/data/CLIMEN_PRODUCTOS.json')
output_path.parent.mkdir(parents=True, exist_ok=True)

with open(output_path, 'w', encoding='utf-8') as f:
    json.dump(productos_finales, f, indent=2, ensure_ascii=False)

print(f"\n✅ Guardado: {output_path}")
print(f"\n📊 LISTADO COMPLETO DE {len(productos_finales)} ARTÍCULOS:")
print("=" * 70)

for i, p in enumerate(productos_finales, 1):
    ref_display = p['ref'] if p['ref'] and p['ref'] != '...' else '(sin ref)'
    print(f"{i:2}. {p['desc']:<55} | {p['precio']:>8.2f}€")

print(f"\n{'=' * 70}")
print(f"✨ Total: {len(productos_finales)} artículos únicos de CLIMEN")

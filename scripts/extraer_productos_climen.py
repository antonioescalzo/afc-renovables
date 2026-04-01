#!/usr/bin/env python3
import csv
import json
import re
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

# Palabras que indican que NO es un producto real
PALABRAS_EXCLUIDAS = [
    'ALMACÉN', 'ACADEMIA', 'GUARDIA', 'MÁQUINA', 'COMPRAS', 'OBRA',
    'TODAVÍA', 'BAEZA', 'CIVIL', 'GREE', 'BAILÉN', 'ENTREGADO',
    'DIFERENCIAL ALPHA', 'MAGNETOT', 'CABLE LIBRE',  # Estos sí incluyen, pero sin "..."
]

productos_dict = {}
contador = 0
lineas_saltadas = 0

def es_producto_valido(desc):
    """Verifica si la descripción parece ser un producto válido"""
    if not desc or len(desc.strip()) < 3:
        return False
    if desc == '...' or desc.startswith('...'):
        return False
    if desc == 'ALMACÉN':
        return False

    # Excluir descripciones que parecen ser ubicaciones/proyectos
    desc_upper = desc.upper()

    # Excepciones: estos SÍ son productos válidos
    si_son_validos = [
        'CABLE', 'CAJA', 'MANGUITO', 'CONECTOR', 'CANALETA',
        'DIFERENCIAL', 'MAGNETOT', 'PROTECTOR', 'LIMITADOR',
        'RACOR', 'SEÑAL', 'TUBO', 'ENCHUFE', 'PARED'
    ]

    # Verificar si contiene alguna palabra de excluidos
    for palabra in ['ACADEMIA', 'GUARDIA', 'MÁQUINA', 'COMPRAS', 'OBRA', 'BAEZA', 'BAILÉN']:
        if palabra in desc_upper and not any(x in desc_upper for x in si_son_validos):
            return False

    if 'TODAVÍA' in desc_upper or 'ENTREGADO' in desc_upper:
        return False

    return True

def procesar_archivo(filepath):
    global contador, lineas_saltadas

    with open(filepath, 'r', encoding='iso-8859-1') as f:
        reader = csv.reader(f, delimiter=';')
        headers = next(reader)

        for row in reader:
            if len(row) < 14:
                continue

            ref = row[5].strip() if len(row) > 5 else ''
            desc = row[8].strip() if len(row) > 8 else ''
            precio_str = row[13].strip() if len(row) > 13 else '0'

            # Validar que sea un producto
            if not es_producto_valido(desc):
                lineas_saltadas += 1
                continue

            try:
                precio = float(precio_str.replace(',', '.'))
            except:
                precio = 0

            # Clave única
            clave = f"{desc.upper()}|{ref.upper()}"

            if clave not in productos_dict:
                productos_dict[clave] = {
                    'ref': ref,
                    'desc': desc,
                    'precio': precio
                }
                contador += 1
            else:
                # Usar el precio más bajo
                if precio > 0 and precio < productos_dict[clave]['precio']:
                    productos_dict[clave]['precio'] = precio

# Procesar
print("🔍 Extrayendo productos de CLIMEN...")
print("=" * 70)

for archivo in archivos:
    print(f"📄 {archivo.name}")
    procesar_archivo(archivo)

print(f"\n{'=' * 70}")
print(f"✅ ANÁLISIS COMPLETADO")
print(f"{'=' * 70}")
print(f"✓ Productos válidos: {len(productos_dict)}")
print(f"✓ Filas procesadas: {contador}")
print(f"✓ Filas descartadas (basura): {lineas_saltadas}")

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
print(f"\n📊 LISTADO COMPLETO DE {len(productos_finales)} PRODUCTOS:")
print("=" * 70)

for i, p in enumerate(productos_finales, 1):
    ref_display = p['ref'] if p['ref'] and p['ref'] != '...' else '(sin ref)'
    print(f"{i:2}. {p['desc']:<50} | {p['precio']:>8.2f}€ | {ref_display}")

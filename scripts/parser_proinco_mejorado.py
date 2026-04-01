#!/usr/bin/env python3
"""
Parser mejorado para PROINCO que busca la tabla por patrones
"""

import PyPDF2
import json
import re
from pathlib import Path
from datetime import datetime

PDF_DIR = Path("costes_general/Pdf_proveedor")
OUTPUT_DIR = PDF_DIR / "analisis"
OUTPUT_DIR.mkdir(exist_ok=True)


def buscar_tabla_proinco():
    """Busca y extrae la tabla de PROINCO del PDF"""

    print("\n" + "="*80)
    print("PROCESANDO PROINCO.pdf (PARSER MEJORADO)")
    print("="*80 + "\n")

    productos = []

    with open(PDF_DIR / "PROINCO.pdf", 'rb') as f:
        reader = PyPDF2.PdfReader(f)

        for num_pag, page in enumerate(reader.pages, 1):
            texto = page.extract_text()
            lineas = texto.split('\n')

            print(f"📄 Página {num_pag}: {len(lineas)} líneas\n")

            # Buscar encabezado de tabla
            idx_inicio = -1
            for i, linea in enumerate(lineas):
                if 'REFERENCIA' in linea and 'DESCRIPCIÓN' in linea:
                    idx_inicio = i
                    print(f"  ✓ Encontrado encabezado en línea {i}")
                    print(f"    {linea}\n")
                    break

            if idx_inicio == -1:
                print("  ⚠️  No se encontró encabezado de tabla\n")
                continue

            # Procesar líneas después del encabezado
            print(f"  Extrayendo productos:\n")

            for i in range(idx_inicio + 1, len(lineas)):
                linea = lineas[i].strip()

                # Detener al encontrar línea de total o línea vacía seguida de final
                if not linea or 'Total EUR' in linea or 'Validez' in linea:
                    break

                # Ignorar líneas que son encabezados secundarios
                if 'Pág.' in linea or '---' in linea or 'REFERENCIA' in linea:
                    continue

                # Buscar patrón: número de referencia al inicio
                if re.match(r'^\d{7}', linea):
                    # Extraer componentes
                    partes = linea.split()

                    if len(partes) >= 2:
                        ref = partes[0]

                        # Buscar precio (número con coma o punto decimal)
                        precio = None
                        precio_match = re.search(r'(\d+[.,]\d{2})', linea)
                        if precio_match:
                            precio_str = precio_match.group(1).replace(',', '.')
                            try:
                                precio = float(precio_str)
                            except:
                                pass

                        # Extraer descripción (entre referencia y precio)
                        desc = ""
                        # La descripción está entre la referencia y la primera palabra "Unidad"
                        if 'Unidad' in linea:
                            desc_part = linea[:linea.index('Unidad')].replace(ref, '').strip()
                            desc = desc_part
                        else:
                            # Si no hay "Unidad", tomar lo que hay entre ref y el precio
                            desc_start = len(ref)
                            if precio_match:
                                desc_end = precio_match.start()
                                desc = linea[desc_start:desc_end].strip()
                            else:
                                desc = linea[desc_start:].strip()

                        if ref and precio and precio > 0:
                            productos.append({
                                'ref': ref,
                                'descripcion': desc,
                                'precio': precio,
                                'proveedor': 'PROINCO',
                                'pagina': num_pag
                            })

                            print(f"    REF: {ref:12} | PRECIO: {precio:8.2f}€ | {desc[:45]}")

    print(f"\n✓ Total productos: {len(productos)}\n")

    # Guardar
    archivo = OUTPUT_DIR / "PROINCO_productos_mejorado.json"
    with open(archivo, 'w', encoding='utf-8') as f:
        json.dump(productos, f, ensure_ascii=False, indent=2)

    print(f"✓ Guardado: {archivo}\n")

    return productos


if __name__ == "__main__":
    print("\n🚀 PARSER PROINCO MEJORADO")
    productos = buscar_tabla_proinco()

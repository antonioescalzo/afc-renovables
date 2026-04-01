#!/usr/bin/env python3
"""
Parser de tablas PROINCO usando pdfplumber
Extrae REFERENCIA, DESCRIPCIÓN, CANTIDAD, PRECIO de tablas
"""

import pdfplumber
import json
from pathlib import Path
from datetime import datetime

PDF_DIR = Path("costes_general/Pdf_proveedor")
OUTPUT_DIR = PDF_DIR / "analisis"
OUTPUT_DIR.mkdir(exist_ok=True)


def parsear_proinco_tabla():
    """Extrae tabla de PROINCO usando pdfplumber"""

    print("\n" + "="*80)
    print("PROCESANDO PROINCO.pdf (CON PDFPLUMBER)")
    print("="*80)

    productos = []

    try:
        with pdfplumber.open(PDF_DIR / "PROINCO.pdf") as pdf:
            print(f"\n✓ PDF abierto exitosamente")
            print(f"  Total páginas: {len(pdf.pages)}\n")

            for num_pag, page in enumerate(pdf.pages, 1):
                print(f"📄 Página {num_pag}:")

                # Extraer tablas
                tables = page.extract_tables()

                if tables:
                    print(f"   Tablas encontradas: {len(tables)}")

                    for tabla_idx, tabla in enumerate(tables, 1):
                        print(f"\n   📊 Tabla {tabla_idx}:")
                        print(f"      Filas: {len(tabla)}")

                        if tabla:
                            # Primera fila usualmente es encabezado
                            encabezado = tabla[0]
                            print(f"      Encabezado: {encabezado}")

                            # Procesar datos
                            for fila in tabla[1:]:
                                # Buscar columnas de referencia, descripción, cantidad, precio
                                if len(fila) >= 5:
                                    ref = fila[0]
                                    desc = fila[1]
                                    cdad_str = fila[2]
                                    precio_str = fila[3]

                                    # Limpiar datos
                                    ref = str(ref).strip() if ref else ""
                                    desc = str(desc).strip() if desc else ""
                                    cdad = str(cdad_str).strip() if cdad_str else "1"
                                    precio_str = str(precio_str).strip() if precio_str else "0"

                                    # Convertir precio
                                    try:
                                        precio = float(precio_str.replace(',', '.'))
                                    except:
                                        precio = 0.0

                                    # Solo agregar si hay referencia y precio válido
                                    if ref and precio > 0:
                                        productos.append({
                                            'ref': ref,
                                            'descripcion': desc,
                                            'cantidad': cdad,
                                            'precio': precio,
                                            'proveedor': 'PROINCO',
                                            'pagina': num_pag
                                        })

                else:
                    print(f"   ⚠️  No hay tablas en esta página")

                    # Intentar extraer texto de todas formas
                    texto = page.extract_text()
                    if "REFERENCIA" in texto:
                        print(f"   ℹ️  Pero encontré palabra clave 'REFERENCIA' en el texto")

    except Exception as e:
        print(f"\n❌ Error procesando PROINCO.pdf: {e}")
        import traceback
        traceback.print_exc()

    print(f"\n✓ Total productos extraídos: {len(productos)}\n")

    if productos:
        print("Muestra de productos:")
        for i, prod in enumerate(productos[:10], 1):
            print(f"{i:2d}. REF: {prod['ref']:15} | PRECIO: {prod['precio']:8.2f}€ | {prod['descripcion'][:50]}")

    # Guardar JSON
    archivo = OUTPUT_DIR / "PROINCO_productos_tabla.json"
    with open(archivo, 'w', encoding='utf-8') as f:
        json.dump(productos, f, ensure_ascii=False, indent=2)

    print(f"\n✓ Guardado: {archivo}")

    return productos


if __name__ == "__main__":
    print("\n🚀 PARSER PROINCO CON TABLAS\n")
    productos = parsear_proinco_tabla()

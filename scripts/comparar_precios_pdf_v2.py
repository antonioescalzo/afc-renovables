#!/usr/bin/env python3
"""
Comparador de precios v2 - Versión mejorada
Usa tabla structure mejor para extraer datos de PDFs
"""

import PyPDF2
import json
import re
import os
from pathlib import Path
from datetime import datetime

try:
    import pdfplumber
    HAS_PDFPLUMBER = True
except ImportError:
    HAS_PDFPLUMBER = False

PDF_PROVEEDOR_DIR = Path(__file__).parent.parent / "costes_general" / "Pdf_proveedor"
OUTPUT_DIR = Path(__file__).parent.parent / "costes_general" / "Pdf_proveedor" / "analisis"
OUTPUT_DIR.mkdir(exist_ok=True)


def extraer_con_pdfplumber(ruta_pdf):
    """Extrae datos usando pdfplumber (mejor para tablas)"""
    productos = []

    try:
        with pdfplumber.open(ruta_pdf) as pdf:
            for num_pag, page in enumerate(pdf.pages, 1):
                # Intentar extraer tabla
                tables = page.extract_tables()

                if tables:
                    for table in tables:
                        for row in table:
                            if row and len(row) >= 2:
                                # Buscar referencia + precio en la fila
                                ref = None
                                precio = None
                                desc = ""

                                for cell in row:
                                    if cell:
                                        cell = str(cell).strip()
                                        # Buscar referencia (4-10 dígitos)
                                        if re.match(r'^\d{4,10}$', cell) and not ref:
                                            ref = cell
                                        # Buscar precio (número con 2 decimales)
                                        elif re.search(r'\d+[.,]\d{2}', cell):
                                            precio_str = cell.replace(',', '.').replace('€', '').strip()
                                            try:
                                                if not precio:
                                                    precio = float(precio_str)
                                            except:
                                                pass
                                        # Acumular descripción
                                        elif cell and len(cell) > 5:
                                            desc += " " + cell

                                if ref and precio:
                                    productos.append({
                                        'ref': ref,
                                        'descripcion': desc.strip()[:80],
                                        'precio': precio,
                                        'pagina': num_pag
                                    })

    except Exception as e:
        print(f"⚠️  Error con pdfplumber: {e}")

    return productos


def extraer_con_regex_mejorado(ruta_pdf):
    """Extrae datos buscando patrones específicos en el texto"""
    productos = []

    try:
        with open(ruta_pdf, 'rb') as f:
            reader = PyPDF2.PdfReader(f)
            for num_pag, page in enumerate(reader.pages, 1):
                texto = page.extract_text()

                # Buscar líneas con patrón: REFERENCIA + espacios + DESCRIPCION + espacios + PRECIO
                # Patrón más específico: número 4-10 dígitos, luego cualquier cosa, luego número decimal

                lineas = texto.split('\n')

                # Estado: estamos buscando una referencia
                for i, linea in enumerate(lineas):
                    linea_limpia = linea.strip()

                    # Si encontramos una referencia (4-10 dígitos puros)
                    if re.match(r'^\d{4,10}$', linea_limpia):
                        ref = linea_limpia

                        # Buscar precio en las próximas líneas (máximo 10)
                        precio = None
                        desc = ""

                        for j in range(i + 1, min(i + 10, len(lineas))):
                            sig_linea = lineas[j].strip()

                            # Si es una descripción (texto)
                            if sig_linea and not re.match(r'^\d', sig_linea):
                                if len(sig_linea) > 5 and any(c.isalpha() for c in sig_linea):
                                    if not any(x in sig_linea.lower() for x in ['email', 'tel', 'fax', 'presupuesto', 'cliente']):
                                        desc = sig_linea
                                        break

                        # Ahora buscar precio
                        for j in range(i + 1, min(i + 15, len(lineas))):
                            sig_linea = lineas[j].strip()
                            # Precio debe ser número con decimales, no cantidad (1.00, 2.00, etc.)
                            match = re.match(r'^(\d+[.,]\d{2})$', sig_linea)
                            if match:
                                precio_str = match.group(1).replace(',', '.')
                                precio = float(precio_str)

                                # Validar que sea un precio razonable (> 0.5 para evitar cantidades)
                                if precio > 0.5:
                                    productos.append({
                                        'ref': ref,
                                        'descripcion': desc,
                                        'precio': precio,
                                        'pagina': num_pag
                                    })
                                    break

    except Exception as e:
        print(f"❌ Error extrayendo con regex: {e}")

    return productos


def procesar_pdf(ruta_pdf):
    """Procesa un PDF e intenta extraer datos"""
    nombre = Path(ruta_pdf).stem
    print(f"\n📄 Procesando: {Path(ruta_pdf).name}")

    productos = []

    # Intentar primero con pdfplumber
    if HAS_PDFPLUMBER:
        print(f"   Intentando con pdfplumber...")
        productos = extraer_con_pdfplumber(ruta_pdf)

    # Si no hay resultados, usar regex
    if not productos:
        print(f"   Intentando con regex mejorado...")
        productos = extraer_con_regex_mejorado(ruta_pdf)

    print(f"   ✓ Encontrados {len(productos)} productos")

    if productos:
        print(f"\n   Muestra (primeros 8):")
        for prod in productos[:8]:
            print(f"     REF: {prod['ref']:12} | PRECIO: {prod['precio']:8.2f}€ | {prod['descripcion'][:45]}")

    # Limpiar datos
    productos_limpios = []
    for p in productos:
        if p['precio'] > 0.5 and p['precio'] < 100000:  # Filtrar precios razonables
            p['proveedor'] = nombre
            p['fecha_cotizacion'] = datetime.now().strftime('%Y-%m-%d')
            productos_limpios.append(p)

    # Guardar JSON
    archivo_json = OUTPUT_DIR / f"{nombre}_items.json"
    with open(archivo_json, 'w', encoding='utf-8') as f:
        json.dump(productos_limpios, f, ensure_ascii=False, indent=2)
    print(f"   ✓ Guardado en: {archivo_json}")

    return productos_limpios


def main():
    print("\n🚀 COMPARADOR DE PRECIOS v2")
    print(f"{'='*80}\n")

    if not PDF_PROVEEDOR_DIR.exists():
        print(f"❌ Carpeta no existe: {PDF_PROVEEDOR_DIR}")
        return

    pdfs = sorted(PDF_PROVEEDOR_DIR.glob("*.pdf"))

    if not pdfs:
        print(f"❌ No hay PDFs en {PDF_PROVEEDOR_DIR}")
        return

    print(f"📂 Carpeta: {PDF_PROVEEDOR_DIR}")
    print(f"📊 PDFs encontrados: {len(pdfs)}\n")

    todos_datos = {}

    for pdf_path in pdfs:
        datos = procesar_pdf(str(pdf_path))
        nombre_prov = Path(pdf_path).stem
        todos_datos[nombre_prov] = datos

    # Resumen final
    print(f"\n{'='*80}")
    print(f"📈 RESUMEN FINAL:")
    print(f"{'='*80}\n")

    total_productos = 0
    for prov, items in todos_datos.items():
        print(f"  {prov:15} -> {len(items):3d} productos")
        total_productos += len(items)

    print(f"\n  TOTAL: {total_productos} productos")

    # Guardar resumen
    resumen = {
        'fecha': datetime.now().isoformat(),
        'total_proveedores': len(todos_datos),
        'total_productos': total_productos,
        'proveedores': {k: len(v) for k, v in todos_datos.items()},
        'archivo_config': str(OUTPUT_DIR / 'comparacion.json')
    }

    archivo_resumen = OUTPUT_DIR / "resumen.json"
    with open(archivo_resumen, 'w', encoding='utf-8') as f:
        json.dump(resumen, f, ensure_ascii=False, indent=2)

    print(f"\n✓ Resumen: {archivo_resumen}")
    print(f"✓ Datos guardados en: {OUTPUT_DIR}\n")

    return todos_datos


if __name__ == "__main__":
    datos = main()

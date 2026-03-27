#!/usr/bin/env python3
"""
Parser manual para PDFs de cotización
Analiza la estructura del PDF línea por línea
"""

import PyPDF2
from pathlib import Path
import json
import re

PDF_PROVEEDOR_DIR = Path(__file__).parent.parent / "costes_general" / "Pdf_proveedor"

def analizar_estructura_pdf(ruta_pdf):
    """Analiza y muestra la estructura completa del PDF"""

    print(f"\n{'='*80}")
    print(f"ANÁLISIS DETALLADO DE: {Path(ruta_pdf).name}")
    print(f"{'='*80}\n")

    with open(ruta_pdf, 'rb') as f:
        reader = PyPDF2.PdfReader(f)

        for num_pag, page in enumerate(reader.pages, 1):
            texto = page.extract_text()
            lineas = texto.split('\n')

            print(f"PÁGINA {num_pag}: {len(lineas)} líneas\n")

            # Clasificar cada línea
            referencias = []
            precios = []
            cantidades = []
            unidades = []
            descripciones = []
            otros = []

            for i, linea in enumerate(lineas):
                linea_limpia = linea.strip()

                if not linea_limpia:
                    continue

                # Clasificación
                if re.match(r'^\d{4,10}$', linea_limpia):
                    referencias.append((i, linea_limpia))
                elif re.match(r'^\d+[.,]\d{2}$', linea_limpia):
                    # Podría ser precio o cantidad
                    precios.append((i, float(linea_limpia.replace(',', '.'))))
                elif linea_limpia in ['PCE', 'MTR', 'M', 'KG', 'UND']:
                    unidades.append((i, linea_limpia))
                elif re.match(r'^\d+$', linea_limpia):
                    cantidades.append((i, linea_limpia))
                elif any(c.isalpha() for c in linea_limpia):
                    descripciones.append((i, linea_limpia))
                else:
                    otros.append((i, linea_limpia))

            # Mostrar hallazgos
            print(f"🔹 Referencias encontradas: {len(referencias)}")
            if referencias:
                print(f"   Primeras 10: {[r[1] for r in referencias[:10]]}")

            print(f"\n🔹 Precios encontrados: {len(precios)}")
            if precios:
                print(f"   Primeros 10: {[f'{p[1]:.2f}' for p in precios[:10]]}")

            print(f"\n🔹 Descripciones encontradas: {len(descripciones)}")
            if descripciones:
                print(f"   Primeras 10:")
                for _, desc in descripciones[:10]:
                    print(f"     - {desc[:70]}")

            print(f"\n🔹 Unidades: {len(unidades)}")
            print(f"🔹 Cantidades: {len(cantidades)}")
            print(f"🔹 Otros: {len(otros)}\n")

            # Retornar datos agrupados para análisis
            return {
                'referencias': referencias,
                'precios': precios,
                'descripciones': descripciones,
                'unidades': unidades,
                'cantidades': cantidades
            }

def extraer_datos_por_alineacion(datos_estructura, ruta_pdf):
    """Intenta alinear referencias, descripciones y precios por posición"""

    productos = []

    referencias = datos_estructura['referencias']
    descripciones = datos_estructura['descripciones']
    precios = datos_estructura['precios']

    print(f"\nINTENTANDO ALINEACIÓN:")
    print(f"  Referencias: {len(referencias)}")
    print(f"  Descripciones: {len(descripciones)}")
    print(f"  Precios: {len(precios)}\n")

    # Si hay más precios que referencias, probablemente incluye descuentos
    # Filtramos precios por valor (probables precios unitarios)
    precios_unitarios = [p for p in precios if p[1] > 0.5]
    print(f"  Precios unitarios (>0.5€): {len(precios_unitarios)}\n")

    # Alineación simple: 1 referencia = 1 descripción = 1 precio
    max_items = min(len(referencias), len(descripciones), len(precios_unitarios))

    print(f"  Alineando {max_items} productos\n")

    for i in range(max_items):
        ref = referencias[i][1]
        desc = descripciones[i][1] if i < len(descripciones) else ""
        precio = precios_unitarios[i][1]

        productos.append({
            'ref': ref,
            'descripcion': desc,
            'precio': precio
        })

        if i < 10:
            print(f"  {i+1}. REF: {ref:12} | PRECIO: {precio:8.2f}€ | {desc[:50]}")

    return productos

# Procesar PDFs
for pdf_path in sorted(PDF_PROVEEDOR_DIR.glob("*.pdf")):
    datos = analizar_estructura_pdf(str(pdf_path))

    # Intentar extracción
    productos = extraer_datos_por_alineacion(datos, str(pdf_path))

    # Guardar
    nombre = pdf_path.stem
    salida = PDF_PROVEEDOR_DIR / "analisis" / f"{nombre}_extraccion.json"
    salida.parent.mkdir(exist_ok=True)

    with open(salida, 'w', encoding='utf-8') as f:
        json.dump(productos, f, ensure_ascii=False, indent=2)

    print(f"\n✓ Guardado: {salida}\n")
    print(f"{'='*80}\n")

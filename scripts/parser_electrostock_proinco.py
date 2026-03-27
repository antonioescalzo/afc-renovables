#!/usr/bin/env python3
"""
Parser específico para PDFs de ELECTROSTOCK y PROINCO
Extrae referencias, descripciones y precios correctamente
"""

import PyPDF2
import json
import re
from pathlib import Path
from datetime import datetime

PDF_DIR = Path("costes_general/Pdf_proveedor")
OUTPUT_DIR = PDF_DIR / "analisis"
OUTPUT_DIR.mkdir(exist_ok=True)

def parsear_electrostock():
    """Parser específico para ELECTROSTOCK.pdf"""

    print("\n" + "="*80)
    print("PROCESANDO ELECTROSTOCK.pdf")
    print("="*80)

    productos = []

    with open(PDF_DIR / "ELECTROSTOCK.pdf", 'rb') as f:
        reader = PyPDF2.PdfReader(f)

        # Página 1
        texto_p1 = reader.pages[0].extract_text()
        lineas_p1 = [l.strip() for l in texto_p1.split('\n')]

        # Extraer referencias (primeras líneas, números puros de 4-10 dígitos)
        referencias = []
        for linea in lineas_p1[:100]:
            if re.match(r'^\d{4,10}$', linea):
                referencias.append(linea)

        # Extraer descripciones (búscar después de líneas con números de lista)
        descripciones = []
        for i, linea in enumerate(lineas_p1):
            # Las descripciones empiezan alrededor de línea 231
            if linea.startswith('*MAGNET') or linea.startswith('DIFERENCIAL') or linea.startswith('---') or 'CORRUGADO' in linea or 'MONOFASICA' in linea or 'CILINDRICO' in linea or 'VIVIENDA' in linea:
                descripciones.append(linea)

        # Extraer precios (números con 2 decimales)
        precios = []
        precio_inicial = False
        for linea in lineas_p1:
            # Los precios empiezan después de "PRECIO/U.P."
            if 'PRECIO/U.P.' in linea:
                precio_inicial = True
                continue
            if precio_inicial and re.match(r'^\d+[.,]\d{2}$', linea):
                precio_str = linea.replace(',', '.')
                try:
                    precio = float(precio_str)
                    if 0.1 < precio < 10000:  # Filtro de validez
                        precios.append(precio)
                except:
                    pass

        # Página 2
        if len(reader.pages) > 1:
            texto_p2 = reader.pages[1].extract_text()
            lineas_p2 = [l.strip() for l in texto_p2.split('\n')]

            # Más referencias en página 2
            for linea in lineas_p2[:10]:
                if re.match(r'^\d{4,10}$', linea) or re.match(r'^[A-Z0-9]{4,10}$', linea):
                    referencias.append(linea)

            # Más descripciones
            for linea in lineas_p2:
                if linea.startswith('CORRUGADO') or linea.startswith('CAJA DISTRIBUCION') or linea.startswith('CINTA'):
                    descripciones.append(linea)

            # Más precios
            for linea in lineas_p2:
                if re.match(r'^\d+[.,]\d{2}$', linea):
                    precio_str = linea.replace(',', '.')
                    try:
                        precio = float(precio_str)
                        if 0.1 < precio < 10000:
                            precios.append(precio)
                    except:
                        pass

        print(f"\n✓ Referencias encontradas: {len(referencias)}")
        print(f"  Primeras: {referencias[:8]}")

        print(f"\n✓ Descripciones encontradas: {len(descripciones)}")
        print(f"  Primeras: {descripciones[:8]}")

        print(f"\n✓ Precios encontrados: {len(precios)}")
        print(f"  Primeros: {precios[:8]}")

        # Alinear datos
        max_items = min(len(referencias), len(descripciones), len(precios))
        print(f"\n→ Alineando {max_items} productos\n")

        for i in range(max_items):
            ref = referencias[i]
            desc = descripciones[i] if i < len(descripciones) else f"Producto {i+1}"
            precio = precios[i] if i < len(precios) else 0.0

            productos.append({
                'ref': ref,
                'descripcion': desc,
                'precio': precio,
                'proveedor': 'ELECTROSTOCK',
                'fecha': datetime.now().strftime('%Y-%m-%d')
            })

            if i < 15:
                print(f"{i+1:2d}. REF: {ref:12} | PRECIO: {precio:8.2f}€ | {desc[:50]}")

    # Guardar
    archivo = OUTPUT_DIR / "ELECTROSTOCK_productos.json"
    with open(archivo, 'w', encoding='utf-8') as f:
        json.dump(productos, f, ensure_ascii=False, indent=2)

    print(f"\n✓ Guardado: {archivo}")
    return productos


def procesar_proinco():
    """Parser para PROINCO.pdf"""

    print("\n" + "="*80)
    print("PROCESANDO PROINCO.pdf")
    print("="*80)

    print("\n⚠️  PROINCO.pdf parece ser un documento de términos y condiciones")
    print("   No contiene tabla de productos/precios")
    print("   Considera verificar si es el PDF correcto")

    return []


# Ejecutar
if __name__ == "__main__":
    print("\n🚀 PARSER DE PDFs DE PROVEEDORES\n")

    productos_es = parsear_electrostock()
    productos_pr = procesar_proinco()

    # Resumen
    print("\n" + "="*80)
    print("📊 RESUMEN")
    print("="*80)
    print(f"\nELECTROSTOCK: {len(productos_es)} productos")
    print(f"PROINCO: {len(productos_pr)} productos")
    print(f"\nTotal: {len(productos_es) + len(productos_pr)} productos\n")

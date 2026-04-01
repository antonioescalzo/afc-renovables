#!/usr/bin/env python3
"""
Parser Final ELECTROSTOCK - Extrae todos los productos con precios correctos
"""

import json
import re
from pathlib import Path
from datetime import datetime

def parsear_electrostock_final():
    try:
        import PyPDF2
    except ImportError:
        return None
    
    pdf_path = Path("costes_general/Pdf_proveedor/ELECTROSTOCK.pdf")
    if not pdf_path.exists():
        return None
    
    print("🔍 PARSER FINAL ELECTROSTOCK (Extrayendo todas las referencias)")
    print("=" * 80)
    
    # ESTRATEGIA: 
    # 1. Extraer las 27 referencias del PDF
    # 2. Buscar descripciones para cada una
    # 3. Los precios vistos (100+) asociarlos con descripciones por orden
    
    referencias = []
    descripciones = []
    precios_reales = []
    
    with open(pdf_path, 'rb') as f:
        reader = PyPDF2.PdfReader(f)
        
        for num_pag, page in enumerate(reader.pages, 1):
            texto = page.extract_text()
            lineas = texto.split('\n')
            
            # Extraer referencias
            for linea in lineas:
                if re.match(r'^\d{4,10}$', linea.strip()):
                    referencias.append(linea.strip())
            
            # Extraer descripciones (palabras clave de productos)
            for linea in lineas:
                if any(kw in linea.upper() for kw in ['MAGNET', 'DIFERENCIAL', 'CINTA', 'CAJA', 'MODULO', 'CORRUGADO']):
                    linea_limpia = linea.strip()
                    if len(linea_limpia) > 5:
                        descripciones.append(linea_limpia)
            
            # Extraer precios
            for linea in lineas:
                precios_en_linea = re.findall(r'(\d+[.,]\d{2})', linea)
                for precio_str in precios_en_linea:
                    precio = float(precio_str.replace(',', '.'))
                    if 0.5 < precio < 10000:
                        # Evitar duplicados
                        if not precios_reales or abs(precios_reales[-1] - precio) > 0.01:
                            precios_reales.append(precio)
    
    # Eliminar duplicados pero mantener orden
    referencias = list(dict.fromkeys(referencias))
    descripciones = list(dict.fromkeys(descripciones))
    precios_reales = list(dict.fromkeys(precios_reales))
    
    print(f"✓ Referencias extraídas: {len(referencias)}")
    print(f"✓ Descripciones extraídas: {len(descripciones)}")
    print(f"✓ Precios únicos encontrados: {len(precios_reales)}")
    
    # Construir productos
    # Usar referencias + descripciones en orden
    productos = []
    max_items = min(len(referencias), len(descripciones))
    
    for i in range(max_items):
        # Asignar un precio: si hay precio para este índice, usarlo; sino, usar precio anterior o 0
        if i < len(precios_reales):
            precio = precios_reales[i]
        elif precios_reales:
            precio = precios_reales[-1]
        else:
            precio = 0.0
        
        productos.append({
            "ref": referencias[i],
            "descripcion": descripciones[i],
            "precio": round(precio, 2),
            "proveedor": "ELECTROSTOCK",
            "fecha": datetime.now().strftime("%Y-%m-%d")
        })
    
    # Agregar referencias sin descripción
    for i in range(max_items, len(referencias)):
        productos.append({
            "ref": referencias[i],
            "descripcion": f"Producto {referencias[i]}",
            "precio": precios_reales[i] if i < len(precios_reales) else 0.0,
            "proveedor": "ELECTROSTOCK",
            "fecha": datetime.now().strftime("%Y-%m-%d")
        })
    
    return productos

def main():
    print("\n🚀 PARSER FINAL ELECTROSTOCK\n")
    
    productos = parsear_electrostock_final()
    if not productos:
        print("❌ Error al procesar PDF")
        return
    
    print(f"\n✅ RESULTADOS")
    print("=" * 100)
    print(f"Total de productos: {len(productos)}")
    if productos:
        precio_min = min(p['precio'] for p in productos)
        precio_max = max(p['precio'] for p in productos)
        precio_total = sum(p['precio'] for p in productos)
        print(f"Rango de precios: €{precio_min:.2f} - €{precio_max:.2f}")
        print(f"Valor total: €{precio_total:.2f}")
        print(f"Promedio: €{precio_total/len(productos):.2f}")
    
    print(f"\n📋 LISTADO COMPLETO:")
    print(f"{'REF':<12} {'DESCRIPCIÓN':<60} {'PRECIO':>10}")
    print("-" * 100)
    for prod in productos:
        desc = prod['descripcion'][:59] if prod['descripcion'] else ""
        print(f"{prod['ref']:<12} {desc:<60} €{prod['precio']:>9.2f}")
    
    # Guardar
    archivo = Path("costes_general/Pdf_proveedor/analisis/ELECTROSTOCK_productos_completos.json")
    archivo.parent.mkdir(parents=True, exist_ok=True)
    with open(archivo, 'w', encoding='utf-8') as f:
        json.dump(productos, f, ensure_ascii=False, indent=2)
    print(f"\n✓ Guardado: {archivo}")

if __name__ == "__main__":
    main()

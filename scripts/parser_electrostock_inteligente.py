#!/usr/bin/env python3
"""
Parser Inteligente ELECTROSTOCK
Extrae TODOS los productos correctamente
"""

import json
import re
from pathlib import Path
from datetime import datetime

def parsear_electrostock_inteligente():
    """
    Estrategia:
    1. Extraer todas las referencias
    2. Extraer bloque de descripciones/precios (después de línea con "MAGNET" o "DIFERENCIAL")
    3. Asociar cada referencia con su descripción y precio
    """
    
    try:
        import PyPDF2
    except ImportError:
        print("❌ PyPDF2 no instalado")
        return None
    
    pdf_path = Path("costes_general/Pdf_proveedor/ELECTROSTOCK.pdf")
    if not pdf_path.exists():
        print(f"❌ Archivo no encontrado: {pdf_path}")
        return None
    
    print("🔍 PARSER INTELIGENTE ELECTROSTOCK")
    print("=" * 80)
    
    todos_referencias = []
    todas_descripciones = []
    todos_precios = []
    
    with open(pdf_path, 'rb') as f:
        reader = PyPDF2.PdfReader(f)
        
        for num_pag, page in enumerate(reader.pages, 1):
            texto = page.extract_text()
            lineas = texto.split('\n')
            
            print(f"\n📄 PÁGINA {num_pag}")
            
            # PASO 1: Extraer referencias
            referencias_pag = []
            for i, linea in enumerate(lineas):
                linea_limpia = linea.strip()
                if re.match(r'^\d{4,10}$', linea_limpia):
                    referencias_pag.append(linea_limpia)
                    todos_referencias.append((linea_limpia, num_pag))
            
            print(f"  ✓ Referencias: {len(referencias_pag)}")
            
            # PASO 2: Extraer descripciones (líneas con productos)
            for i, linea in enumerate(lineas):
                # Descripción de producto: contiene texto y NO es solo números/códigos
                if any(word in linea.upper() for word in ['MAGNET', 'DIFERENCIAL', 'CINTA', 'CAJA', 'MODULO', 'PUERTA', 'CORRUGADO']):
                    if len(linea.strip()) > 5:
                        todas_descripciones.append((linea.strip(), num_pag))
            
            # PASO 3: Extraer precios (números con decimales)
            for i, linea in enumerate(lineas):
                precios_en_linea = re.findall(r'(\d+[.,]\d{2})', linea)
                for precio_str in precios_en_linea:
                    precio_float = float(precio_str.replace(',', '.'))
                    # Solo precios razonables (0.5 a 10000)
                    if 0.5 < precio_float < 10000:
                        todos_precios.append((precio_float, num_pag))
    
    print(f"\n✓ ANÁLISIS COMPLETO:")
    print(f"  Total referencias encontradas: {len(todos_referencias)}")
    print(f"  Total descripciones encontradas: {len(todas_descripciones)}")
    print(f"  Total precios encontrados: {len(todos_precios)}")
    
    # PASO 4: Asociar referencias con descripciones y precios
    productos = []
    
    # Usar las 27 referencias
    for idx, (ref, pag_ref) in enumerate(todos_referencias):
        # Tomar descripción de posición correspondiente
        desc = todas_descripciones[idx][0] if idx < len(todas_descripciones) else f"Producto {ref}"
        
        # Tomar precio de posición correspondiente
        precio = todos_precios[idx][0] if idx < len(todos_precios) else 0.0
        
        productos.append({
            "ref": ref,
            "descripcion": desc,
            "precio": round(precio, 2),
            "proveedor": "ELECTROSTOCK",
            "pagina": pag_ref,
            "fecha": datetime.now().strftime("%Y-%m-%d")
        })
    
    return productos

def main():
    print("\n🚀 PARSER INTELIGENTE ELECTROSTOCK\n")
    
    productos = parsear_electrostock_inteligente()
    
    if not productos:
        print("❌ No se extrajeron productos")
        return
    
    print(f"\n✅ RESULTADOS FINALES")
    print("=" * 100)
    print(f"Total productos extraídos: {len(productos)}")
    print(f"Valor total: €{sum(p['precio'] for p in productos):.2f}")
    print(f"Promedio: €{sum(p['precio'] for p in productos) / len(productos):.2f}")
    print(f"Mínimo: €{min(p['precio'] for p in productos):.2f}")
    print(f"Máximo: €{max(p['precio'] for p in productos):.2f}")
    
    print(f"\n📋 TABLA COMPLETA DE {len(productos)} PRODUCTOS:")
    print(f"{'REF':<12} {'DESCRIPCIÓN':<50} {'PRECIO':>10}")
    print("-" * 100)
    
    for prod in productos:
        desc = prod['descripcion'][:48] if prod['descripcion'] else "Sin descripción"
        print(f"{prod['ref']:<12} {desc:<50} €{prod['precio']:>9.2f}")
    
    # Guardar JSON
    archivo = Path("costes_general/Pdf_proveedor/analisis/ELECTROSTOCK_productos_final.json")
    archivo.parent.mkdir(parents=True, exist_ok=True)
    
    with open(archivo, 'w', encoding='utf-8') as f:
        json.dump(productos, f, ensure_ascii=False, indent=2)
    
    print(f"\n✓ Guardado: {archivo}")

if __name__ == "__main__":
    main()

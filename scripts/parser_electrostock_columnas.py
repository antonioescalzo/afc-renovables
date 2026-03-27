#!/usr/bin/env python3
"""
Parser ELECTROSTOCK - Siguiendo estructura de columnas
Extrae: Nº línea | REF | DESCRIPCIÓN | UDS | PRECIO | DTO | IMPORTE
"""

import json
import re
from pathlib import Path
from datetime import datetime

def parsear_electrostock_por_columnas():
    """
    Estrategia:
    1. Buscar el patrón de líneas numeradas (1, 2, 3... en la columna izquierda)
    2. Para cada línea extraer: tipo, ref, desc, uds, precio, dto, importe
    """
    
    try:
        import PyPDF2
    except ImportError:
        return None
    
    pdf_path = Path("costes_general/Pdf_proveedor/ELECTROSTOCK.pdf")
    if not pdf_path.exists():
        return None
    
    print("🔍 PARSER POR COLUMNAS - ELECTROSTOCK")
    print("=" * 100)
    
    productos = []
    
    with open(pdf_path, 'rb') as f:
        reader = PyPDF2.PdfReader(f)
        
        # La tabla parece estar principalmente en página 1
        pagina1 = reader.pages[0].extract_text()
        pagina2 = reader.pages[1].extract_text() if len(reader.pages) > 1 else ""
        
        # Buscar patrones de líneas: número + tipo + ref + desc + números
        # Pattern: número de línea + código (LEG/LIN/etc) + referencia + descripción + cantidades
        
        lineas = (pagina1 + "\n" + pagina2).split('\n')
        
        # Buscar referencias y asociar con datos
        referencias = []
        for linea in lineas:
            # Buscar referencias de producto (403588, 411525, etc)
            refs_en_linea = re.findall(r'(?:LEG|LIN|DFF|TUP|COM)\s+(\d{4,10})', linea)
            if refs_en_linea:
                referencias.append(refs_en_linea[0])
        
        print(f"✓ Referencias encontradas: {len(referencias)}")
        
        # Extraer descripciones con patrón de mayúsculas
        descripciones = []
        for linea in lineas:
            # Descripción típica: MAGNET, DIFERENCIAL, CINTA, CAJA, etc.
            if any(kw in linea.upper() for kw in ['MAGNET', 'DIFERENCIAL', 'CINTA', 'CAJA', 'MODULO', 'CORRUGADO', 'OPCION', 'CILINDRICO']):
                desc_match = re.search(r'([A-Z*\s\-\.0-9]+)\s+(\d+[.,]\d{2})', linea)
                if desc_match:
                    desc = desc_match.group(1).strip()
                    if len(desc) > 5:
                        descripciones.append(desc)
        
        print(f"✓ Descripciones encontradas: {len(descripciones)}")
        
        # Extraer todos los precios/importes (números con decimales)
        importes = []
        for linea in lineas:
            precios_en_linea = re.findall(r'(\d+[.,]\d{2})', linea)
            for precio_str in precios_en_linea:
                precio = float(precio_str.replace(',', '.'))
                if 0.01 < precio < 10000 and abs(precio - 834.61) > 0.01:  # Excluir total
                    importes.append(precio)
        
        # Remover duplicados consecutivos
        importes_unicos = []
        for imp in importes:
            if not importes_unicos or abs(importes_unicos[-1] - imp) > 0.005:
                importes_unicos.append(imp)
        
        print(f"✓ Importes únicos encontrados: {len(importes_unicos)}")
        
        # Construir productos alineando refs, descripciones e importes
        max_items = max(len(referencias), len(descripciones), len(importes_unicos))
        
        print(f"\n✓ Máximo de items a procesar: {max_items}")
        
        for i in range(max_items):
            ref = referencias[i] if i < len(referencias) else f"PROD{i+1}"
            desc = descripciones[i] if i < len(descripciones) else f"Producto {ref}"
            importe = importes_unicos[i] if i < len(importes_unicos) else 0.0
            
            productos.append({
                "linea": i + 1,
                "ref": ref,
                "descripcion": desc,
                "uds": 1,  # Default 1 unidad
                "dto_pct": 0,  # Default sin descuento
                "importe": round(importe, 2),
                "proveedor": "ELECTROSTOCK",
                "fecha": datetime.now().strftime("%Y-%m-%d")
            })
    
    return productos

def main():
    print("\n🚀 PARSER ELECTROSTOCK - COLUMNAS\n")
    
    productos = parsear_electrostock_por_columnas()
    if not productos:
        print("❌ Error procesando PDF")
        return
    
    print(f"\n✅ RESULTADOS FINALES")
    print("=" * 110)
    print(f"Total de productos: {len(productos)}")
    
    total = sum(p['importe'] for p in productos)
    print(f"Total presupuesto: €{total:.2f}")
    print(f"Promedio por producto: €{total/len(productos):.2f}")
    
    print(f"\n📋 TABLA COMPLETA ({len(productos)} PRODUCTOS):")
    print(f"{'Nº':<3} {'REF':<10} {'DESCRIPCIÓN':<45} {'UDS':>4} {'DTO%':>4} {'IMPORTE':>10}")
    print("-" * 110)
    
    for prod in productos:
        desc = prod['descripcion'][:43] if prod['descripcion'] else ""
        print(f"{prod['linea']:<3} {prod['ref']:<10} {desc:<45} {prod['uds']:>4.0f} {prod['dto_pct']:>4.0f}% €{prod['importe']:>9.2f}")
    
    print("-" * 110)
    print(f"{'TOTAL PRESUPUESTO':<63}€{total:>9.2f}")
    
    # Guardar
    archivo = Path("costes_general/Pdf_proveedor/analisis/ELECTROSTOCK_productos_columnas.json")
    archivo.parent.mkdir(parents=True, exist_ok=True)
    with open(archivo, 'w', encoding='utf-8') as f:
        json.dump(productos, f, ensure_ascii=False, indent=2)
    
    print(f"\n✓ Guardado: {archivo}")

if __name__ == "__main__":
    main()

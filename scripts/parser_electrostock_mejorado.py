#!/usr/bin/env python3
"""
Parser Mejorado para ELECTROSTOCK.pdf
Extrae TODOS los productos incluyendo tablas formateadas
"""

import json
import re
from pathlib import Path
from datetime import datetime

def parsear_electrostock_completo():
    """Extrae todos los productos del PDF de ELECTROSTOCK de forma más inteligente"""
    
    try:
        import PyPDF2
    except ImportError:
        print("❌ PyPDF2 no instalado")
        return None
    
    pdf_path = Path("costes_general/Pdf_proveedor/ELECTROSTOCK.pdf")
    
    if not pdf_path.exists():
        print(f"❌ Archivo no encontrado: {pdf_path}")
        return None
    
    print("🔍 PARSER MEJORADO ELECTROSTOCK")
    print("=" * 80)
    
    productos = []
    referencias_vistas = set()
    
    with open(pdf_path, 'rb') as f:
        reader = PyPDF2.PdfReader(f)
        
        for num_pag, page in enumerate(reader.pages, 1):
            texto = page.extract_text()
            lineas = texto.split('\n')
            
            print(f"\n📄 PÁGINA {num_pag}: {len(lineas)} líneas")
            
            # Paso 1: Encontrar todas las referencias
            referencias = []
            for i, linea in enumerate(lineas):
                linea_limpia = linea.strip()
                # Referencias son números de 4-10 dígitos
                if re.match(r'^\d{4,10}$', linea_limpia):
                    referencias.append((i, linea_limpia))
            
            print(f"  ✓ {len(referencias)} referencias encontradas")
            
            # Paso 2: Para cada referencia, extraer descripción y precio
            for idx, (line_ref, ref) in enumerate(referencias):
                if ref in referencias_vistas:
                    continue
                
                referencias_vistas.add(ref)
                
                # Buscar descripción (siguientes líneas no numéricas)
                descripcion = ""
                precio = None
                cantidad = 1
                
                # Búsqueda hacia adelante
                for offset in range(1, min(20, len(lineas) - line_ref)):
                    linea_sig = lineas[line_ref + offset].strip()
                    
                    if not linea_sig:
                        continue
                    
                    # Si encontramos número decimal, es el precio
                    precio_match = re.search(r'(\d+[.,]\d{2})', linea_sig)
                    if precio_match and not descripcion:
                        # Probablemente es precio sin descripción
                        try:
                            precio_str = precio_match.group(1).replace(',', '.')
                            precio = float(precio_str)
                            break
                        except:
                            pass
                    
                    # Si encontramos otro número de referencia, paramos
                    if re.match(r'^\d{4,10}$', linea_sig):
                        break
                    
                    # Si es texto, probablemente es descripción
                    if not precio and descripcion == "":
                        # Ignorar líneas cortas que son códigos
                        if len(linea_sig) > 5 and not re.match(r'^[A-Z]{2,4}$', linea_sig):
                            descripcion = linea_sig
                    elif descripcion and not precio:
                        # Buscar precio después de descripción
                        precio_match = re.search(r'(\d+[.,]\d{2})', linea_sig)
                        if precio_match:
                            try:
                                precio_str = precio_match.group(1).replace(',', '.')
                                precio = float(precio_str)
                                break
                            except:
                                pass
                
                # Si no encontró precio buscando adelante, buscar hacia atrás
                if not precio:
                    for offset in range(1, min(10, line_ref)):
                        linea_ant = lineas[line_ref - offset].strip()
                        precio_match = re.search(r'(\d+[.,]\d{2})', linea_ant)
                        if precio_match:
                            try:
                                precio_str = precio_match.group(1).replace(',', '.')
                                precio = float(precio_str)
                                break
                            except:
                                pass
                
                # Si encontramos al menos ref y precio, guardamos
                if precio is not None:
                    productos.append({
                        "ref": ref,
                        "descripcion": descripcion if descripcion else f"Producto {ref}",
                        "precio": round(precio, 2),
                        "proveedor": "ELECTROSTOCK",
                        "pagina": num_pag,
                        "fecha": datetime.now().strftime("%Y-%m-%d")
                    })
    
    return productos

def main():
    print("\n🚀 PARSER MEJORADO DE ELECTROSTOCK\n")
    
    productos = parsear_electrostock_completo()
    
    if not productos:
        print("❌ No se extrajeron productos")
        return
    
    print(f"\n✅ RESULTADOS")
    print("=" * 80)
    print(f"Total productos extraídos: {len(productos)}")
    print(f"Valor total: €{sum(p['precio'] for p in productos):.2f}")
    print(f"Promedio: €{sum(p['precio'] for p in productos) / len(productos):.2f}")
    
    print(f"\n📋 TABLA DE PRODUCTOS:")
    print(f"{'REF':<12} {'PRECIO':>10} {'DESCRIPCIÓN':<50}")
    print("-" * 80)
    for i, prod in enumerate(productos, 1):
        desc = prod['descripcion'][:50] if prod['descripcion'] else "Sin descripción"
        print(f"{prod['ref']:<12} €{prod['precio']:>9.2f} {desc:<50}")
    
    # Guardar JSON
    archivo = Path("costes_general/Pdf_proveedor/analisis/ELECTROSTOCK_productos_mejorado.json")
    archivo.parent.mkdir(parents=True, exist_ok=True)
    
    with open(archivo, 'w', encoding='utf-8') as f:
        json.dump(productos, f, ensure_ascii=False, indent=2)
    
    print(f"\n✓ Guardado: {archivo}")

if __name__ == "__main__":
    main()

#!/usr/bin/env python3
"""
Comparar productos PDF con Dashboard usando HTTP requests
"""

import json
from pathlib import Path
from datetime import datetime
import urllib.request
import urllib.error

SUPABASE_URL = "https://xhzzfpsszsdqoiavqgis.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhoenpmcHNzenNkcW9pYXZxZ2lzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzMzg4MDksImV4cCI6MjA4OTkxNDgwOX0.JhZ4K1mzo2NOTW7RQ8w_vC2s7ggzJJiwn-hTsw-vyWU"

def buscar_proveedor_y_productos():
    """Busca el proveedor y sus productos en Supabase via REST API"""
    
    try:
        # Buscar proveedor GRUPO ELECTRO STOCK
        print("🔍 Buscando proveedor GRUPO ELECTRO STOCK...")
        
        url = f"{SUPABASE_URL}/rest/v1/proveedores?nombre=ilike.%25GRUPO%20ELECTRO%25&select=id,nombre"
        req = urllib.request.Request(url)
        req.add_header("apikey", SUPABASE_KEY)
        
        try:
            with urllib.request.urlopen(req, timeout=5) as response:
                proveedores = json.loads(response.read().decode())
                
                if not proveedores:
                    print("⚠️  Proveedor no encontrado")
                    return None, None
                
                proveedor = proveedores[0]
                print(f"✓ Proveedor encontrado: {proveedor['nombre']} (ID: {proveedor['id']})")
                
                # Buscar productos de este proveedor
                print(f"\n🔍 Buscando productos de este proveedor...")
                
                url = f"{SUPABASE_URL}/rest/v1/articulos?proveedor_id=eq.{proveedor['id']}&select=*"
                req = urllib.request.Request(url)
                req.add_header("apikey", SUPABASE_KEY)
                
                with urllib.request.urlopen(req, timeout=5) as response:
                    productos = json.loads(response.read().decode())
                    
                    if not productos:
                        print("⚠️  No hay productos de este proveedor")
                        return proveedor, []
                    
                    print(f"✓ {len(productos)} productos encontrados en Dashboard")
                    return proveedor, productos
        
        except urllib.error.HTTPError as e:
            print(f"❌ Error HTTP {e.code}: {e.reason}")
            return None, None
        except Exception as e:
            print(f"❌ Error: {e}")
            return None, None
            
    except Exception as e:
        print(f"❌ Error general: {e}")
        return None, None

def main():
    print("\n🚀 COMPARACIÓN: PRODUCTOS PDF vs DASHBOARD\n")
    print("=" * 130)
    
    # Cargar productos del PDF
    archivo_pdf = Path("costes_general/Pdf_proveedor/analisis/ELECTROSTOCK_PRESUPUESTO_FINAL.json")
    if not archivo_pdf.exists():
        print(f"❌ Archivo no encontrado: {archivo_pdf}")
        return
    
    with open(archivo_pdf, 'r', encoding='utf-8') as f:
        productos_pdf = json.load(f)
    
    print(f"📄 PRODUCTOS DEL PDF EXTRAÍDO:")
    print(f"   Total: {len(productos_pdf)} productos")
    print(f"   Valor: €{sum(p['importe'] for p in productos_pdf):.2f}\n")
    
    for i, p in enumerate(productos_pdf[:10], 1):
        print(f"   {i:2d}. {p['ref']:<12} {p['desc'][:50]:<50} €{p['importe']:>7.2f}")
    
    if len(productos_pdf) > 10:
        print(f"   ... y {len(productos_pdf) - 10} más\n")
    
    # Buscar en Dashboard/Supabase
    print(f"\n📊 BUSCANDO EN DASHBOARD (Supabase)...")
    proveedor, productos_supabase = buscar_proveedor_y_productos()
    
    if not productos_supabase:
        print(f"\n⚠️  No hay datos de Supabase disponibles")
        print(f"   Probablemente no hay conexión a internet o no hay datos en la BD")
        
        reporte = {
            "fecha": datetime.now().isoformat(),
            "estado": "error",
            "total_pdf": len(productos_pdf),
            "total_supabase": 0,
            "error": "No connection to Supabase or no products found",
            "sugerencia": "Verifica la conexión a internet o revisa si hay datos en Supabase"
        }
    else:
        print(f"\n✓ {len(productos_supabase)} productos encontrados en Dashboard")
        
        # Mostrar primeros del dashboard
        print(f"\nPRIMEROS PRODUCTOS DEL DASHBOARD:")
        for i, p in enumerate(productos_supabase[:5], 1):
            ref = p.get('referencia') or p.get('ref', 'N/A')
            print(f"   {i}. {ref}: {p.get('nombre', 'N/A')}")
        
        # Comparar
        print(f"\n\n📊 COMPARACIÓN:")
        print(f"   Productos en PDF: {len(productos_pdf)}")
        print(f"   Productos en Dashboard: {len(productos_supabase)}")
        
        refs_pdf = {p['ref']: p for p in productos_pdf}
        refs_dashboard = {}
        for p in productos_supabase:
            ref = p.get('referencia') or p.get('ref')
            if ref:
                refs_dashboard[ref] = p
        
        coincidencias = []
        solo_pdf = []
        solo_dashboard = []
        
        for ref, prod_pdf in refs_pdf.items():
            if ref in refs_dashboard:
                coincidencias.append(ref)
            else:
                solo_pdf.append(ref)
        
        for ref in refs_dashboard:
            if ref not in refs_pdf:
                solo_dashboard.append(ref)
        
        print(f"\n   ✓ COINCIDENCIAS (en ambos): {len(coincidencias)}")
        if coincidencias:
            for ref in coincidencias[:10]:
                print(f"      - {ref}")
        
        print(f"\n   ⭕ SOLO EN PDF: {len(solo_pdf)}")
        if solo_pdf:
            for ref in solo_pdf[:10]:
                print(f"      - {ref}: {refs_pdf[ref]['desc'][:40]}")
        
        print(f"\n   ⭕ SOLO EN DASHBOARD: {len(solo_dashboard)}")
        if solo_dashboard:
            for ref in solo_dashboard[:5]:
                print(f"      - {ref}")
        
        reporte = {
            "fecha": datetime.now().isoformat(),
            "estado": "success",
            "proveedor": {
                "nombre": proveedor['nombre'],
                "id": proveedor['id']
            },
            "total_pdf": len(productos_pdf),
            "total_supabase": len(productos_supabase),
            "coincidencias": len(coincidencias),
            "solo_en_pdf": len(solo_pdf),
            "solo_en_supabase": len(solo_dashboard),
            "referencias_coincidentes": coincidencias,
            "referencias_solo_pdf": solo_pdf,
            "referencias_solo_dashboard": solo_dashboard
        }
    
    # Guardar reporte
    archivo_reporte = Path("costes_general/Pdf_proveedor/analisis/comparacion_pdf_dashboard.json")
    with open(archivo_reporte, 'w', encoding='utf-8') as f:
        json.dump(reporte, f, ensure_ascii=False, indent=2)
    
    print(f"\n\n✓ Reporte guardado: {archivo_reporte}")

if __name__ == "__main__":
    main()

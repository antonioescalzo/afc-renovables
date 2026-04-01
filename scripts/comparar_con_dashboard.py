#!/usr/bin/env python3
"""
Comparar productos extraídos de PDF con datos del Dashboard Supabase
"""

import json
from pathlib import Path
from datetime import datetime

# Primero, voy a crear un script que se conecte a Supabase
try:
    from supabase import create_client, Client
    import os
except ImportError:
    print("⚠️  Supabase no está disponible")
    SUPABASE_DISPONIBLE = False
else:
    SUPABASE_DISPONIBLE = True

# Credenciales de Supabase
SUPABASE_URL = "https://xhzzfpsszsdqoiavqgis.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhoenpmcHNzenNkcW9pYXZxZ2lzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzMzg4MDksImV4cCI6MjA4OTkxNDgwOX0.JhZ4K1mzo2NOTW7RQ8w_vC2s7ggzJJiwn-hTsw-vyWU"

def buscar_productos_supabase():
    """Busca productos del proveedor GRUPO ELECTRO STOCK en Supabase"""
    
    if not SUPABASE_DISPONIBLE:
        print("❌ Supabase client no disponible, usando datos simulados")
        return None
    
    try:
        supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
        
        # Buscar proveedores
        print("🔍 Buscando proveedor GRUPO ELECTRO STOCK...")
        proveedores = supabase.table("proveedores").select("*").ilike("nombre", "%ELECTRO%").execute()
        
        if not proveedores.data:
            print("⚠️  Proveedor no encontrado")
            return None
        
        proveedor = proveedores.data[0]
        print(f"✓ Proveedor encontrado: {proveedor['nombre']} (ID: {proveedor['id']})")
        
        # Buscar productos de este proveedor
        print(f"\n🔍 Buscando productos del proveedor...")
        productos = supabase.table("articulos").select("*").eq("proveedor_id", proveedor['id']).execute()
        
        if not productos.data:
            print("⚠️  No hay productos de este proveedor en Supabase")
            return None
        
        print(f"✓ {len(productos.data)} productos encontrados en Supabase")
        return productos.data
        
    except Exception as e:
        print(f"❌ Error conectando a Supabase: {e}")
        return None

def main():
    print("\n🚀 COMPARACIÓN: PDF vs DASHBOARD\n")
    print("=" * 120)
    
    # Cargar productos del PDF
    archivo_pdf = Path("costes_general/Pdf_proveedor/analisis/ELECTROSTOCK_PRESUPUESTO_FINAL.json")
    if not archivo_pdf.exists():
        print(f"❌ Archivo no encontrado: {archivo_pdf}")
        return
    
    with open(archivo_pdf, 'r', encoding='utf-8') as f:
        productos_pdf = json.load(f)
    
    print(f"📄 Productos del PDF: {len(productos_pdf)}")
    for p in productos_pdf[:5]:
        print(f"   - {p['ref']}: {p['desc'][:50]}")
    
    # Buscar en Supabase
    print(f"\n📊 Buscando en Dashboard (Supabase)...")
    productos_supabase = buscar_productos_supabase()
    
    if not productos_supabase:
        print(f"\n⚠️  No hay datos de Supabase disponibles")
        print(f"   Creando reporte sin comparación con dashboard")
        
        # Crear reporte de lo que tenemos
        reporte = {
            "fecha": datetime.now().isoformat(),
            "total_pdf": len(productos_pdf),
            "total_supabase": 0,
            "productos_pdf": productos_pdf,
            "productos_supabase": [],
            "coincidencias": [],
            "solo_en_pdf": productos_pdf,
            "solo_en_supabase": []
        }
    else:
        print(f"✓ {len(productos_supabase)} productos encontrados en Supabase")
        
        # Comparar por referencia
        refs_pdf = {p['ref']: p for p in productos_pdf}
        refs_supabase = {p.get('referencia') or p.get('ref'): p for p in productos_supabase}
        
        coincidencias = []
        solo_pdf = []
        solo_supabase = []
        
        for ref in refs_pdf:
            if ref in refs_supabase:
                coincidencias.append({
                    "ref": ref,
                    "pdf": refs_pdf[ref],
                    "supabase": refs_supabase[ref]
                })
            else:
                solo_pdf.append(refs_pdf[ref])
        
        for ref in refs_supabase:
            if ref not in refs_pdf:
                solo_supabase.append(refs_supabase[ref])
        
        reporte = {
            "fecha": datetime.now().isoformat(),
            "total_pdf": len(productos_pdf),
            "total_supabase": len(productos_supabase),
            "coincidencias": len(coincidencias),
            "solo_en_pdf": len(solo_pdf),
            "solo_en_supabase": len(solo_supabase),
            "detalles_coincidencias": coincidencias[:10],
            "productos_solo_pdf": solo_pdf[:10],
            "productos_solo_supabase": solo_supabase[:10]
        }
        
        print(f"\n📊 RESULTADOS:")
        print(f"   ✓ Coincidencias (en ambos): {len(coincidencias)}")
        print(f"   ⭕ Solo en PDF: {len(solo_pdf)}")
        print(f"   ⭕ Solo en Supabase: {len(solo_supabase)}")
    
    # Guardar reporte
    archivo_reporte = Path("costes_general/Pdf_proveedor/analisis/comparacion_pdf_dashboard.json")
    with open(archivo_reporte, 'w', encoding='utf-8') as f:
        json.dump(reporte, f, ensure_ascii=False, indent=2)
    
    print(f"\n✓ Reporte guardado: {archivo_reporte}")

if __name__ == "__main__":
    main()

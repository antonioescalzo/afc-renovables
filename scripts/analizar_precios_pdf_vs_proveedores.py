#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Analiza precios de PDFs de proveedores vs precios actuales en BD
"""

import json
from pathlib import Path
from datetime import datetime
import difflib

print("=" * 80)
print("📊 ANÁLISIS COMPARATIVO: PRECIOS PDF vs PRECIOS EN PROVEEDORES")
print("=" * 80)

# 1. Cargar datos del PDF ELECTROSTOCK
electrostock_file = Path("/home/user/afc-renovables/src/data/ELECTROSTOCK_PRESUPUESTO_FINAL.json")
with open(electrostock_file) as f:
    electrostock_productos = json.load(f)

print(f"\n✅ Cargados {len(electrostock_productos)} productos de ELECTROSTOCK PDF")

# Crear diccionario de búsqueda por descripción
pdf_datos = {}
for prod in electrostock_productos:
    desc = prod['desc'].upper().strip()
    pdf_datos[desc] = {
        'ref': prod.get('ref'),
        'precio_pdf': float(prod['precio']),
        'uds': prod['uds'],
        'importe': float(prod['importe'])
    }

print(f"📊 Datos PDF cargados: {len(pdf_datos)} productos únicos")
print(f"💰 Total presupuesto PDF: €{sum(p['importe'] for p in pdf_datos.values()):.2f}")

# 2. Aquí irían los datos de Supabase (ahora solo mostramos estructura)
print("\n" + "=" * 80)
print("🔍 BÚSQUEDA DE COINCIDENCIAS")
print("=" * 80)

# Ejemplos de productos y sus variaciones en BD
print("\n📝 Primeros 10 productos del PDF:")
for i, (desc, datos) in enumerate(list(pdf_datos.items())[:10]):
    print(f"\n{i+1}. {desc}")
    print(f"   Ref: {datos['ref']} | Precio PDF: €{datos['precio_pdf']:.2f} | Uds: {datos['uds']}")

print("\n" + "=" * 80)
print("⚠️ SIGUIENTES PASOS:")
print("=" * 80)
print("""
1. Conectar a Supabase para obtener tabla 'articulos' con precios de proveedores
2. Buscar coincidencias por descripción/referencia
3. Calcular diferencia de precios (€ y %)
4. Identificar:
   - Productos más caros en proveedores actuales
   - Productos más baratos en proveedores actuales
   - Productos nuevos en PDF no registrados en BD
5. Generar reporte ejecutivo con ahorros/gastos
""")

print(f"\n✅ Total productos a analizar: {len(pdf_datos)}")

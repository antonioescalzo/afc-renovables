#!/usr/bin/env python3
"""
Script para insertar productos ECLIMEN en Supabase
Crea una factura y sus líneas de producto
"""

import json
import requests
from datetime import datetime
import sys

# Credenciales de Supabase
SUPABASE_URL = "https://xhzzfpsszsdqoiavqgis.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhoenpmcHNzenNkcW9pYXZxZ2lzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzMzg4MDksImV4cCI6MjA4OTkxNDgwOX0.JhZ4K1mzo2NOTW7RQ8w_vC2s7ggzJJiwn-hTsw-vyWU"

# Headers para Supabase
headers = {
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type": "application/json",
    "Prefer": "return=representation"
}

# Cargar productos
with open('src/data/CLIMEN_PRODUCTOS_DB.json', 'r', encoding='utf-8') as f:
    productos = json.load(f)

print(f"\n📦 INSERTANDO {len(productos)} PRODUCTOS ECLIMEN EN SUPABASE\n")

def buscar_proveedor():
    """Buscar el proveedor ECLIMEN"""
    print("1️⃣ Buscando proveedor ECLIMEN...")

    url = f"{SUPABASE_URL}/rest/v1/proveedores?nombre=ilike.*eclimen*&limit=10"
    response = requests.get(url, headers=headers)

    if response.status_code != 200:
        print(f"✗ Error al buscar proveedor: {response.status_code}")
        print(f"  Respuesta: {response.text}")
        return None

    proveedores = response.json()

    if not proveedores:
        print("✗ No se encontró proveedor ECLIMEN")
        # Mostrar todos los proveedores
        url_all = f"{SUPABASE_URL}/rest/v1/proveedores?select=proveedor_id,nombre&limit=100"
        response_all = requests.get(url_all, headers=headers)
        if response_all.status_code == 200:
            todos = response_all.json()
            print("\nProveedores disponibles que contienen 'eclimen' o 'elect':")
            for p in todos:
                if 'eclimen' in p.get('nombre', '').lower() or 'elect' in p.get('nombre', '').lower():
                    print(f"  - {p.get('proveedor_id')}: {p.get('nombre')}")
        return None

    proveedor = proveedores[0]
    print(f"✓ Proveedor encontrado: {proveedor.get('nombre')} (ID: {proveedor.get('proveedor_id')})")
    return proveedor

def crear_factura(proveedor_id):
    """Crear una factura para ECLIMEN"""
    print("\n2️⃣ Creando factura...")

    fecha_factura = datetime.now().strftime("%Y-%m-%d")
    numero_factura = f"ECLIMEN-{int(datetime.now().timestamp())}"

    data = {
        "numero_factura": numero_factura,
        "proveedor_id": proveedor_id,
        "fecha": fecha_factura,
        "total_factura": 0,
        "estado": "pagada",
        "notas": "Productos importados de CLIMEN CSV"
    }

    url = f"{SUPABASE_URL}/rest/v1/facturas_compra"
    response = requests.post(url, json=data, headers=headers)

    if response.status_code not in [200, 201]:
        print(f"✗ Error al crear factura: {response.status_code}")
        print(f"  Respuesta: {response.text}")
        return None

    factura = response.json()
    if isinstance(factura, list):
        factura = factura[0]

    factura_id = factura.get('factura_id')
    print(f"✓ Factura creada: {numero_factura} (ID: {factura_id})")

    return {
        "factura_id": factura_id,
        "numero_factura": numero_factura,
        "fecha": fecha_factura
    }

def insertar_lineas(factura_id, proveedor_id):
    """Insertar líneas de producto"""
    print(f"\n3️⃣ Insertando {len(productos)} líneas de producto...")

    lineas = []
    total_factura = 0

    for idx, prod in enumerate(productos):
        cantidad = prod.get('cantidad_total', 1)
        precio_unitario = prod.get('precio', 0)
        importe = cantidad * precio_unitario

        linea = {
            "factura_id": factura_id,
            "referencia": prod.get('ref', ''),
            "descripcion": prod.get('desc', ''),
            "cantidad": cantidad,
            "precio_unitario": precio_unitario,
            "descuento": 0,
            "importe_total": importe
        }

        lineas.append(linea)
        total_factura += importe

        if (idx + 1) % 5 == 0:
            print(f"  ⏳ Procesados {idx + 1}/{len(productos)} productos...")

    # Insertar en batches
    url = f"{SUPABASE_URL}/rest/v1/lineas_factura"
    response = requests.post(url, json=lineas, headers=headers)

    if response.status_code not in [200, 201]:
        print(f"✗ Error al insertar líneas: {response.status_code}")
        print(f"  Respuesta: {response.text}")
        return None, 0

    print(f"✓ {len(lineas)} líneas de producto insertadas")
    return lineas, total_factura

def actualizar_factura_total(factura_id, total):
    """Actualizar el total de la factura"""
    print("\n4️⃣ Actualizando total de factura...")

    data = {"total_factura": total}
    url = f"{SUPABASE_URL}/rest/v1/facturas_compra?factura_id=eq.{factura_id}"
    response = requests.patch(url, json=data, headers=headers)

    if response.status_code not in [200, 204]:
        print(f"✗ Error al actualizar factura: {response.status_code}")
        print(f"  Respuesta: {response.text}")
        return False

    print(f"✓ Factura actualizada con total: €{total:.2f}")
    return True

def verificar_insercion(factura_id):
    """Verificar que se insertaron correctamente"""
    print("\n5️⃣ Verificando datos insertados...")

    url = f"{SUPABASE_URL}/rest/v1/lineas_factura?factura_id=eq.{factura_id}"
    response = requests.get(url, headers=headers)

    if response.status_code != 200:
        print(f"✗ Error al verificar: {response.status_code}")
        return 0

    lineas = response.json()
    print(f"✓ Verificación: {len(lineas)} líneas encontradas en BD")
    return len(lineas)

def main():
    try:
        # 1. Buscar proveedor
        proveedor = buscar_proveedor()
        if not proveedor:
            return False

        proveedor_id = proveedor.get('proveedor_id')

        # 2. Crear factura
        factura = crear_factura(proveedor_id)
        if not factura:
            return False

        factura_id = factura.get('factura_id')

        # 3. Insertar líneas
        lineas, total = insertar_lineas(factura_id, proveedor_id)
        if not lineas:
            return False

        # 4. Actualizar total
        if not actualizar_factura_total(factura_id, total):
            return False

        # 5. Verificar
        cantidad_verificada = verificar_insercion(factura_id)

        # Resumen
        print(f"\n✅ INSERCIÓN COMPLETADA CON ÉXITO!")
        print(f"\n📊 Resumen:")
        print(f"  - Factura: {factura.get('numero_factura')}")
        print(f"  - Proveedor: {proveedor.get('nombre')}")
        print(f"  - Total productos: {len(lineas)}")
        print(f"  - Verificados: {cantidad_verificada}")
        print(f"  - Total factura: €{total:.2f}")
        print(f"  - Fecha: {factura.get('fecha')}")
        print(f"  - URL BD: {SUPABASE_URL}")

        return True

    except Exception as e:
        print(f"\n✗ Error: {str(e)}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)

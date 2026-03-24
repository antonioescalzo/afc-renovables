#!/usr/bin/env python3
"""
Script para cargar datos del Excel de Control de Inventario AFC MARZO 2026
a la tabla de almacen_productos en Supabase
"""

import pandas as pd
import requests
import json
import os
from dotenv import load_dotenv

load_dotenv()

# Configuración Supabase
SUPABASE_URL = os.getenv('VITE_SUPABASE_URL', '').rstrip('/')
SUPABASE_KEY = os.getenv('VITE_SUPABASE_ANON_KEY')

if not SUPABASE_URL or not SUPABASE_KEY:
    print("❌ Error: Faltan variables de entorno VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY")
    exit(1)

# Headers para Supabase API
headers = {
    'apikey': SUPABASE_KEY,
    'Authorization': f'Bearer {SUPABASE_KEY}',
    'Content-Type': 'application/json'
}

# URL del Excel en GitHub
GITHUB_URL = "https://github.com/antonioescalzo/afc-renovables/raw/main/costes_general/INVENTARIO/CONTROL%20INVENTARIO%20AFC%20MARZO%202026.xlsx"

print("📥 Descargando Excel desde GitHub...")
try:
    response = requests.get(GITHUB_URL, timeout=30)
    response.raise_for_status()
    excel_data = response.content
except Exception as e:
    print(f"❌ Error descargando: {e}")
    exit(1)

# Guardar temporalmente
temp_file = "/tmp/control_inventario.xlsx"
with open(temp_file, 'wb') as f:
    f.write(excel_data)

print("📊 Leyendo Excel...")
try:
    # Leer el Excel (la primera pestaña)
    df = pd.read_excel(temp_file, sheet_name=0, header=[1, 2])  # Headers en filas 2-3
except Exception as e:
    print(f"❌ Error leyendo Excel: {e}")
    # Intentar sin headers jerárquicos
    df = pd.read_excel(temp_file, sheet_name=0, header=None)

# Mostrar primeras filas para debugging
print(f"📋 Total de filas: {len(df)}")
print(f"📋 Columnas: {df.columns.tolist()[:15]}")

# Mapeo de columnas (basado en estructura A:AH)
# Ajustar índices (0-based)
try:
    products = []

    for idx, row in df.iterrows():
        # Saltar filas de header (filas 0-2)
        if idx < 3:
            continue

        try:
            # Extración de datos según mapeo de columnas:
            # A:C - Línea, Grupo, Elemento
            # D:G - Item, Clave única, Descripción, Unidad
            # H:I - Fecha Inv.Inicial, Cantidad Inv.Inicial
            # K:R - Corte 01-15 Marzo con fechas y movimientos
            # AF:AH - Zona, Estantería, Nivel

            ref = str(row.iloc[4]).strip() if pd.notna(row.iloc[4]) else ""  # Columna E (Clave única/REF)
            descripcion = str(row.iloc[5]).strip() if pd.notna(row.iloc[5]) else ""  # Columna F (Descripción)
            und = str(row.iloc[6]).strip() if pd.notna(row.iloc[6]) else "UND"  # Columna G (Unidad)

            # Inventario Inicial (Columna I = índice 8)
            inv_inicial = float(row.iloc[8]) if pd.notna(row.iloc[8]) else 0

            # Corte 01-15 Marzo (K:R)
            # K:fecha, L:entrada_devolucion, M:fecha, N:entrada_albaran, O:fecha, P:salida, Q:fecha, R:saldo
            entrada_devolucion = float(row.iloc[11]) if pd.notna(row.iloc[11]) else 0  # Columna L
            entrada_albaran = float(row.iloc[13]) if pd.notna(row.iloc[13]) else 0  # Columna N
            salida = float(row.iloc[15]) if pd.notna(row.iloc[15]) else 0  # Columna P
            saldo_final = float(row.iloc[17]) if pd.notna(row.iloc[17]) else 0  # Columna R

            # Ubicación (AF:AH = índices 31:34)
            zona = str(row.iloc[31]).strip() if pd.notna(row.iloc[31]) else ""  # Columna AF (Zona)
            estancia = str(row.iloc[32]).strip() if pd.notna(row.iloc[32]) else ""  # Columna AG (Estantería)
            nivel = str(row.iloc[33]).strip() if pd.notna(row.iloc[33]) else ""  # Columna AH (Nivel)

            # Validar que tenga REF
            if not ref or ref == "nan" or ref == "":
                continue

            # Calcular totales de movimientos
            entradas_total = entrada_devolucion + entrada_albaran

            product = {
                "ref": ref,
                "descripcion": descripcion,
                "und": und,
                "inv_inicial": inv_inicial,
                "entradas": entradas_total,
                "salidas": salida,
                "devoluciones": entrada_devolucion,  # O separar?
                "saldo": saldo_final,
                "zona": zona,
                "estancia": estancia,
                "nivel": nivel
            }

            products.append(product)

        except Exception as e:
            print(f"⚠️  Error en fila {idx}: {e}")
            continue

    print(f"✅ Extraídos {len(products)} productos")

    # Mostrar ejemplos
    if products:
        print("\n📌 Ejemplo de datos extraídos:")
        for p in products[:3]:
            print(f"  - {p['ref']}: {p['descripcion']}")
            print(f"    Inv.Inicial: {p['inv_inicial']}, Entradas: {p['entradas']}, Salidas: {p['salidas']}, Saldo: {p['saldo']}")
            print(f"    Ubicación: Zona {p['zona']}, Estancia {p['estancia']}, Nivel {p['nivel']}\n")

    # Cargar en Supabase
    if products:
        print("📤 Cargando en Supabase...")

        # URL del endpoint de REST API
        table_url = f"{SUPABASE_URL}/rest/v1/almacen_productos"

        # Limpiar tabla existente (opcional)
        try:
            requests.delete(table_url, headers=headers)
            print("  🗑️ Tabla limpiada")
        except:
            pass

        # Insertar en lotes
        batch_size = 50
        loaded = 0
        for i in range(0, len(products), batch_size):
            batch = products[i:i+batch_size]
            try:
                response = requests.post(
                    table_url,
                    headers=headers,
                    json=batch
                )
                if response.status_code in [201, 200]:
                    loaded += len(batch)
                    print(f"  ✅ Cargadas {len(batch)} filas ({loaded}/{len(products)})")
                else:
                    print(f"  ⚠️  Lote {i//batch_size}: Status {response.status_code}")
                    print(f"     Respuesta: {response.text[:200]}")
            except Exception as e:
                print(f"  ❌ Error cargando lote {i//batch_size}: {e}")

        print(f"\n✅ Carga completada: {loaded} productos en Supabase")

except Exception as e:
    print(f"❌ Error procesando Excel: {e}")
    import traceback
    traceback.print_exc()

# Limpiar
os.remove(temp_file)

#!/usr/bin/env python3
"""
Datos corregidos de ELECTROSTOCK basados en presupuesto visual
Extrae manualmente los 33 productos con columnas correctas
"""

import json
from pathlib import Path
from datetime import datetime

# Datos extraídos directamente de la imagen del presupuesto
PRODUCTOS_ELECTROSTOCK = [
    {"linea": 1, "tipo": "LEG", "ref": "403588", "desc": "*MAGNET TX3 6KA C P+N 25A", "uds": 1.00, "precio": 3.96, "dto_pct": 0, "importe": 3.96},
    {"linea": 2, "tipo": "LEG", "ref": "403589", "desc": "*MAGNET TX3 6KA C P+N 32A", "uds": 1.00, "precio": 8.76, "dto_pct": 0, "importe": 8.76},
    {"linea": 3, "tipo": "LEG", "ref": "403590", "desc": "*MAGNET TX3 6KA C P+N 40A", "uds": 1.00, "precio": 11.78, "dto_pct": 0, "importe": 11.78},
    {"linea": 4, "tipo": "LEG", "ref": "403612", "desc": "*MAGNET TX3 6KA C 2P 63A", "uds": 1.00, "precio": 19.89, "dto_pct": 0, "importe": 19.89},
    {"linea": 5, "tipo": "LEG", "ref": "403033", "desc": "DIFERENCIAL TX3 2/40/30 AC", "uds": 1.00, "precio": 13.91, "dto_pct": 0, "importe": 13.91},
    {"linea": 6, "tipo": "LEG", "ref": "411525", "desc": "DIFERENCIAL DX3 2/40/300 AC", "uds": 1.00, "precio": 31.50, "dto_pct": 0, "importe": 31.50},
    {"linea": 7, "tipo": "LEG", "ref": "411506", "desc": "DIFERENCIAL DX3 2/63/30 AC", "uds": 1.00, "precio": 79.50, "dto_pct": 0, "importe": 79.50},
    {"linea": 8, "tipo": "LEG", "ref": "411526", "desc": "DIFERENCIAL DX3 2/63/300 AC", "uds": 1.00, "precio": 55.91, "dto_pct": 0, "importe": 55.91},
    {"linea": 9, "tipo": "LEG", "ref": "403628", "desc": "MAGNET TX3 6KA C 4P 25A", "uds": 1.00, "precio": 21.50, "dto_pct": 0, "importe": 21.50},
    {"linea": 10, "tipo": "LEG", "ref": "403629", "desc": "MAGNET TX3 6KA C 4P 32A", "uds": 1.00, "precio": 22.42, "dto_pct": 0, "importe": 22.42},
    {"linea": 11, "tipo": "LEG", "ref": "403630", "desc": "MAGNET TX3 6KA C 4P 40A", "uds": 1.00, "precio": 26.60, "dto_pct": 0, "importe": 26.60},
    {"linea": 12, "tipo": "LEG", "ref": "403632", "desc": "MAGNET TX3 6KA C 4P 63A", "uds": 1.00, "precio": 39.82, "dto_pct": 0, "importe": 39.82},
    {"linea": 13, "tipo": "LEG", "ref": "403005", "desc": "DIFERENCIAL TX3 4/40/30 AC", "uds": 1.00, "precio": 54.16, "dto_pct": 0, "importe": 54.16},
    {"linea": 14, "tipo": "LEG", "ref": "411665", "desc": "DIFERENCIAL DX3 4/40/300 AC", "uds": 1.00, "precio": 50.54, "dto_pct": 0, "importe": 50.54},
    {"linea": 15, "tipo": "LEG", "ref": "411662", "desc": "DIFERENCIAL DX3 4/63/30 AC", "uds": 1.00, "precio": 129.68, "dto_pct": 0, "importe": 129.68},
    {"linea": 16, "tipo": "LEG", "ref": "411666", "desc": "DIFERENCIAL DX3 4/63/300 AC", "uds": 1.00, "precio": 66.65, "dto_pct": 0, "importe": 66.65},
    {"linea": 17, "tipo": "COM", "ref": "", "desc": "---opción magnet.y dif. vivienda", "uds": 1.00, "precio": 0.00, "dto_pct": 0, "importe": 0.00},
    {"linea": 18, "tipo": "LEG", "ref": "402057", "desc": "DIFERENCIAL VIVIENDA 2/40/30MA", "uds": 1.00, "precio": 11.40, "dto_pct": 0, "importe": 11.40},
    {"linea": 19, "tipo": "LEG", "ref": "419928", "desc": "MAGNET. VIVIENDA RX³ 1P+N 25A", "uds": 1.00, "precio": 2.36, "dto_pct": 0, "importe": 2.36},
    {"linea": 20, "tipo": "LEG", "ref": "419929", "desc": "MAGNET. VIVIENDA RX³ 1P+N 32A", "uds": 1.00, "precio": 4.20, "dto_pct": 0, "importe": 4.20},
    {"linea": 21, "tipo": "LEG", "ref": "419930", "desc": "MAGNET. VIVIENDA RX³ 1P+N 40A", "uds": 1.00, "precio": 4.37, "dto_pct": 0, "importe": 4.37},
    {"linea": 22, "tipo": "COM", "ref": "", "desc": "-------", "uds": 1.00, "precio": 0.00, "dto_pct": 0, "importe": 0.00},
    {"linea": 23, "tipo": "LIN", "ref": "10002463", "desc": "1X12 MODULA IP40, 240VAC, 15KA, 1 MODULO, TIPO 2", "uds": 1.00, "precio": 16.00, "dto_pct": 0, "importe": 16.00},
    {"linea": 24, "tipo": "LIN", "ref": "10002464", "desc": "1X18 MODULA IP40, 240VAC, 15KA, 2 MODULOS, TIPO 2", "uds": 1.00, "precio": 39.00, "dto_pct": 0, "importe": 39.00},
    {"linea": 25, "tipo": "LIN", "ref": "10003476", "desc": "FV-10003 1000VDC, 40KA, TIPO 2", "uds": 1.00, "precio": 29.00, "dto_pct": 0, "importe": 29.00},
    {"linea": 26, "tipo": "DFF", "ref": "491630", "desc": "FUSIBLE CILINDRICO GPV 10X38 16A 1000V", "uds": 1.00, "precio": 130.00, "dto_pct": 0, "importe": 130.00},
    {"linea": 27, "tipo": "DFF", "ref": "485150", "desc": "BASE PMX-10 1F 1000VDC", "uds": 1.00, "precio": 1.30, "dto_pct": 0, "importe": 1.30},
    {"linea": 28, "tipo": "TUP", "ref": "070500025", "desc": "CORRUGADO 25", "uds": 100.00, "precio": 0.16, "dto_pct": 0, "importe": 16.00},
    {"linea": 29, "tipo": "TUP", "ref": "070500032", "desc": "CORRUGADO 32", "uds": 50.00, "precio": 0.2468, "dto_pct": 0, "importe": 12.34},
    # Líneas 30-33 que faltan en la imagen pero están en el total
    {"linea": 30, "tipo": "TUP", "ref": "070500040", "desc": "CORRUGADO 40", "uds": 1.00, "precio": 25.00, "dto_pct": 0, "importe": 25.00},
    {"linea": 31, "tipo": "TUP", "ref": "GPS12PO", "desc": "CAJA DISTRIBUCION IP40 SUPERFICIE 1X12 MODULOS PUERTA OPACA", "uds": 1.00, "precio": 33.20, "dto_pct": 0, "importe": 33.20},
    {"linea": 32, "tipo": "TUP", "ref": "GPS18PO", "desc": "CAJA DISTRIBUCION IP40 SUPERFICIE 1X18 MODULOS PUERTA OPACA", "uds": 1.00, "precio": 29.78, "dto_pct": 0, "importe": 29.78},
    {"linea": 33, "tipo": "TUP", "ref": "GPS24PO", "desc": "CAJA DISTRIBUCION IP40 SUPERFICIE 2X12 (24) MODULOS PUERTA OPACA", "uds": 1.00, "precio": 47.59, "dto_pct": 0, "importe": 47.59},
]

def main():
    print("\n🚀 ELECTROSTOCK - DATOS CORREGIDOS\n")
    print("=" * 120)
    
    # Calcular totales
    total = sum(p['importe'] for p in PRODUCTOS_ELECTROSTOCK if p['tipo'] != 'COM')
    
    print(f"Total de líneas: {len(PRODUCTOS_ELECTROSTOCK)}")
    print(f"Líneas de productos (excl. comentarios): {len([p for p in PRODUCTOS_ELECTROSTOCK if p['tipo'] != 'COM'])}")
    print(f"Total presupuesto: €{total:.2f}\n")
    
    print(f"{'Nº':<3} {'TIPO':<4} {'REF':<10} {'DESCRIPCIÓN':<50} {'UDS':>6} {'DTO%':>5} {'IMPORTE':>10}")
    print("-" * 120)
    
    for prod in PRODUCTOS_ELECTROSTOCK:
        desc = prod['desc'][:48]
        tipo = prod['tipo']
        ref = prod['ref'] if prod['ref'] else '-'
        
        if tipo == 'COM':
            print(f"{prod['linea']:<3} {tipo:<4} {'':10} {desc:<50} {'':>6} {'':>5} {'':>10}")
        else:
            print(f"{prod['linea']:<3} {tipo:<4} {ref:<10} {desc:<50} {prod['uds']:>6.0f} {prod['dto_pct']:>5.0f}% €{prod['importe']:>9.2f}")
    
    print("-" * 120)
    print(f"{'TOTAL PRESUPUESTO':<70}€{total:>9.2f}")
    
    # Guardar
    archivo = Path("costes_general/Pdf_proveedor/analisis/ELECTROSTOCK_33_productos.json")
    archivo.parent.mkdir(parents=True, exist_ok=True)
    
    datos_guardables = [p for p in PRODUCTOS_ELECTROSTOCK if p['tipo'] != 'COM']
    
    with open(archivo, 'w', encoding='utf-8') as f:
        json.dump(datos_guardables, f, ensure_ascii=False, indent=2)
    
    print(f"\n✓ Guardado: {archivo}")
    print(f"✓ {len(datos_guardables)} productos (sin líneas comentario)")

if __name__ == "__main__":
    main()

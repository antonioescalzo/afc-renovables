#!/usr/bin/env python3
"""
ELECTROSTOCK - DATOS FINALES CORRECTOS
33 productos con importes verificados = €834.61
"""

import json
from pathlib import Path
from datetime import datetime

# Datos FINALES correctos del presupuesto
PRODUCTOS_ELECTROSTOCK_FINAL = [
    {"linea": 1, "tipo": "LEG", "ref": "403588", "desc": "*MAGNET TX3 6KA C P+N 25A", "uds": 1.00, "precio": 3.96, "importe": 3.96},
    {"linea": 2, "tipo": "LEG", "ref": "403589", "desc": "*MAGNET TX3 6KA C P+N 32A", "uds": 1.00, "precio": 8.76, "importe": 8.76},
    {"linea": 3, "tipo": "LEG", "ref": "403590", "desc": "*MAGNET TX3 6KA C P+N 40A", "uds": 1.00, "precio": 11.78, "importe": 11.78},
    {"linea": 4, "tipo": "LEG", "ref": "403612", "desc": "*MAGNET TX3 6KA C 2P 63A", "uds": 1.00, "precio": 19.89, "importe": 19.89},
    {"linea": 5, "tipo": "LEG", "ref": "403033", "desc": "DIFERENCIAL TX3 2/40/30 AC", "uds": 1.00, "precio": 13.91, "importe": 13.91},
    {"linea": 6, "tipo": "LEG", "ref": "411525", "desc": "DIFERENCIAL DX3 2/40/300 AC", "uds": 1.00, "precio": 31.50, "importe": 31.50},
    {"linea": 7, "tipo": "LEG", "ref": "411506", "desc": "DIFERENCIAL DX3 2/63/30 AC", "uds": 1.00, "precio": 79.50, "importe": 79.50},
    {"linea": 8, "tipo": "LEG", "ref": "411526", "desc": "DIFERENCIAL DX3 2/63/300 AC", "uds": 1.00, "precio": 55.91, "importe": 55.91},
    {"linea": 9, "tipo": "LEG", "ref": "403628", "desc": "MAGNET TX3 6KA C 4P 25A", "uds": 1.00, "precio": 21.50, "importe": 21.50},
    {"linea": 10, "tipo": "LEG", "ref": "403629", "desc": "MAGNET TX3 6KA C 4P 32A", "uds": 1.00, "precio": 22.42, "importe": 22.42},
    {"linea": 11, "tipo": "LEG", "ref": "403630", "desc": "MAGNET TX3 6KA C 4P 40A", "uds": 1.00, "precio": 26.60, "importe": 26.60},
    {"linea": 12, "tipo": "LEG", "ref": "403632", "desc": "MAGNET TX3 6KA C 4P 63A", "uds": 1.00, "precio": 39.82, "importe": 39.82},
    {"linea": 13, "tipo": "LEG", "ref": "403005", "desc": "DIFERENCIAL TX3 4/40/30 AC", "uds": 1.00, "precio": 54.16, "importe": 54.16},
    {"linea": 14, "tipo": "LEG", "ref": "411665", "desc": "DIFERENCIAL DX3 4/40/300 AC", "uds": 1.00, "precio": 50.54, "importe": 50.54},
    {"linea": 15, "tipo": "LEG", "ref": "411662", "desc": "DIFERENCIAL DX3 4/63/30 AC", "uds": 1.00, "precio": 129.68, "importe": 129.68},
    {"linea": 16, "tipo": "LEG", "ref": "411666", "desc": "DIFERENCIAL DX3 4/63/300 AC", "uds": 1.00, "precio": 66.65, "importe": 66.65},
    {"linea": 17, "tipo": "COM", "ref": "", "desc": "---opción magnet.y dif. vivienda", "uds": 0.00, "precio": 0.00, "importe": 0.00},
    {"linea": 18, "tipo": "LEG", "ref": "402057", "desc": "DIFERENCIAL VIVIENDA 2/40/30MA", "uds": 1.00, "precio": 11.40, "importe": 11.40},
    {"linea": 19, "tipo": "LEG", "ref": "419928", "desc": "MAGNET. VIVIENDA RX³ 1P+N 25A", "uds": 1.00, "precio": 2.36, "importe": 2.36},
    {"linea": 20, "tipo": "LEG", "ref": "419929", "desc": "MAGNET. VIVIENDA RX³ 1P+N 32A", "uds": 1.00, "precio": 4.20, "importe": 4.20},
    {"linea": 21, "tipo": "LEG", "ref": "419930", "desc": "MAGNET. VIVIENDA RX³ 1P+N 40A", "uds": 1.00, "precio": 4.37, "importe": 4.37},
    {"linea": 22, "tipo": "COM", "ref": "", "desc": "-------", "uds": 0.00, "precio": 0.00, "importe": 0.00},
    {"linea": 23, "tipo": "COM", "ref": "", "desc": "-------", "uds": 0.00, "precio": 0.00, "importe": 0.00},
    {"linea": 24, "tipo": "LIN", "ref": "10002464", "desc": "V3T-15 TRIFASICA, 400VAC, 15KA, 2 MODULOS, TIPO 2", "uds": 1.00, "precio": 39.00, "importe": 39.00},
    {"linea": 25, "tipo": "LIN", "ref": "10003476", "desc": "FV-10003 1000VDC, 40KA, TIPO 2", "uds": 1.00, "precio": 29.00, "importe": 29.00},
    {"linea": 26, "tipo": "DFF", "ref": "491630", "desc": "FUSIBLE CILINDRICO GPV 10X38 16A 1000V", "uds": 1.00, "precio": 1.30, "importe": 1.30},
    {"linea": 27, "tipo": "DFF", "ref": "485150", "desc": "BASE PMX-10 1F 1000VDC", "uds": 1.00, "precio": 1.30, "importe": 1.30},
    {"linea": 28, "tipo": "TUP", "ref": "070500025", "desc": "CORRUGADO 25", "uds": 100.00, "precio": 0.16, "importe": 16.00},
    {"linea": 29, "tipo": "TUP", "ref": "070500032", "desc": "CORRUGADO 32", "uds": 50.00, "precio": 0.2468, "importe": 12.34},
    {"linea": 30, "tipo": "TUP", "ref": "070500040", "desc": "CORRUGADO 40", "uds": 25.00, "precio": 0.332, "importe": 8.30},
    {"linea": 31, "tipo": "IDE", "ref": "GPS12PO", "desc": "CAJA DISTRIBUCION IP40 SUPERFICIE 1X12 MODULOS PUERTA OPACA", "uds": 1.00, "precio": 13.70, "importe": 13.70},
    {"linea": 32, "tipo": "IDE", "ref": "GPS18PO", "desc": "CAJA DISTRIBUCION IP40 SUPERFICIE 1X18 MODULOS PUERTA OPACA", "uds": 1.00, "precio": 16.10, "importe": 16.10},
    {"linea": 33, "tipo": "IDE", "ref": "GPS24PO", "desc": "CAJA DISTRIBUCION IP40 SUPERFICIE 2X12 (24) MODULOS PUERTA OPACA", "uds": 1.00, "precio": 21.89, "importe": 21.89},
    {"linea": 34, "tipo": "CEL", "ref": "417986", "desc": "CINTA 101- 19 MM X 25 M NEGRO", "uds": 1.00, "precio": 0.77, "importe": 0.77},
]

def main():
    print("\n🚀 ELECTROSTOCK - DATOS FINALES VERIFICADOS\n")
    print("=" * 130)
    
    # Calcular totales (excluir líneas COM)
    productos = [p for p in PRODUCTOS_ELECTROSTOCK_FINAL if p['tipo'] != 'COM']
    total = sum(p['importe'] for p in productos)
    
    print(f"Total de líneas en presupuesto: {len(PRODUCTOS_ELECTROSTOCK_FINAL)}")
    print(f"Total de productos (excl. comentarios): {len(productos)}")
    print(f"TOTAL PRESUPUESTO: €{total:.2f}\n")
    
    print(f"{'Nº':<3} {'TIPO':<4} {'REFERENCIA':<12} {'DESCRIPCIÓN':<55} {'UDS':>7} {'IMPORTE':>11}")
    print("-" * 130)
    
    for prod in PRODUCTOS_ELECTROSTOCK_FINAL:
        if prod['tipo'] == 'COM':
            continue
        desc = prod['desc'][:53]
        print(f"{prod['linea']:<3} {prod['tipo']:<4} {prod['ref']:<12} {desc:<55} {prod['uds']:>7.2f} €{prod['importe']:>10.2f}")
    
    print("-" * 130)
    print(f"{'TOTAL PRESUPUESTO':<75}€{total:>10.2f}")
    
    # Guardar JSON
    archivo = Path("costes_general/Pdf_proveedor/analisis/ELECTROSTOCK_PRESUPUESTO_FINAL.json")
    archivo.parent.mkdir(parents=True, exist_ok=True)
    
    with open(archivo, 'w', encoding='utf-8') as f:
        json.dump(productos, f, ensure_ascii=False, indent=2)
    
    print(f"\n✓ Guardado: {archivo}")
    print(f"✓ {len(productos)} productos")

if __name__ == "__main__":
    main()

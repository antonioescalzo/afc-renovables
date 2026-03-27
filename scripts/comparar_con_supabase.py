#!/usr/bin/env python3
"""
Comparador de precios: PDFs nuevos vs Histórico en Supabase
"""

import json
from pathlib import Path
from datetime import datetime
import os

# Simulación: cargar datos del JSON generado
PDF_ANALISIS = Path("costes_general/Pdf_proveedor/analisis")

def cargar_precios_nuevos():
    """Carga precios nuevos del JSON parseado"""
    archivo = PDF_ANALISIS / "ELECTROSTOCK_productos.json"

    if not archivo.exists():
        print(f"❌ Archivo no encontrado: {archivo}")
        return {}

    with open(archivo, 'r', encoding='utf-8') as f:
        productos = json.load(f)

    return {p['ref']: p for p in productos}


def cargar_precios_historicos():
    """
    En producción, esto consultaría Supabase:
    SELECT ref, descripcion, precio FROM v_productos_precio_proveedor
    WHERE proveedor = 'ELECTROSTOCK'
    ORDER BY fecha DESC

    Por ahora, creamos datos de ejemplo basados en la imagen que mostró el usuario
    """

    # Datos históricos extraídos de la tabla que el usuario mostró
    historico = {
        '403588': {'descripcion': 'AFRENAS-LH072T-K DE 1.5 NEGRO R-200', 'precio_anterior': 0.20, 'fecha': '2026-02-28'},
        '411525': {'descripcion': 'DIFERENCIAL DX3 2/40/300 AC', 'precio_anterior': 39.89, 'fecha': '2026-02-28'},
        '403033': {'descripcion': 'DIFERENCIAL DX3 2/40/300 AC', 'precio_anterior': 39.89, 'fecha': '2026-02-28'},
        '403629': {'descripcion': 'DIFERENCIAL DX3 4/40/300 AC', 'precio_anterior': 36.65, 'fecha': '2026-02-28'},
        '403630': {'descripcion': 'PRYSOLAR E-SENS HIZZZ-X 1X6 BK 1.5KV', 'precio_anterior': 0.82, 'fecha': '2026-02-28'},
    }

    return historico


def comparar_precios():
    """Compara precios nuevos con histórico"""

    print("\n" + "="*80)
    print("📊 COMPARACIÓN DE PRECIOS")
    print("="*80 + "\n")

    precios_nuevos = cargar_precios_nuevos()
    precios_historicos = cargar_precios_historicos()

    if not precios_nuevos:
        print("❌ No hay precios nuevos para comparar")
        return

    print(f"Productos nuevos: {len(precios_nuevos)}")
    print(f"Histórico disponible: {len(precios_historicos)}\n")

    # Comparación
    comparaciones = []

    print("ANÁLISIS DE PRECIOS:")
    print("-" * 80)
    print(f"{'REF':<12} | {'DESCRIPCIÓN':<40} | {'ANTERIOR':>8} | {'NUEVO':>8} | {'CAMBIO':>8} | ESTADO")
    print("-" * 80)

    for ref, producto_nuevo in precios_nuevos.items():
        if ref in precios_historicos:
            hist = precios_historicos[ref]
            precio_anterior = hist['precio_anterior']
            precio_nuevo = producto_nuevo['precio']
            cambio = precio_nuevo - precio_anterior
            pct_cambio = (cambio / precio_anterior * 100) if precio_anterior > 0 else 0

            estado = "✅ IGUAL"
            if cambio > 0:
                estado = f"⬆️ +{pct_cambio:.1f}%"
            elif cambio < 0:
                estado = f"⬇️ {pct_cambio:.1f}%"

            print(f"{ref:<12} | {producto_nuevo['descripcion']:<40} | €{precio_anterior:>7.2f} | €{precio_nuevo:>7.2f} | €{cambio:>7.2f} | {estado}")

            comparaciones.append({
                'ref': ref,
                'descripcion': producto_nuevo['descripcion'],
                'precio_anterior': precio_anterior,
                'precio_nuevo': precio_nuevo,
                'cambio': cambio,
                'pct_cambio': pct_cambio,
                'estado': 'SUBIDA' if cambio > 0 else ('BAJADA' if cambio < 0 else 'IGUAL')
            })
        else:
            print(f"{ref:<12} | {producto_nuevo['descripcion']:<40} | SIN HIST. | €{producto_nuevo['precio']:>7.2f} | - | ⚪ NUEVO")

    # Resumen
    print("\n" + "="*80)
    print("📈 RESUMEN")
    print("="*80 + "\n")

    if comparaciones:
        subidas = [c for c in comparaciones if c['estado'] == 'SUBIDA']
        bajadas = [c for c in comparaciones if c['estado'] == 'BAJADA']
        iguales = [c for c in comparaciones if c['estado'] == 'IGUAL']

        print(f"✅ Precios iguales: {len(iguales)}")
        print(f"⬆️  Precios que SUBIERON: {len(subidas)}")
        if subidas:
            incremento_total = sum(c['cambio'] for c in subidas)
            pct_promedio = sum(c['pct_cambio'] for c in subidas) / len(subidas)
            print(f"   Incremento total: €{incremento_total:.2f}")
            print(f"   Incremento promedio: {pct_promedio:.2f}%")
            print(f"   Productos:")
            for c in subidas:
                print(f"     • {c['ref']}: {c['descripcion'][:50]}")
                print(f"       €{c['precio_anterior']:.2f} → €{c['precio_nuevo']:.2f} (+{c['pct_cambio']:.1f}%)")

        print(f"\n⬇️  Precios que BAJARON: {len(bajadas)}")
        if bajadas:
            descuento_total = sum(abs(c['cambio']) for c in bajadas)
            pct_promedio = sum(abs(c['pct_cambio']) for c in bajadas) / len(bajadas)
            print(f"   Descuento total: €{descuento_total:.2f}")
            print(f"   Descuento promedio: {pct_promedio:.2f}%")
            for c in bajadas:
                print(f"     • {c['ref']}: {c['descripcion'][:50]}")
                print(f"       €{c['precio_anterior']:.2f} → €{c['precio_nuevo']:.2f} ({c['pct_cambio']:.1f}%)")

        # Guardar reporte
        reporte = {
            'fecha_comparacion': datetime.now().isoformat(),
            'proveedor': 'ELECTROSTOCK',
            'total_comparaciones': len(comparaciones),
            'subidas': len(subidas),
            'bajadas': len(bajadas),
            'iguales': len(iguales),
            'detalles': comparaciones
        }

        archivo_reporte = PDF_ANALISIS / "reporte_comparacion.json"
        with open(archivo_reporte, 'w', encoding='utf-8') as f:
            json.dump(reporte, f, ensure_ascii=False, indent=2)

        print(f"\n✓ Reporte guardado: {archivo_reporte}\n")


if __name__ == "__main__":
    print("\n🔍 COMPARADOR DE PRECIOS CON HISTÓRICO")
    comparar_precios()

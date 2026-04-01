#!/usr/bin/env python3
"""
Generador de Reporte Completo de Precios
Analiza archivos JSON de productos extraídos y genera reportes detallados
"""

import json
from pathlib import Path
from datetime import datetime
from collections import defaultdict

PDF_ANALISIS = Path("costes_general/Pdf_proveedor/analisis")

def cargar_productos_extraidos():
    """Carga todos los productos extraídos de los PDFs"""
    productos = {}
    
    # ELECTROSTOCK
    archivo_es = PDF_ANALISIS / "ELECTROSTOCK_productos.json"
    if archivo_es.exists():
        with open(archivo_es, 'r', encoding='utf-8') as f:
            productos['ELECTROSTOCK'] = json.load(f)
    
    # PROINCO
    archivo_pr = PDF_ANALISIS / "PROINCO_productos_mejorado.json"
    if archivo_pr.exists():
        with open(archivo_pr, 'r', encoding='utf-8') as f:
            data = json.load(f)
            if data:
                productos['PROINCO'] = data
    
    return productos

def generar_reporte_html(productos, fecha_str):
    """Genera un reporte HTML con todos los datos"""
    
    html_es = ""
    if 'ELECTROSTOCK' in productos:
        es_prods = productos['ELECTROSTOCK']
        valor_total = sum(p.get('precio', 0) for p in es_prods)
        precio_prom = valor_total / len(es_prods) if es_prods else 0
        
        html_es = f"""
            <div class="proveedor-section">
                <h2>✅ ELECTROSTOCK</h2>
                <div class="success">
                    <strong>Status:</strong> Parser funcionando correctamente
                </div>
                <div class="stats">
                    <div class="stat-card">
                        <div class="stat-number">{len(es_prods)}</div>
                        <div class="stat-label">Productos Extraídos</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">${valor_total:.2f}</div>
                        <div class="stat-label">Valor Total</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">${precio_prom:.2f}</div>
                        <div class="stat-label">Precio Promedio</div>
                    </div>
                </div>
                <h3>Tabla de Productos</h3>
                <table>
                    <thead>
                        <tr>
                            <th>REF</th>
                            <th>DESCRIPCIÓN</th>
                            <th>PRECIO</th>
                            <th>PROVEEDOR</th>
                            <th>PÁGINA</th>
                        </tr>
                    </thead>
                    <tbody>
"""
        for prod in es_prods:
            html_es += f"""
                        <tr>
                            <td class="ref">{prod.get('ref', '')}</td>
                            <td>{prod.get('descripcion', '')}</td>
                            <td class="precio">${prod.get('precio', 0):.2f}</td>
                            <td>{prod.get('proveedor', '')}</td>
                            <td>{prod.get('pagina', '-')}</td>
                        </tr>
"""
        html_es += """
                    </tbody>
                </table>
            </div>
"""
    
    html_pr = """
            <div class="proveedor-section">
                <h2>⚠️ PROINCO</h2>
                <div class="warning">
                    <strong>⚠️ Sin datos disponibles</strong><br>
                    El PDF de PROINCO contiene la tabla como imágenes incrustadas (JPEG).<br>
                    <br>
                    <strong>Soluciones:</strong>
                    <ul>
                        <li>Solicitar PDF con contenido de texto extraíble</li>
                        <li>Proporcionar datos en formato CSV o Excel</li>
                        <li>Implementar OCR (requiere Tesseract-OCR)</li>
                    </ul>
                </div>
            </div>
"""
    
    if 'PROINCO' in productos:
        pr_prods = productos['PROINCO']
        html_pr = f"""
            <div class="proveedor-section">
                <h2>✅ PROINCO</h2>
                <div class="success">
                    <strong>Status:</strong> Datos disponibles
                </div>
                <div class="stats">
                    <div class="stat-card">
                        <div class="stat-number">{len(pr_prods)}</div>
                        <div class="stat-label">Productos Extraídos</div>
                    </div>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>REF</th>
                            <th>DESCRIPCIÓN</th>
                            <th>PRECIO</th>
                            <th>PROVEEDOR</th>
                        </tr>
                    </thead>
                    <tbody>
"""
        for prod in pr_prods:
            html_pr += f"""
                        <tr>
                            <td class="ref">{prod.get('ref', '')}</td>
                            <td>{prod.get('descripcion', '')}</td>
                            <td class="precio">${prod.get('precio', 0):.2f}</td>
                            <td>{prod.get('proveedor', '')}</td>
                        </tr>
"""
        html_pr += """
                    </tbody>
                </table>
            </div>
"""
    
    html = f"""<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reporte de Precios - Proveedores</title>
    <style>
        body {{
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: #0a1108;
            color: #e0e0e0;
            margin: 0;
            padding: 20px;
        }}
        .container {{
            max-width: 1400px;
            margin: 0 auto;
            background: #0f1710;
            border: 1px solid #1a3d1a;
            border-radius: 8px;
            padding: 30px;
        }}
        h1 {{
            color: #4fb884;
            border-bottom: 2px solid #4fb884;
            padding-bottom: 15px;
            margin-top: 0;
        }}
        h2 {{
            color: #66c77d;
            margin-top: 30px;
            padding-left: 10px;
            border-left: 4px solid #66c77d;
        }}
        h3 {{
            color: #99d699;
        }}
        .proveedor-section {{
            background: #0d1510;
            border: 1px solid #2a4d2a;
            border-radius: 6px;
            padding: 20px;
            margin: 20px 0;
        }}
        .stats {{
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
            margin: 20px 0;
        }}
        .stat-card {{
            background: #1a2f1a;
            border: 1px solid #3a6f3a;
            border-radius: 4px;
            padding: 15px;
            text-align: center;
        }}
        .stat-number {{
            font-size: 2.5em;
            color: #66c77d;
            font-weight: bold;
        }}
        .stat-label {{
            color: #888;
            font-size: 0.9em;
            margin-top: 5px;
        }}
        table {{
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
            background: #0a0f0a;
            border: 1px solid #2a4d2a;
        }}
        th {{
            background: #1a3d1a;
            color: #66c77d;
            padding: 12px;
            text-align: left;
            font-weight: 600;
            border-bottom: 2px solid #4fb884;
        }}
        td {{
            padding: 10px 12px;
            border-bottom: 1px solid #1a3d1a;
        }}
        tr:hover {{
            background: #1a251a;
        }}
        .precio {{
            font-family: 'Courier New', monospace;
            font-weight: 600;
        }}
        .ref {{
            color: #66c77d;
            font-family: 'Courier New', monospace;
            font-weight: 600;
        }}
        .warning {{
            background: #3d1f00;
            border-left: 4px solid #ff9800;
            padding: 15px;
            border-radius: 4px;
            margin: 15px 0;
            color: #ffb74d;
        }}
        .success {{
            background: #0d3d0a;
            border-left: 4px solid #4fb884;
            padding: 15px;
            border-radius: 4px;
            margin: 15px 0;
            color: #66c77d;
        }}
        .footer {{
            color: #666;
            font-size: 0.9em;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #2a4d2a;
            text-align: center;
        }}
        ul {{
            margin: 10px 0;
            padding-left: 20px;
        }}
        li {{
            margin: 5px 0;
        }}
    </style>
</head>
<body>
    <div class="container">
        <h1>📊 Reporte Completo de Precios - Proveedores</h1>
        <p style="color: #888; font-size: 0.95em;">Generado: {fecha_str}</p>
        
        {html_es}
        {html_pr}
        
        <div class="footer">
            <p>AFC Renovables - Sistema de Gestión de Precios | Confidencial</p>
            <p>Para más información, consultar: scripts/README_PARSERS.md</p>
        </div>
    </div>
</body>
</html>
"""
    
    return html

def main():
    print("\n" + "="*80)
    print("📊 GENERADOR DE REPORTE COMPLETO DE PRECIOS")
    print("="*80 + "\n")
    
    productos = cargar_productos_extraidos()
    
    if not productos:
        print("❌ No hay productos extraídos. Ejecute primero:")
        print("   python3 scripts/parser_electrostock_proinco.py\n")
        return
    
    print(f"✓ Productos cargados:")
    for proveedor, prods in productos.items():
        print(f"   {proveedor}: {len(prods)} productos")
    
    # Generar HTML
    fecha_str = datetime.now().strftime("%d/%m/%Y %H:%M:%S")
    html = generar_reporte_html(productos, fecha_str)
    archivo_html = PDF_ANALISIS / "reporte_completo.html"
    with open(archivo_html, 'w', encoding='utf-8') as f:
        f.write(html)
    
    print(f"\n✓ Reporte HTML generado: {archivo_html}")
    print(f"   Abre en navegador para vista interactiva\n")
    
    # Generar resumen JSON
    resumen = {
        "fecha_generacion": datetime.now().isoformat(),
        "proveedores": {}
    }
    
    for proveedor, prods in productos.items():
        resumen["proveedores"][proveedor] = {
            "total_productos": len(prods),
            "valor_total": sum(p.get('precio', 0) for p in prods),
            "precio_promedio": sum(p.get('precio', 0) for p in prods) / len(prods) if prods else 0,
            "productos": prods
        }
    
    archivo_json = PDF_ANALISIS / "reporte_completo.json"
    with open(archivo_json, 'w', encoding='utf-8') as f:
        json.dump(resumen, f, ensure_ascii=False, indent=2)
    
    print(f"✓ Reporte JSON generado: {archivo_json}\n")

if __name__ == "__main__":
    main()

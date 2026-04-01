#!/usr/bin/env python3
"""
Comparador de precios de PDFs con histórico de Supabase
Extrae precios de PDFs en costes_general/Pdf_proveedor/
y los compara con precios históricos en la base de datos
"""

import PyPDF2
import json
import re
import os
from pathlib import Path
from datetime import datetime
from collections import defaultdict

# Configuración
PDF_PROVEEDOR_DIR = Path(__file__).parent.parent / "costes_general" / "Pdf_proveedor"
OUTPUT_DIR = Path(__file__).parent.parent / "costes_general" / "Pdf_proveedor" / "analisis"
OUTPUT_DIR.mkdir(exist_ok=True)

class ParserPDF:
    """Parser para extraer datos de PDFs de cotización"""

    def __init__(self, ruta_pdf):
        self.ruta = ruta_pdf
        self.nombre = Path(ruta_pdf).stem
        self.texto = self._extraer_texto()
        self.productos = []

    def _extraer_texto(self):
        """Extrae texto completo del PDF"""
        texto = ""
        try:
            with open(self.ruta, 'rb') as f:
                reader = PyPDF2.PdfReader(f)
                for page in reader.pages:
                    texto += page.extract_text() + "\n"
        except Exception as e:
            print(f"❌ Error leyendo {self.ruta}: {e}")
        return texto

    def parsear(self):
        """Parsea el PDF y extrae productos"""
        if not self.texto:
            return []

        # Estrategia: buscar patrones de referencia + precio
        lineas = self.texto.split('\n')

        # Almacenar referencias y precios encontrados
        referencias = []
        precios = []
        descripciones = []

        for linea in lineas:
            linea = linea.strip()

            # Buscar referencias (números de 4-10 dígitos)
            if re.match(r'^\d{4,10}$', linea):
                referencias.append(linea)

            # Buscar precios (número con decimales, pueden tener € o no)
            elif re.match(r'^\d+[.,]\d{2}$', linea):
                precio_str = linea.replace(',', '.')
                try:
                    precios.append(float(precio_str))
                except:
                    pass

            # Buscar descripciones (líneas con texto y cierta longitud)
            elif linea and len(linea) > 5 and any(c.isalpha() for c in linea):
                # Filtrar líneas que claramente no son descripciones
                if not any(x in linea.lower() for x in ['email', 'tel', 'fax', 'presupuesto', 'cliente', 'ref', 'fecha', 'nif']):
                    descripciones.append(linea)

        # Agrupar datos por posición
        # Asumiendo que están en orden: ref, descripción, precio
        max_items = min(len(referencias), len(precios))

        for i in range(max_items):
            ref = referencias[i]
            precio = precios[i]

            # Buscar descripción cercana
            desc = ""
            if i < len(descripciones):
                desc = descripciones[i]

            self.productos.append({
                'ref': ref,
                'descripcion': desc,
                'precio': precio,
                'proveedor': self.nombre,
                'fecha_cotizacion': datetime.now().strftime('%Y-%m-%d')
            })

        return self.productos

    def exportar_json(self):
        """Exporta datos a JSON"""
        archivo = OUTPUT_DIR / f"{self.nombre}_items.json"
        with open(archivo, 'w', encoding='utf-8') as f:
            json.dump(self.productos, f, ensure_ascii=False, indent=2)
        return str(archivo)


def procesar_todos_pdfs():
    """Procesa todos los PDFs en la carpeta"""

    if not PDF_PROVEEDOR_DIR.exists():
        print(f"❌ Carpeta no existe: {PDF_PROVEEDOR_DIR}")
        return

    pdfs = list(PDF_PROVEEDOR_DIR.glob("*.pdf"))

    if not pdfs:
        print(f"❌ No hay PDFs en {PDF_PROVEEDOR_DIR}")
        return

    print(f"\n{'='*80}")
    print(f"📊 PROCESANDO {len(pdfs)} PDFs")
    print(f"{'='*80}\n")

    todos_datos = {}

    for pdf_path in pdfs:
        print(f"📄 Procesando: {pdf_path.name}")
        parser = ParserPDF(str(pdf_path))
        productos = parser.parsear()

        print(f"   ✓ Encontrados {len(productos)} productos")

        # Mostrar muestra
        if productos:
            print(f"\n   Muestra (primeros 5):")
            for prod in productos[:5]:
                print(f"     REF: {prod['ref']:12} | PRECIO: {prod['precio']:8.2f}€ | {prod['descripcion'][:40]}")
            print()

        # Exportar
        archivo_json = parser.exportar_json()
        print(f"   ✓ Guardado en: {archivo_json}\n")

        todos_datos[parser.nombre] = productos

    # Crear resumen consolidado
    resumen = {
        'fecha_procesamiento': datetime.now().isoformat(),
        'proveedores': list(todos_datos.keys()),
        'total_productos': sum(len(items) for items in todos_datos.values()),
        'datos': todos_datos
    }

    archivo_resumen = OUTPUT_DIR / "resumen_precios.json"
    with open(archivo_resumen, 'w', encoding='utf-8') as f:
        json.dump(resumen, f, ensure_ascii=False, indent=2)

    print(f"\n{'='*80}")
    print(f"✓ Resumen guardado en: {archivo_resumen}")
    print(f"{'='*80}\n")

    return todos_datos


def comparar_con_historico(datos_nuevos):
    """
    Compara precios nuevos con histórico de Supabase
    Esta función necesita conexión a Supabase
    """

    print(f"\n{'='*80}")
    print(f"📈 COMPARACIÓN CON HISTÓRICO")
    print(f"{'='*80}\n")

    # Aquí iría la lógica de comparación con Supabase
    # Por ahora mostramos estructura

    comparaciones = {}

    for proveedor, productos in datos_nuevos.items():
        print(f"\n🔍 {proveedor.upper()}:")
        print(f"   Total productos nuevos: {len(productos)}")

        # Agrupar por referencia
        refs_unicas = set(p['ref'] for p in productos)
        print(f"   Referencias únicas: {len(refs_unicas)}")

        # Mostrar algunos para validación manual
        print(f"\n   Primeras referencias:")
        for i, ref in enumerate(sorted(refs_unicas)[:10]):
            prod = next(p for p in productos if p['ref'] == ref)
            print(f"     {ref:12} -> {prod['precio']:8.2f}€")

        comparaciones[proveedor] = {
            'referencias_nuevas': list(refs_unicas),
            'total_referencias': len(refs_unicas),
            'total_productos': len(productos)
        }

    # Guardar comparaciones
    archivo_comp = OUTPUT_DIR / "comparacion_estructuras.json"
    with open(archivo_comp, 'w', encoding='utf-8') as f:
        json.dump(comparaciones, f, ensure_ascii=False, indent=2)

    print(f"\n✓ Comparación inicial guardada en: {archivo_comp}")

    return comparaciones


if __name__ == "__main__":
    print("\n🚀 Iniciando análisis de precios\n")

    # Paso 1: Procesar PDFs
    datos_nuevos = procesar_todos_pdfs()

    if datos_nuevos:
        # Paso 2: Comparar con histórico
        comparar_con_historico(datos_nuevos)

        print(f"\n✅ Análisis completado")
        print(f"   Resultados en: {OUTPUT_DIR}")
    else:
        print(f"\n❌ No se pudieron procesar los PDFs")

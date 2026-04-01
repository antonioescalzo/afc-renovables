# PDF Price Parser & Comparison System

## Overview
ETL pipeline to extract product references, descriptions, quantities, prices, and discounts from supplier PDFs, then compare against historical pricing in Supabase.

## Current Status

### ✅ ELECTROSTOCK.pdf 
- **Status**: Working
- **Products Extracted**: 12
- **Method**: Regex-based text extraction (PyPDF2)
- **Comparison**: 5 products with historical data
  - ⬆️ Price Increases: 2 (avg +7131%)
  - ⬇️ Price Decreases: 3 (avg -33.4%)
  - New products (no history): 7

### ⚠️ PROINCO.pdf
- **Status**: Blocked - Image-based content
- **Issue**: PDF contains product table as embedded JPEG images, not extractable text
- **Solution**: Requires OCR (Tesseract/EasyOCR) or alternative data format
- **Workaround**: User can provide PROINCO data as:
  - CSV file
  - Excel sheet
  - JSON array
  - Another PDF with text-extractable content

## Files

### Parsers
- `parser_electrostock_proinco.py` - Main parser for ELECTROSTOCK (working), attempts PROINCO
- `parser_proinco_mejorado.py` - Improved regex-based PROINCO parser (returns 0 due to image content)
- `parser_proinco_tablas.py` - pdfplumber-based parser (has pyo3 dependency issues)
- `comparar_con_supabase.py` - Price comparison engine
- `extraer_pdf_manual.py` - Manual structural analysis tool

### Output Files
```
costes_general/Pdf_proveedor/analisis/
├── ELECTROSTOCK_productos.json      ✅ 12 products
├── PROINCO_productos_mejorado.json  ⚠️  Empty (0 products)
├── reporte_comparacion.json          ✅ Comparison results
└── resumen.json                      ✅ Summary stats
```

## Next Steps

### For ELECTROSTOCK
1. ✅ Parser working - extracts 12 products
2. ✅ Comparison working - shows price changes
3. TODO: Integrate into web dashboard for real-time price tracking
4. TODO: Add alerts for significant price changes (>10%)

### For PROINCO
**Option A**: Provide text-extractable PDF
- Request corrected PDF from supplier
- Run parser with updated file

**Option B**: Provide alternate format
- CSV: ref, descripcion, cantidad, precio, dto
- Excel: Same columns
- JSON: Array of objects with product data

**Option C**: Manual OCR setup (Advanced)
- Install Tesseract-OCR and pytesseract
- Run: `python3 scripts/parser_proinco_ocr.py` (TODO: create)
- Process images and extract text

## Commands

```bash
# Extract ELECTROSTOCK prices
python3 scripts/parser_electrostock_proinco.py

# Compare with historical data
python3 scripts/comparar_con_supabase.py

# Analyze PDF structure
python3 scripts/extraer_pdf_manual.py

# Check results
cat costes_general/Pdf_proveedor/analisis/reporte_comparacion.json
```

## Technical Notes

### PyPDF2 Limitations
- Cannot extract embedded images/graphics
- Works only with text-based PDFs
- Fast and lightweight

### Alternatives
1. **pdfplumber**: More advanced but has cryptography dependency issues
2. **pdfminer**: Pure Python, but similar limitations
3. **Tesseract OCR**: Best for scanned/image-based PDFs (requires system library)
4. **Textract**: Cloud-based, costs money

### Data Format for Comparison
Supabase table structure (simulated in script):
```json
{
  "ref": "403588",
  "descripcion": "*MAGNET TX3 6KA C P+N 25A",
  "precio_anterior": 0.20,
  "fecha": "2026-02-28",
  "proveedor": "ELECTROSTOCK"
}
```

## Troubleshooting

**Problem**: "PROINCO.pdf parece ser documento de términos"
- **Cause**: PDF contains product table as images
- **Solution**: See "Next Steps > For PROINCO" above

**Problem**: "pyo3_runtime.PanicException" with pdfplumber
- **Cause**: Cryptography module incompatibility
- **Solution**: Use PyPDF2 parser instead (parser_electrostock_proinco.py)

**Problem**: Prices not extracting correctly
- **Cause**: PDF uses unusual formatting/encoding
- **Solution**: Check regex patterns in line 54-61 of parser_electrostock_proinco.py

## Future Enhancements
- [ ] Real-time price tracking dashboard
- [ ] Automated supplier email parsing
- [ ] Machine learning price anomaly detection
- [ ] Multi-supplier price comparison analytics
- [ ] Automated purchase order suggestions

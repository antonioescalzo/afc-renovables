/**
 * MÓDULO DE MATCHING INTELIGENTE DE PRODUCTOS
 * Agrupa productos similares de diferentes proveedores
 * Extrae características clave (amperios, polos, tipo, etc.)
 */

// ============================================================================
// 1. NORMALIZACIÓN DE DESCRIPCIONES
// ============================================================================

export function normalizarDescripcion(desc) {
  if (!desc || typeof desc !== 'string') return '';

  return desc
    .toUpperCase()
    .trim()
    // Eliminar caracteres especiales manteniendo estructura
    .replace(/[´`´]/g, "'")
    .replace(/\s+/g, ' ')
    // Expandir abreviaturas comunes
    .replace(/MAGNETOT\./gi, 'MAGNETOTERMICO')
    .replace(/MAGNET\./gi, 'MAGNETOTERMICO')
    .replace(/\bDIF\b/gi, 'DIFERENCIAL')
    .replace(/\bDFX\b/gi, 'DIFERENCIAL')
    .replace(/\bP\+N/gi, 'POLOS+NEUTRO')
    .replace(/CURVA\s+/gi, 'C')
    .replace(/KA\b/gi, 'KA')
    .trim();
}

// ============================================================================
// 2. EXTRACCIÓN DE CARACTERÍSTICAS
// ============================================================================

export function extraerCaracteristicas(desc) {
  const norm = normalizarDescripcion(desc);

  const caracteristicas = {
    tipo: null,
    amperios: [],
    polos: null,
    capacidadCorte: null,
    curva: null,
    descNormalizada: norm,
    original: desc
  };

  // Detectar tipo de producto
  if (/MAGNETOTERMICO|MAGNET\.|^MAGNET\s|DISYUNTOR|INTERRUPTOR\s+AUTO/i.test(norm)) {
    caracteristicas.tipo = 'MAGNETOTERMICO';
  } else if (/DIFERENCIAL|RCD|DDR|DEVICE\s+RESIDUAL/i.test(norm)) {
    caracteristicas.tipo = 'DIFERENCIAL';
  } else if (/CABLE|CONDUCTOR|HILO|CABLEADO/i.test(norm)) {
    caracteristicas.tipo = 'CABLE';
  } else if (/CONECTOR|CLEMA|TERMINAL|BORNES/i.test(norm)) {
    caracteristicas.tipo = 'CONECTOR';
  } else if (/CAJA|CUADRO|ARMARIO|ENCLOSURE/i.test(norm)) {
    caracteristicas.tipo = 'CAJA';
  } else if (/PROTECTOR|PROTECCION|SURGE|SOBRETENSION/i.test(norm)) {
    caracteristicas.tipo = 'PROTECTOR';
  } else if (/FUSIBLE|CARTUCHO/i.test(norm)) {
    caracteristicas.tipo = 'FUSIBLE';
  } else if (/SOPORTE|ABRAZADERA|SUJETADOR/i.test(norm)) {
    caracteristicas.tipo = 'SOPORTE';
  }

  // Extraer amperios: 6A, 10A, 16A, 20A, 25A, 32A, 40A, 50A, 63A, 80A, 100A
  const ampRegex = /(\d+)\s*A(?:MP|MPERIOS)?(?:\s|$|[^\d])/gi;
  let match;
  while ((match = ampRegex.exec(norm)) !== null) {
    const amp = parseInt(match[1]);
    if (amp >= 1 && amp <= 200) { // Rango válido
      if (!caracteristicas.amperios.includes(amp)) {
        caracteristicas.amperios.push(amp);
      }
    }
  }
  caracteristicas.amperios = caracteristicas.amperios.sort((a, b) => a - b);

  // Extraer polos: 1P, 2P, 3P, 4P, 1P+N, 3P+N
  const polesMatch = norm.match(/(\d)P(?:\+N)?/i);
  if (polesMatch) {
    caracteristicas.polos = parseInt(polesMatch[1]);
    // Detectar si es +N
    if (/\+N|\+NEUTRO/i.test(norm)) {
      caracteristicas.polos = `${caracteristicas.polos}P+N`;
    } else {
      caracteristicas.polos = `${caracteristicas.polos}P`;
    }
  }

  // Extraer capacidad de corte: 6KA, 10KA, 16KA, 20KA, 25KA
  const kaMatch = norm.match(/(\d+)\s*KA/i);
  if (kaMatch) {
    caracteristicas.capacidadCorte = parseInt(kaMatch[1]);
  }

  // Extraer curva: C, D, B, K
  const curvaMatch = norm.match(/CURVA\s*([BCDKZ])|^([BCDKZ])\s(?:6|10|16|20)KA/i);
  if (curvaMatch) {
    caracteristicas.curva = (curvaMatch[1] || curvaMatch[2]).toUpperCase();
  }

  return caracteristicas;
}

// ============================================================================
// 3. SIMILITUD LEVENSHTEIN
// ============================================================================

function levenshteinDistance(a, b) {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  const matrix = Array(b.length + 1)
    .fill(null)
    .map(() => Array(a.length + 1).fill(0));

  for (let i = 0; i <= a.length; i++) matrix[0][i] = i;
  for (let j = 0; j <= b.length; j++) matrix[j][0] = j;

  for (let j = 1; j <= b.length; j++) {
    for (let i = 1; i <= a.length; i++) {
      const indicator = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1,
        matrix[j - 1][i] + 1,
        matrix[j - 1][i - 1] + indicator
      );
    }
  }

  return matrix[b.length][a.length];
}

export function calcularSimilitud(desc1, desc2, umbralMinimo = 0.75) {
  const norm1 = normalizarDescripcion(desc1);
  const norm2 = normalizarDescripcion(desc2);

  if (norm1 === norm2) return 1.0;

  const maxLen = Math.max(norm1.length, norm2.length);
  const distance = levenshteinDistance(norm1, norm2);
  const similitud = 1 - distance / maxLen;

  return similitud >= umbralMinimo ? similitud : 0;
}

// ============================================================================
// 4. COMPARACIÓN DE CARACTERÍSTICAS
// ============================================================================

function compararCaracteristicas(car1, car2) {
  let puntuacion = 1.0;
  let factores = 0;

  // Tipo debe coincidir si ambos están definidos
  if (car1.tipo && car2.tipo) {
    if (car1.tipo === car2.tipo) {
      puntuacion *= 1.0;
    } else {
      return 0; // No match si tipo diferente
    }
    factores++;
  }

  // Amperios: si hay coincidencia, mejor
  if (car1.amperios.length > 0 && car2.amperios.length > 0) {
    const ampIntersection = car1.amperios.filter(a => car2.amperios.includes(a));
    if (ampIntersection.length > 0) {
      puntuacion *= 1.0;
    } else {
      puntuacion *= 0.5; // Penalizar si no coinciden amperios
    }
    factores++;
  }

  // Polos: si hay, deben coincidir
  if (car1.polos && car2.polos) {
    if (car1.polos === car2.polos) {
      puntuacion *= 1.0;
    } else {
      puntuacion *= 0.3; // Penalizar fuerte si no coinciden
    }
    factores++;
  }

  // Capacidad de corte
  if (car1.capacidadCorte && car2.capacidadCorte) {
    if (car1.capacidadCorte === car2.capacidadCorte) {
      puntuacion *= 1.0;
    } else {
      puntuacion *= 0.6;
    }
    factores++;
  }

  return factores > 0 ? puntuacion : 1.0;
}

// ============================================================================
// 5. AGRUPACIÓN DE PRODUCTOS SIMILARES
// ============================================================================

export function agruparProductosSimilares(productos, umbralSimilitud = 0.80) {
  if (!productos || productos.length === 0) return [];

  const grupos = [];
  const usados = new Set();

  for (let i = 0; i < productos.length; i++) {
    if (usados.has(i)) continue;

    const grupo = {
      id: `grupo_${Date.now()}_${Math.random()}`,
      productos: [productos[i]],
      caracteristicas: extraerCaracteristicas(productos[i].desc),
      similitudes: [],
      similitudPromedio: 1.0,
      indiceOriginal: i
    };

    // Buscar productos similares
    for (let j = i + 1; j < productos.length; j++) {
      if (usados.has(j)) continue;

      const car1 = grupo.caracteristicas;
      const car2 = extraerCaracteristicas(productos[j].desc);

      // Comparación de características
      const scoreCaracteristicas = compararCaracteristicas(car1, car2);

      // Similitud Levenshtein
      const scoreLev = calcularSimilitud(
        productos[i].desc,
        productos[j].desc,
        0
      );

      // Puntuación combinada: 60% características + 40% Levenshtein
      const scoreTotal = scoreCaracteristicas * 0.6 + scoreLev * 0.4;

      if (scoreTotal >= umbralSimilitud) {
        grupo.productos.push(productos[j]);
        grupo.similitudes.push(scoreTotal);
        usados.add(j);
      }
    }

    grupo.similitudPromedio =
      grupo.similitudes.length > 0
        ? grupo.similitudes.reduce((a, b) => a + b, 0) / grupo.similitudes.length
        : 1.0;

    grupos.push(grupo);
    usados.add(i);
  }

  return grupos;
}

// ============================================================================
// 6. ANÁLISIS DE DIFERENCIAS DE PRECIOS
// ============================================================================

export function calcularDiferenciasPrecios(grupo) {
  if (!grupo.productos || grupo.productos.length === 0) {
    return {
      precioMinimo: 0,
      precioMaximo: 0,
      diferencia: 0,
      diferenciaPorc: 0,
      proveedorMasBarato: null,
      proveedorMasCaro: null,
      detallePrecios: []
    };
  }

  const detallePrecios = grupo.productos
    .map(p => ({
      proveedor: p.proveedor,
      precio: p.precio,
      ref: p.ref,
      desc: p.desc
    }))
    .sort((a, b) => a.precio - b.precio);

  const precioMinimo = detallePrecios[0].precio;
  const precioMaximo = detallePrecios[detallePrecios.length - 1].precio;
  const diferencia = precioMaximo - precioMinimo;
  const diferenciaPorc = precioMinimo > 0 ? (diferencia / precioMinimo) * 100 : 0;

  return {
    precioMinimo,
    precioMaximo,
    diferencia,
    diferenciaPorc,
    proveedorMasBarato: detallePrecios[0].proveedor,
    proveedorMasCaro: detallePrecios[detallePrecios.length - 1].proveedor,
    detallePrecios,
    ahorroPotencial: diferencia
  };
}

// ============================================================================
// 7. BÚSQUEDA INTELIGENTE POR CARACTERÍSTICAS
// ============================================================================

export function buscarPorCaracteristicas(productos, criterios) {
  /**
   * criterios = {
   *   tipo: 'MAGNETOTERMICO',
   *   amperios: [25, 32],  // O un solo número
   *   polos: '4P' o 4,
   *   texto: 'búsqueda libre',
   *   minSimilitud: 0.7
   * }
   */

  return productos.filter(prod => {
    const car = extraerCaracteristicas(prod.desc);

    // Filtro por tipo
    if (criterios.tipo && car.tipo !== criterios.tipo) {
      return false;
    }

    // Filtro por amperios
    if (criterios.amperios) {
      const ampsRequeridos = Array.isArray(criterios.amperios)
        ? criterios.amperios
        : [criterios.amperios];
      const tieneAmp = ampsRequeridos.some(a => car.amperios.includes(a));
      if (!tieneAmp) return false;
    }

    // Filtro por polos
    if (criterios.polos) {
      const polosRequeridos = typeof criterios.polos === 'number'
        ? `${criterios.polos}P`
        : criterios.polos;
      if (car.polos && !car.polos.startsWith(polosRequeridos)) {
        return false;
      }
    }

    // Búsqueda de texto libre
    if (criterios.texto) {
      const scoreSimilitud = calcularSimilitud(
        criterios.texto,
        prod.desc,
        0
      );
      const minSimilitud = criterios.minSimilitud || 0.6;
      if (scoreSimilitud < minSimilitud) return false;
    }

    return true;
  });
}

// ============================================================================
// 8. TOP 10 CON MAYOR DIFERENCIA DE PRECIOS
// ============================================================================

export function obtenerTop10Diferencias(productos, limite = 10) {
  const grupos = agruparProductosSimilares(productos, 0.75);

  // Filtrar grupos con múltiples proveedores
  const gruposConMultiplos = grupos
    .filter(g => g.productos.length >= 2)
    .map(g => ({
      ...g,
      analisis: calcularDiferenciasPrecios(g)
    }))
    .filter(g => g.analisis.diferencia > 0)
    .sort((a, b) => b.analisis.diferenciaPorc - a.analisis.diferenciaPorc)
    .slice(0, limite);

  return gruposConMultiplos;
}

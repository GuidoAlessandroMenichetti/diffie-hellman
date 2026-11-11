// esperar n ms
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// calculo de potencias
function pow(base, exp) {
  let result = BigInt(1);
  for (let i = 0; i < exp; i++) {
    result *= base;
  }
  return result;
}

function fastPow(base, exponente, modulo) {
  let resultado = 1n;
  base = BigInt(base) % BigInt(modulo);
  exponente = BigInt(exponente);
  modulo = BigInt(modulo);

  while (exponente > 0n) {
    if (exponente & 1n) {
      resultado = (resultado * base) % modulo;
    }
    base = (base * base) % modulo;
    exponente >>= 1n;
  }

  return resultado;
}

function esPrimo(n) {
  if (n <= 1) return false;
  for (let i = 2, sqrt = Math.sqrt(n); i <= sqrt; i++) {
    if (n % i === 0) return false;
  }
  return true;
}

// Función auxiliar para factorizar p - 1
function obtenerFactoresPrimos(num) {
  const factores = new Set();
  let d = 2;
  while (d * d <= num) {
    while (num % d === 0) {
      factores.add(d);
      num /= d;
    }
    d++;
  }
  if (num > 1) {
    factores.add(num);
  }
  return Array.from(factores);
}

// Encuentra el primer número primo a partir de 'inicio' y una raíz primitiva suya
function findPrimeAndRoot(inicio = 2) {
  let p = inicio;
  while (!esPrimo(p)) {
    p++;
  }

  const phi = p - 1;
  const factores = obtenerFactoresPrimos(phi);
  let raizPrimitiva = null;

  // Probar candidatos 'g' desde 2 hasta p - 1
  for (let g = 2; g < p; g++) {
    let esRaiz = true;
    for (const factor of factores) {
      if (fastPow(g, phi / factor, p) === 1) {
        esRaiz = false;
        break;
      }
    }
    if (esRaiz && g > 10) {
      raizPrimitiva = g;
      break;
    }
  }

  return {
    p: BigInt(p),
    g: BigInt(raizPrimitiva)
  };
}
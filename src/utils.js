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
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
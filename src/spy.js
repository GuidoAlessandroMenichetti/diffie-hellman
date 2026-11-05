class Spy {
  communication = null;
  container = null;
  console = null;

  p = null;
  g = null;
  A = null;
  B = null;
  message = null;

  constructor(communication) {
    this.communication = communication;
    this.container = document.getElementById('spy');
    this.console = this.container.querySelector('textarea');
    this.console.value = '';
  }

  setupLocalKeys(p, g) {
    this.p = p;
    this.g = g;
    this.renderMessage(`p=${this.p}, g=${this.g}\n`);
  }

  async receiveMessage(message) {
    this.message = message;
    this.console.value = '';
    this.renderMessage(`p=${this.p}, g=${this.g}\nA=${this.A}, B=${this.B}\na=???, b=???\nK=???\nMensaje recibido: ${message}\nMensaje descifrado: ?????\n`);
  }

  receivePublicKey(A, B) {
    this.A = A;
    this.B = B;
    this.renderMessage(`Clave leida A=${A}\nClave leida B=${B}\n`)
  }

  renderMessage(message) {
    this.console.value += message;
  }
}
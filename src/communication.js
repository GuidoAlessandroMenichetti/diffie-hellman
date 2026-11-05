class Communication {
  participants = null;
  spy = null;

  // elementos del frontend
  container = null;
  ongoingMessages = null;

  constructor() {
    // ubicar elementos en el front
    this.container = document.getElementById('main');
    this.ongoingMessages = this.container.querySelector('.chat.middle');
  }

  async start(p, g) {
    // mostrar interfaz
    this.container.classList.add('active');

    // informar los valores de p y g seleccionados a los participantes para que generen sus claves
    const msg = `p=${p}, g=${g}`
    await this.renderOngoingMessage(this.participants[0], msg);
    this.participants.forEach(participant => participant.setupLocalKeys(p, g));

    this.spy.setupLocalKeys(p, g);
    const pk = [this.participants[0].publicKey, this.participants[1].publicKey]
    await Promise.all([
      this.renderOngoingMessage(this.participants[0], `B=${pk[0]}`),
      this.renderOngoingMessage(this.participants[1], `A=${pk[1]}`),
    ])

    // intercambio de claves publicas entre participantes para que generen la clave privada
    this.participants[0].receivePublicKey(pk[1]);
    this.participants[1].receivePublicKey(pk[0]);
    this.spy.receivePublicKey(pk[0], pk[1]);
  }

  async sendMessage(participant, message, fileName) {
    try {
      // animacion de mensaje enviado
      await this.renderOngoingMessage(participant, String(message.data), fileName);

      // enviar el mensaje al otro participante
      const recipient = participant === this.participants[0] ? this.participants[1] : this.participants[0];
      await recipient.receiveMessage(message, fileName);
      await this.spy.receiveMessage(message.data);
    } catch(e) {
      console.error(e)
    }
  }

  async renderOngoingMessage(participant, message) {
    // animacion de mensaje enviado por el canal
    const ongoingMessage = document.createElement('div');
    const finalMessage = message.length > 30 ? `${message.substring(0, 30)}...` : message;
    ongoingMessage.innerHTML = finalMessage;
    ongoingMessage.classList.add('ongoing-message', participant.name);
    this.ongoingMessages.appendChild(ongoingMessage);

    await sleep(4000);
    ongoingMessage.remove();
  }
}
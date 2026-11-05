class Participant {
  communication = null;

  // elementos del frontend
  container = null;
  messages = null;
  textInput = null;
  textSendButton = null;
  fileInput = null;
  console = null;

  // configuracion crypto
  p = null;
  g = null;
  secretNumber = null;
  publicKey = null;
  privateKey = null;
  aesKey = null;

  constructor(name, communication) {
    this.communication = communication;
    this.name = name;

    // ubicar elementos del frontend
    this.container = document.getElementById(this.name);
    this.messages = this.container.querySelector('.messages');
    this.textInput = this.container.querySelector('.message-input');
    this.fileInput = this.container.querySelector('.send-file');
    this.console = this.container.querySelector('.console');
    this.textSendButton = this.container.querySelector('.send-btn');

    this.startInterface();
  }

  startInterface() {
    // limpiar inputs
    this.console.value = '';
    this.textInput.value = '';

    this.startEventListeners();
  }

  startEventListeners() {
    // click en el botón enviar
    this.textSendButton.addEventListener('click', () => {
      this.sendMessage(this.textInput.value)
      this.textInput.value = '';
    });

    // enter en el input de texto
    this.textInput.addEventListener('keyup', (e) => {
      if (e.key === 'Enter') {
        this.sendMessage(this.textInput.value);
        this.textInput.value = '';
      }
    });

    // carga de archivo
    this.fileInput.addEventListener('change', (e) => {
      this.sendFile(e.target.files[0]);
    });
  }

  setupLocalKeys(p, g) {
    // guardo número primo
    this.p = p;

    // guardo raíz primitiva
    this.g = g;

    // seteo número secreto aleatorio (a)
    this.secretNumber = parseInt(Math.random() * 999);

    // genero clave publica (A = g^a mod p)
    this.publicKey = BigInt(pow(g, this.secretNumber) % p);

    // muestro en consola los valores
    const identifier = this.getIdentifier();
    this.console.value += `Parámetros: p=${p}, g=${g}\n`;
    this.console.value += `Número secreto (${identifier}) = ${this.secretNumber}\n`;
    this.console.value += `Clave pública (${identifier.toUpperCase()} = g^${identifier} mod p) = ${this.publicKey}\n`;
  }

  async receivePublicKey(key) {
    // calculo la clave privada con la clave publica del otro participante y mi número secreto
    this.privateKey = BigInt(pow(key, this.secretNumber) % this.p);
    this.aesKey = await Cryptography.createAesKey(this.privateKey);

    this.console.value += `Recibida la clave pública del otro participante: ${key}\n`;
    this.console.value += `Calculo clave privada (K = ${this.getOtherIdentifier().toUpperCase()}^${this.getIdentifier()} mod p): ${this.privateKey}\n`;
    this.console.value += `Clave AES creada ${await this.printAesKey()}\n`;
  }

  sendFile(file) {
    // abrir archivo seleccionado
    const reader = new FileReader();
    reader.readAsText(file, 'UTF-8');

    // enviar mensaje
    reader.onload = ({ target }) => {
      this.sendMessage(target.result, file.name)
    }
  }

  async sendMessage(message, fileName) {
    // no enviar mensajes vacios
    if (message === '') {
      return;
    }

    // encriptar mensaje con la clave pública
    const encryptedMessage = await Cryptography.encrypt(this.aesKey, message);

    // loggear en consola del participante
    this.console.value = '';
    this.console.value += `Mensaje a enviar: ${fileName || message}\n`;
    this.console.value += `Encriptado con la clave AES ${await this.printAesKey()}.\n`
    this.console.value += `Mensaje final: ${encryptedMessage.data}\n`;

    // enviar mensaje
    this.communication.sendMessage(this, encryptedMessage, fileName);

    // agregar mensaje local al chat
    this.renderMessage(message, 'sent', fileName);
  }

  async receiveMessage(payload, fileName) {
    const message = await Cryptography.decrypt(this.aesKey, payload);

    this.console.value = '';
    this.console.value += `Mensaje recibido: ${fileName || payload.data}\n`;
    this.console.value += `Desencriptado con la clave AES ${await this.printAesKey()}.\n`
    this.console.value += `Mensaje final: ${message}\n`;

    // agregar mensaje al chat
    this.renderMessage(message, 'received', fileName);
  }

  renderMessage(message, mode, fileName) {
    // crea elemento del mensaje para el chat local
    const newMessage = document.createElement('div');
    newMessage.innerHTML = fileName ? `Archivo ${fileName}` : message;
    newMessage.classList.add('message');

    // agrega el elemento de mensaje a la lista
    const messageWrapper = document.createElement('div');
    messageWrapper.appendChild(newMessage);
    messageWrapper.classList.add('wrapper', mode);
    messageWrapper.scrollTop = messageWrapper.scrollHeight;
    this.messages.appendChild(messageWrapper);
  }

  getIdentifier() {
    // identificador de variables para mostrar en consola
    return this.name === 'alice' ? 'a' : 'b';
  }

  getOtherIdentifier() {
    // identificador de variables para mostrar en consola
    return this.name === 'alice' ? 'b' : 'a';
  }

  async printAesKey() {
    // devuelve el hash de la clave aes como string
    const hash = await Cryptography.createAesHash(this.privateKey);
    return Array.from(new Uint8Array(hash))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }
}
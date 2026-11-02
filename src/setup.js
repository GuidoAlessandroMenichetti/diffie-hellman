class Setup {
  communication = null;

  // opciones de numeros primos y raices ya definidas
  options = [{
    p: 71,
    g: 7
  }];

  // elementos del frontend
  container = null;
  dropdown = null;
  startButton = null;

  constructor(communication) {
    this.communication = communication;

    // ubicar elementos del frontend
    this.container = document.getElementById('setup');
    this.dropdown = this.container.querySelector('select');
    this.startButton = this.container.querySelector('input');

    this.startEventListeners();
  }

  startEventListeners() {
    this.startButton.addEventListener('click', () => {
      // esconder cartel de configuración
      this.container.classList.add('hidden');

      // leer los parámetros p y g seleccionados
      const selectedParams = this.options[parseInt(this.dropdown.value)];

      // empezar la comunicación
      this.communication.start(selectedParams.p, selectedParams.g);
    });
  }
}
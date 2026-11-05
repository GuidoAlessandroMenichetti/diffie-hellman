class Setup {
  communication = null;

  // opciones de numeros primos y raices ya definidas
  options = [
  { p: 71n, g: 7n },
  { p: 1061n, g: 2n },
  { p: 10079n, g: 11n },
  { p: 50000161n, g: 11n },
  { p: 10000000069n, g: 6n },
  { p: 100000000000183n, g: 5n }
];

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

    this.options.forEach((option, i) => {
      const element = document.createElement('option');
      element.value = i;
      element.innerHTML = `p=${option.p}, g=${option.g}`;
      this.dropdown.appendChild(element);
    });
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
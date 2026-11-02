function start() {
  const main = new Communication();
  const participants = [
    new Participant('bob', main),
    new Participant('alice', main)
  ];

  const setup = new Setup(main);
  main.participants = participants;
}
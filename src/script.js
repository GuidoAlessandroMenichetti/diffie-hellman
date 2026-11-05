function start() {
  const main = new Communication();
  const participants = [
    new Participant('bob', main),
    new Participant('alice', main)
  ];

  new Setup(main);
  main.participants = participants;
  main.spy = new Spy(main);
}
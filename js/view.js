export default class View {
  $ = {};
  $$ = {};

  constructor() {
    this.$.menu = this.#qs('[data-id="menu"]');
    this.$.menuBtn = this.#qs('[data-id="menu-btn"]');
    this.$.menuHidden = this.#qs('[data-id="pop-out-menu"]');
    this.$.resetBtn = this.#qs('[data-id="reset-game"]');
    this.$.newRound = this.#qs('[data-id="new-round"]');
    this.$.playerTurn = this.#qs('[data-id="playerTurn"]');
    this.$.iconTurn = this.#qs('[data-id="iconTurn"]');
    this.$.turnIndicator = this.#qs('[data-id="turn-indicator"]');
    this.$.modal = this.#qs('[data-id="modal"]');
    this.$.modalBtn = this.#qs('[data-id="modal-btn"]');
    this.$.winner = this.#qs('[data-id="winner"]');
    this.$.player1 = this.#qs('[data-id="player-1"]');
    this.$.player2 = this.#qs('[data-id="player-2"]');
    this.$.p1Wins = this.#qs('[data-id="p1-wins"]');
    this.$.p2Wins = this.#qs('[data-id="p2-wins"]');
    this.$.ties = this.#qs('[data-id="ties"]');
    this.$.grid = this.#qs('[data-id="grid"]');
    this.$.characterSelectionScreen = this.#qs(
      '[data-id="character-selection-screen"]'
    );
    this.$.p1Select = this.#qs('[data-id="p1-selection"]');
    this.$.p1CharMenu = this.#qs('[data-id="p1-character-menu"]');
    this.$.p2Select = this.#qs('[data-id="p2-selection"]');
    this.$.p2CharMenu = this.#qs('[data-id="p2-character-menu"]');
    this.$.startButton = this.#qs('[data-id="start-button"]');
    this.$.startButton = this.#qs('[data-id="start-button"]');
    this.$.p1SelectedCharacter = this.#qs('[data-id="p1-current-character"]');
    this.$.p2SelectedCharacter = this.#qs('[data-id="p2-current-character"]');

    this.$$.squares = document.querySelectorAll('[data-id="squares"]');
    this.$$.p1ListItem = document.querySelectorAll('[data-id="p1-list-item"]');
    this.$$.p2ListItem = document.querySelectorAll('[data-id="p2-list-item"]');

    this.$.menuBtn.addEventListener("click", (event) => {
      this.#toggleActionMenu();
    });

    this.$.p1Select.addEventListener("click", (event) => {
      this.$.p1CharMenu.classList.toggle("hidden");
      this.$.p1Select.classList.toggle("character-selection-outline");
    });

    this.$.p2Select.addEventListener("click", (event) => {
      this.$.p2CharMenu.classList.toggle("hidden");
      this.$.p2Select.classList.toggle("character-selection-outline");
    });
  }

  render(game, stats) {
    const { playerWithStats, ties } = stats;
    const {
      moves,
      currentPlayer,
      currentRoundGames,
      status: { isComplete, winner },
    } = game;

    if (moves.length < 1 && currentRoundGames.length < 1) {
      this.#openSelectionScreen();
    }

    this.#closeAll();
    this.#resetCurrentGameboard();
    this.#updateScoreboard(
      playerWithStats[0].wins,
      playerWithStats[1].wins,
      ties
    );
    this.#initializeMoves(moves);

    if (isComplete) {
      this.#openModal(winner ? `${winner.name} wins!` : "Tie game!");
      return;
    }

    this.#setTurnIndicator(currentPlayer);
  }

  resetGameEvent(handler) {
    this.$.resetBtn.addEventListener("click", handler);
    this.$.modalBtn.addEventListener("click", handler);
  }

  newRoundEvent(handler) {
    this.$.newRound.addEventListener("click", handler);
  }

  registerPlayerMoveEvent(handler) {
    this.#delegate(this.$.grid, '[data-id="squares"]', "click", handler);
  }

  #closeAll() {
    this.#closeActionMenu();
    this.#closeModal();
  }

  #resetCurrentGameboard() {
    this.$$.squares.forEach((square) => {
      square.replaceChildren();
    });
  }

  #updateScoreboard(p1wins, p2wins, ties) {
    this.$.p1Wins.innerText = `${p1wins} Wins`;
    this.$.p2Wins.innerText = `${p2wins} Wins`;
    this.$.ties.innerText = `${ties}`;
  }

  #initializeMoves(moves) {
    this.$$.squares.forEach((square) => {
      const existingMove = moves.find((move) => move.squareId === +square.id);

      if (existingMove) {
        this.#placeIconInSquare(square, existingMove.player);
      }
    });
  }

  #placeIconInSquare(square, player) {
    const img = document.createElement("img");
    img.src = player.iconClass;
    square.replaceChildren(img);
  }

  #setTurnIndicator(player) {
    const img = document.createElement("img");
    const label = document.createElement("p");

    img.src = player.iconClass;

    label.classList.add(player.colorClass);
    label.innerText = `${player.name}, you're up!`;

    this.$.turnIndicator.replaceChildren(img, label);
  }

  updatePlayerCharacter(character, item) {
    const img = document.createElement("img");
    const name = document.createElement("p");

    name.innerText = character.name;
    img.src = character.iconClass;

    if (item.dataset.id === "p1-list-item") {
      this.$.p1SelectedCharacter.replaceChildren(img, name);
    } else {
      this.$.p2SelectedCharacter.replaceChildren(name, img);
    }
  }

  updateStatsName(players) {
    this.$.player1.innerText = players[0].name;
    this.$.player2.innerText = players[1].name;
  }

  #toggleActionMenu() {
    this.$.menuHidden.classList.toggle("hidden");
    this.$.menuBtn.classList.toggle("outline");

    const icon = this.$.menuBtn.querySelector("i");
    icon.classList.toggle("fa-chevron-down");
    icon.classList.toggle("fa-chevron-up");
  }

  closeSelectionScreen() {
    this.$.characterSelectionScreen.classList.add("hidden");
  }

  #openSelectionScreen() {
    this.$.characterSelectionScreen.classList.remove("hidden");
  }

  #closeActionMenu() {
    this.$.menuHidden.classList.add("hidden");
    this.$.menuBtn.classList.remove("border");

    const icon = this.$.menuBtn.querySelector("i");
    icon.classList.add("fa-chevron-down");
    icon.classList.remove("fa-chevron-up");
  }

  #closeModal() {
    this.$.modal.classList.add("hidden");
  }

  #openModal(message) {
    this.$.modal.classList.remove("hidden");
    this.$.winner.innerText = `${message}`;
  }

  #qs(selector, parent) {
    const el = parent
      ? parent.querySelector(selector)
      : document.querySelector(selector);

    if (!el) throw new Error("Could not find elements");

    return el;
  }

  /*
  el: The parent element that you're adding the event listener to.
  selector: A CSS selector that specifies the child element(s) you're interested in. Only the elements matching this selector will trigger the event handler.
  eventKey: The event type (such as click, mouseover, etc.) that will trigger the event listener.
  handler: A callback function that will be executed when the event happens on a child element matching the selector.
  */

  #delegate(el, selector, eventKey, handler) {
    el.addEventListener(eventKey, (event) => {
      if (event.target.matches(selector)) {
        handler(event.target);
      }
    });
  }
}

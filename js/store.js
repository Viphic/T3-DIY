const initialValue = {
  currentGameMoves: [],
  currentRoundGames: [],
  allGames: [],
};

export default class Store extends EventTarget {
  constructor(key, players) {
    super();
    this.storageKey = key;
    this.players = this.getPlayersFromStorage(players);
  }

  get stats() {
    const state = this.#getState();
    const gameHistory = state.currentRoundGames;

    return {
      playerWithStats: this.players.map((player) => {
        const wins = gameHistory.filter(
          (game) => game.status.winner && game.status.winner.id === player.id
        ).length;

        return {
          ...player,
          wins,
        };
      }),

      ties: gameHistory.filter((game) => game.status.winner === null).length,
    };
  }

  get game() {
    const state = this.#getState();
    const savedPlayers = this.getPlayersFromStorage();
    const movesMade = state.currentGameMoves;
    const currentRoundGames = state.currentRoundGames;
    const currentPlayerIndex = movesMade.length % 2;

    const currentPlayer = savedPlayers[currentPlayerIndex];

    const winningPattern = [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
      [1, 4, 7],
      [2, 5, 8],
      [3, 6, 9],
      [1, 5, 9],
      [3, 5, 7],
    ];

    let winner = null;

    for (const player of this.players) {
      const playedSquaresId = movesMade
        .filter((move) => move.player.id === player.id)
        .map((move) => move.squareId);

      for (const pattern of winningPattern) {
        if (pattern.every((v) => playedSquaresId.includes(v))) {
          winner = player;
        }
      }
    }

    return {
      moves: movesMade,
      currentRoundGames,
      currentPlayer,
      savedPlayers,
      status: {
        isComplete: winner != null || movesMade.length === 9,
        winner,
      },
    };
  }

  registerMove(squareId) {
    const stateClone = structuredClone(this.#getState());

    stateClone.currentGameMoves.push({
      squareId,
      player: this.game.currentPlayer,
    });

    this.#saveState(stateClone);
  }

  reset() {
    const stateClone = structuredClone(this.#getState());
    const { status, moves } = this.game;

    if (status.isComplete) {
      stateClone.currentRoundGames.push({
        status,
        moves,
      });
    }

    stateClone.currentGameMoves = [];

    this.#saveState(stateClone);
  }

  newRound() {
    this.reset();

    const stateClone = structuredClone(this.#getState());

    stateClone.allGames.push(...stateClone.currentRoundGames);
    stateClone.currentRoundGames = [];

    this.#saveState(stateClone);
  }

  savePlayersToStorage(players) {
    localStorage.setItem("players", JSON.stringify(players));
  }

  getPlayersFromStorage(defaultPlayers) {
    const savedPlayers = JSON.parse(localStorage.getItem("players"));

    if (savedPlayers) {
      return savedPlayers;
    }

    localStorage.setItem("players", JSON.stringify(defaultPlayers));
    return defaultPlayers;
  }

  #getState() {
    const item = window.localStorage.getItem(this.storageKey);
    return item ? JSON.parse(item) : initialValue;
  }

  #saveState(stateOrFn) {
    const prevState = this.#getState();

    let newState;

    switch (typeof stateOrFn) {
      case "function":
        newState = stateOrFn(prevState);
        break;
      case "object":
        newState = stateOrFn;
        break;
      default:
        throw new Error("Invalid argument passed to saveState");
    }

    window.localStorage.setItem(this.storageKey, JSON.stringify(newState));
    this.dispatchEvent(new Event("statechange"));
  }
}

import View from "./view.js";
import Store from "./store.js";

const characters = [
  {
    name: "Neuro",
    iconClass:
      "https://pygmalion.chat/_next/image?url=https%3A%2F%2Fassets.pygmalion.chat%2F5c0e12c7-5e5a-4e12-b19e-ecb8b4a0f439&w=1080&q=75",
  },
  {
    name: "Evil",
    iconClass:
      "https://i1.sndcdn.com/artworks-MzzrGzNWw7qGVnlz-dzYyMQ-t500x500.jpg",
  },
  {
    name: "Vedal",
    iconClass:
      "https://vtubie.com/wp-content/uploads/2024/02/21a44021658e45f6bb9f4d7649474e48.png",
  },
  {
    name: "Anny",
    iconClass:
      "https://pbs.twimg.com/profile_images/1597548206443098112/vR4JnZF5_400x400.jpg",
  },
  {
    name: "Camila",
    iconClass:
      "https://i.pinimg.com/736x/16/a1/ca/16a1cad2db00d6fa920c6781c7139c5a.jpg",
  },
  {
    name: "Mini",
    iconClass: "https://pbs.twimg.com/media/GblbO5vXgAA_Lo9.png",
  },
  {
    name: "Layna",
    iconClass: "https://pbs.twimg.com/media/GU-HXTFa4AQIwW2.jpg",
  },
  {
    name: "Cerber",
    iconClass:
      "https://pbs.twimg.com/profile_images/1844401863057129475/8mllNcpW_400x400.jpg",
  },
  {
    name: "Ellie",
    iconClass:
      "https://yt3.googleusercontent.com/d0-YjhTo-NeGb5TK5KR0bzxOmJqvWHC4S_pTMc-hs7E5UvOV5zFTT6NEF3F-bnab5mVQOkkDig=s900-c-k-c0x00ffffff-no-rj",
  },
  {
    name: "Koko",
    iconClass: "https://media.tenor.com/lv4NWvlPZBkAAAAe/kokonuts-succ.png",
  },
  {
    name: "Toma",
    iconClass:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSDDRSMu36FD0xqqCmje2MY8qo9N_WbduFWgQ&s",
  },
];

//[character.name, character] = [key/name of object, value/object]
const characterMap = new Map(
  characters.map((character) => [character.name, character])
);

const players = [
  {
    id: 1,
    name: "Neuro",
    iconClass:
      "https://pygmalion.chat/_next/image?url=https%3A%2F%2Fassets.pygmalion.chat%2F5c0e12c7-5e5a-4e12-b19e-ecb8b4a0f439&w=1080&q=75",
    colorClass: "turquoise",
  },
  {
    id: 2,
    name: "Evil",
    iconClass:
      "https://i1.sndcdn.com/artworks-MzzrGzNWw7qGVnlz-dzYyMQ-t500x500.jpg",
    colorClass: "red",
  },
];

function init() {
  const view = new View();
  const store = new Store("live-t3-storage-key", players);

  view.render(store.game, store.stats);

  window.addEventListener("storage", () => {
    view.render(store.game, store.stats);
  });

  store.addEventListener("statechange", () => {
    view.render(store.game, store.stats);
  });

  view.resetGameEvent((event) => {
    store.reset();
  });

  view.newRoundEvent((event) => {
    store.newRound();
  });

  view.registerPlayerMoveEvent((square) => {
    const existingMove = store.game.moves.find(
      (move) => move.squareId === +square.id
    );

    if (existingMove) {
      return;
    }
    store.registerMove(+square.id);
  });

  view.$$.p1ListItem.forEach((item) => {
    item.addEventListener("click", (event) => {
      const character = characterMap.get(item.dataset.characterName);
      const isCharacterSelected = players.some(
        (player) => player.name === character.name
      );

      if (isCharacterSelected) {
        alert("Character is already selected");
        return;
      }

      players[0] = { ...players[0], ...character };

      view.updatePlayerCharacter(character, item);
    });
  });

  view.$$.p2ListItem.forEach((item) => {
    item.addEventListener("click", (event) => {
      const character = characterMap.get(item.dataset.characterName);
      const isCharacterSelected = players.some(
        (player) => player.name === character.name
      );

      if (isCharacterSelected) {
        alert("Character is already selected");
        return;
      }

      players[1] = { ...players[1], ...character };

      view.updatePlayerCharacter(character, item);
    });
  });

  view.$.startButton.addEventListener("click", (event) => {
    store.savePlayersToStorage(players);
    view.render(store.game, store.stats);
    view.closeCharacterMenu();
    view.closeCharacterSelectionScreen();
  });
}

window.addEventListener("load", init);

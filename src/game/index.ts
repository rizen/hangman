import {
  createGame,
  createGameClasses,
  Player,
  Game,
} from '@boardzilla/core';

export class HangmanPlayer extends Player<HangmanPlayer, MyGame> {
  /**
   * Any properties of your players that are specific to your game go here
   */
  score: number = 0; // as an example
};

export class MyGame extends Game<HangmanPlayer, MyGame> {
  /**
   * Any overall properties of your game go here
   */
  phase: number = 1; // as an example

  alphabet = Array.from(Array(26)).map((e, i) => i + 65).map((x) => String.fromCharCode(x));
  phrase = '';
  solution = '';
  makePattern = (letters: string[]) => {
    const pattern = new RegExp("([" + letters.join("|") + "])", "gm");
    return this.solution.replace(pattern, "_");
  }

}

const { Space, Piece } = createGameClasses<HangmanPlayer, MyGame>();

export { Space };

/**
 * Define your game's custom pieces and spaces.
 */

const puzzles = ["spin to win", "pay to play", "spend money to make money"];

export function pickPuzzle() {
  return puzzles[Math.floor(Math.random() * puzzles.length)].toUpperCase();
}

export class Letter extends Piece { // as an example
}



export class Token extends Piece { // as an example
  color: 'red' | 'blue';
}

export default createGame(HangmanPlayer, MyGame, game => {

  const { action } = game;
  const { playerActions, loop, eachPlayer } = game.flowCommands;

  game.solution = pickPuzzle();
  game.phrase = game.makePattern(game.alphabet);

  /**
   * Register all custom pieces and spaces
   */
  game.registerClasses(Token, Letter);



  const phrase = game.create(Space, 'Phrase');
  const availableLetters = game.create(Space, 'Available Letters');
  const usedLetters = game.create(Space, 'Used Letters');
  for (const letter of game.alphabet) {
    availableLetters.create(Letter, letter);
  }



  /**
   * Define all possible game actions, e.g.:
   */
  game.defineActions({
    chooseLetter: player => action({ prompt: 'Choose a letter' })
      .chooseOnBoard('letter', availableLetters.all(Letter))
      .move('letter', usedLetters)
      .do(() => {
        game.phrase = game.makePattern(usedLetters.all(Letter).map((letter) => letter.name.toString()))
        //console.log(usedLetters.all(Letter).map((letter) => letter.name.toString()))
      })
      .message(`{{player}} used letter {{letter}}.`)
  });

  /**
   * Define the game flow, starting with board setup and progressing through all
   * phases and turns, e.g.:
   */
  game.defineFlow(
    loop(
      eachPlayer({
        name: 'player',
        do: playerActions({
          actions: ['chooseLetter']
        }),
      })
    )
  );
});

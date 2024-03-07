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
  makePattern(letters: string[]) {
    const pattern = new RegExp("([" + letters.join("|") + "])", "gm");
    return this.solution.replace(pattern, "_");
  }

  #puzzles = ["spin to win", "pay to play", "spend money to make money"];
  pickPuzzle() {
    this.solution = this.#puzzles[Math.floor(this.random() * this.#puzzles.length)].toUpperCase();
    this.phrase = this.makePattern(this.alphabet);
  }

}

const { Space, Piece } = createGameClasses<HangmanPlayer, MyGame>();

export { Space };

/**
 * Define your game's custom pieces and spaces.
 */



export class Letter extends Piece { }



export class Token extends Piece { // as an example
  color: 'red' | 'blue';
}

export default createGame(HangmanPlayer, MyGame, game => {

  const { action } = game;
  const { playerActions, loop, eachPlayer } = game.flowCommands;

  game.pickPuzzle();

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
        game.phrase = game.makePattern(availableLetters.all(Letter).map((letter) => letter.name.toString()))
        if (game.phrase == game.solution)
          game.finish(player)
      })
      .message(`{{player}} used letter {{letter}}.`),
    solve: player => action({ prompt: 'Solve the puzzle' })
      .chooseFrom('yes', ['Solve the Puzzle'], { skipIf: 'never' })
      .enterText('guess', {
        // prompt: 'Solve the puzzle', 
        initial: ''
      })
      .do(({ guess }) => {
        if (guess.toLowerCase() == game.solution.toLowerCase())
          game.finish(player)
        else
          game.message(`${player} guessed ${guess} which was wrong`)
      }),
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
          actions: ['chooseLetter', 'solve'],
          skipIf: 'never'
        }),
      })
    )
  );
});

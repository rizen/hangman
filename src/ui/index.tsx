import React from 'react';
import { render } from '@boardzilla/core';
import { default as setup, Space, Letter, Gallows, Phrase } from '../game/index.js';

import './style.scss';
import '@boardzilla/core/index.css';
import hangman0 from './assets/hangman0.png';
import hangman1 from './assets/hangman1.png';
import hangman2 from './assets/hangman2.png';
import hangman3 from './assets/hangman3.png';
import hangman4 from './assets/hangman4.png';
import hangman5 from './assets/hangman5.png';
import hangman6 from './assets/hangman6.png';
const hangman = [hangman0, hangman1, hangman2, hangman3, hangman4, hangman5, hangman6];

render(setup, {
  boardSizes: (screenX, screenY, mobile) => {
    if (mobile) return {
      name: "mobile",
      aspectRatio: 1 / 2
    };
    return {
      name: "standard",
      aspectRatio: 5 / 3
    }
  },
  layout: game => {
    game.appearance({
      render: () => null
    });

    game.disableDefaultAppearance();


    game.all(Phrase).appearance({
      render: () => (
        <div>{game.phrase}</div>
      )
    })

    game.all(Gallows).appearance({
      aspectRatio: 1 / 2,
      render: () => (
        <img src={hangman[game.misses]} />
      )
    })

    game.layout(Space, {
      gap: 1,
    });

    game.all(Space).layout(Letter, {
      gap: 1,
      margin: 1
    });
    game.all(Letter).appearance({
      aspectRatio: 1,
      render: letter => (
        <div>
          <div className="name">{letter.name}</div>
        </div>
      )
    });
  }
});

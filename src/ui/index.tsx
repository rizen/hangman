import React from 'react';
import { render } from '@boardzilla/core';
import { default as setup, Space, Letter } from '../game/index.js';

import './style.scss';
import '@boardzilla/core/index.css';

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

    game.first(Space)?.appearance({
      aspectRatio: 2 / 1,
      render: () => (
        <div className="game">
          {game.phrase}
        </div>
      )
    });

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

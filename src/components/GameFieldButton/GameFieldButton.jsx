import React from 'react';
import { Link } from 'react-router-dom';
import './GameFieldButton.scss';

const GameFieldButton = () => (
    <Link className='game-field-button' to={'/gameField'}>
        Game field
    </Link>
)

export default GameFieldButton;
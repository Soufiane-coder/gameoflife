import React from 'react';
import { Link } from 'react-router-dom';
import './GameFieldButton.scss';

const GameFieldButton = () => (
    <Link className='game-field-button' to={'/game-field'}>
        Game field
    </Link>
)

export default GameFieldButton;
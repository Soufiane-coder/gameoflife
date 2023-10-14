import React from "react";
import { ReactComponent as GamingDraw } from "../../../assets/undraw/undraw_gaming_re_cma2.svg";
import GameFieldButton from "../../../components/GameFieldButton/GameFieldButton";
import "./lp-title.style.scss";
import { ReactComponent as GameOfLifeClipart } from '../../../assets/clipart/game_of_life_clipart.svg';

const LPTitle = () => (
    <div className="header-title">
        <div>
            <GameOfLifeClipart className="header-title__game-of-life-clipart" />
            <GameFieldButton />
        </div>
        <GamingDraw className="header-title__game-draw" />
    </div >
);
export default LPTitle;

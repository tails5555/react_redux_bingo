import React, { Fragment } from 'react';

import './Player.css';

import { Cell } from 'components/cell';

// 25 개의 일차원 배열을 5 * 5 이차원 배열로 바꾸는 함수입니다.
const render_square = (numbers, part) => {
    const tmp = [];
    for(let k = 0; k < numbers.length; k += part) {
        tmp.push(numbers.slice(k, k + part));
    }
    return tmp;
}

// 각 플레이어들에게 빙고 판을 보여줄 함수형 컴포넌트입니다.
const Player = ({ numbers, player, score, push_action, call_queue }) => (
    <Fragment>
        <div className="player__container">
            <div id={`bingo__board_${player}`}>    
            {
                render_square(numbers, 5)
                    .map((row, r) => (
                        <div 
                            key={`bingo_${player}_row_${r}`}
                            className="player__bingo_row"
                        >
                        {
                            row.map((num, c) => (
                                <Cell 
                                    key={`bingo_${player}_col_${c}`}
                                    player={ player }
                                    number={ num }
                                    push_action={ () => push_action(player, r, c, num) }
                                    call_queue={ call_queue }
                                />
                            ))
                        }
                        </div>
                    ))
            }
            </div>
            <div id={`bingo__score_${player}`} className="text-center">
                <h1>{ player }</h1>
                <h2>{ score }</h2>
            </div>
        </div>
    </Fragment>
);

export default Player;
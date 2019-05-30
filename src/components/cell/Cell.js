import React, { Fragment } from 'react';

import './Cell.css';

// 플레이어의 색상을 구분합니다. 1플레이어는 파란색, 2플레이어는 검정색입니다.
const button_color = (player) => player === 'PLAYER1' ? 'primary' : 'secondary';

// 빙고에 보이는 블록을 함수형 컴포넌트로 작성했습니다.
const Cell = ({ push_action, number, player, call_queue }) => (
    <Fragment>
        <button 
            className={ `cell__margin ${ call_queue.includes(number) ? `btn btn-${ button_color(player) }` : `btn btn-outline-${ button_color(player) }` }` } 
            onClick={ push_action }
        >
            { number === 0 ? 'X' : number }
        </button>
    </Fragment>
);

export default Cell;
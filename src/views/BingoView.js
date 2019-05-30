import React, { Fragment, PureComponent } from 'react';

import { Player } from 'components/player';
import { Complete } from 'components/complete';

// 게임의 차례를 알려주는 메시지 함수입니다.
const turn_message = (status, turn) => {
    switch(status){
        case 'READY' :
            return '게임을 시작하세요.';
        case 'PLAYING' :
            return `${turn} 차례 입니다.`;
        default :
            return '게임이 종료 되었습니다.';
    }
}

// 숫자로 row, col 인덱스를 반환하는 함수입니다.
const find_index_by_number = (arr, num) => {
    const idx = arr.indexOf(num);
    const row = Math.floor(idx / 5);
    const col = idx % 5;
    return {
        row, col 
    };
}

// BingoContainer 를 기반으로 작동하는 View 컴포넌트입니다.
class BingoView extends PureComponent {
    constructor(props){
        super(props);
        // completed 요소는 가로선, 세로선, 대각선 별 각 순서대로 완료된 번호를 저장하기 위한 객체입니다.
        // 이는 게임을 하면서 변동 횟수가 많기 때문에 Redux 보다 state 를 사용했습니다.
        this.state = { 
            p1_completed: {
                vertical: [],
                horizontal: [],
                cross: [],
            },
            p2_completed: {
                vertical: [],
                horizontal: [],
                cross: [],
            }
        };
    }

    // 게임 시작 및 재시작을 위한 이벤트 함수 입니다.
    _handle_click_initialize = () => {
        const { game_initialize } = this.props;
        game_initialize();
        this.setState({
            p1_completed: {
                vertical: [],
                horizontal: [],
                cross: [],
            },
            p2_completed: {
                vertical: [],
                horizontal: [],
                cross: [],
            }
        });
    }

    // 빙고에 있는 블록을 클릭하면 점수를 책정하는 함수입니다.
    _handle_click_cell = (player, row, col, num) => {
        const { status } = this.props;
        
        if(status === 'READY') {
            alert('게임 시작 버튼을 클릭하고 시도 바랍니다.');
            return;
        } 

        if(status === 'ENDING') {
            alert('게임이 이미 끝났습니다. 다시 시도 바랍니다.');
            return;
        } 

        const { turn, player1, player2, call_queue, player_pushes_cell_success, player_pushes_cell_failure } = this.props;
        if(turn !== player) {
            player_pushes_cell_failure();
            alert(`지금 차례는 ${ turn } 입니다!`);
        } else if(call_queue.includes(num)) {
            player_pushes_cell_failure();
            alert(`${ num } 블록은 이미 선택되었습니다. 다른 숫자를 클릭하세요.`);
        } else {
            player_pushes_cell_success(turn, player1, player2, call_queue, row, col, num);
            this._score_manage(num);
        }
    }

    // 가로선과 세로선을 완성한 경우 완성 목록에 반영하기 위한 함수입니다.
    _horizon_vertical_check = (player_completed, player, type, num) => {
        const { board } = player;
        const { row, col } = find_index_by_number(board, num);

        switch(type){
            case 'HORIZONTAL' :
                const p_horizon = player_completed.horizontal.slice();
                if(player.score.horizontal[row] === 5) {
                    if(!p_horizon.includes(row + 1)){
                        p_horizon.push(row + 1);
                    }
                }
                return p_horizon;
           
            case 'VERTICAL' :
                const p_vertical = player_completed.vertical.slice();
                if(player.score.vertical[col] === 5) {
                    if(!p_vertical.includes(col + 1)){
                        p_vertical.push(col + 1);
                    }
                }
                return p_vertical;

            default :
                return [];
        }
    }

    // 대각선을 완성한 경우 완성 목록에 반영하기 위한 함수입니다.
    _cross_check = (player_completed, player, num) => {
        const { cross } = player_completed;
        const { board } = player;
        const { row, col } = find_index_by_number(board, num);
        const p_cross = cross.slice();

        if(row === col){
            if(player.score.left_cross === 5){
                if(!p_cross.includes('LEFT'))
                    p_cross.push('LEFT');
            }
        }

        if(4 - row === col){
            if(player.score.right_cross === 5){
                if(!p_cross.includes('RIGHT'))
                    p_cross.push('RIGHT');
            }
        }

        return p_cross;
    }
    
    // state 에 있는 값을 토대로 완성된 선의 개수를 반환합니다.
    _score_output = (player_completed) => {
        return player_completed.vertical.length + player_completed.horizontal.length + player_completed.cross.length;
    }

    // 버튼 클릭 후 플레이어의 점수를 비교하는 함수입니다.
    _score_manage = (num) => {
        const { player1, player2, game_done } = this.props;
        let { p1_completed, p2_completed } = this.state;

        p1_completed = { 
            ...p1_completed, 
            horizontal : this._horizon_vertical_check(p1_completed, player1, 'HORIZONTAL', num),
            vertical: this._horizon_vertical_check(p1_completed, player1, 'VERTICAL', num),
            cross: this._cross_check(p1_completed, player1, num)
        };
        
        p2_completed = { 
            ...p2_completed, 
            horizontal : this._horizon_vertical_check(p2_completed, player2, 'HORIZONTAL', num),
            vertical: this._horizon_vertical_check(p2_completed, player2, 'VERTICAL', num),
            cross: this._cross_check(p2_completed, player2, num)
        };
        
        let p1_score = this._score_output(p1_completed);
        let p2_score = this._score_output(p2_completed);
        
        // 둘 다 5개 이상이면 무승부로 게임 종료. 한 쪽이 5점 이상이면 이에 맞게 반환합니다.
        if(p1_score >= 5 || p2_score >= 5){
            if(p1_score >= 5 && p2_score >= 5) {
                alert('모두 5줄 이상 만들어 비겼습니다.');
            } else if(p1_score >= 5) {
                alert('PLAYER 1 가 우승했습니다.');
            } else {
                alert('PLAYER 2 가 우승했습니다.');
            }

            game_done();
            window.location.href = '/';
        } 

        this.setState({
            p1_completed, p2_completed
        });
    }

    // 렌더링 함수.
    render(){
        const { turn, player1, player2, status, call_queue } = this.props;
        const { p1_completed, p2_completed } = this.state;

        return (
            <Fragment>
                <div id="main__view">
                    <div className="row">
                        <div className="col-6">
                            <Player
                                push_action={ this._handle_click_cell }
                                numbers={ player1.board } 
                                player={ "PLAYER1" }
                                score={ this._score_output(p1_completed) }
                                call_queue={ call_queue }
                            />
                            <Complete complete={ p1_completed } />
                        </div>
                        <div className="col-6">
                            <Player
                                push_action={ this._handle_click_cell }
                                numbers={ player2.board } 
                                player={ "PLAYER2" }
                                score={ this._score_output(p2_completed) }
                                call_queue={ call_queue }
                            />
                            <Complete complete={ p2_completed } />
                        </div>
                    </div>
                    <hr/>
                    <div id="button__view" className="text-center">
                        <h2>{ turn_message(status, turn) }</h2>
                        <button className="btn btn-info" onClick={ this._handle_click_initialize }>
                            { status === 'READY' ? '게임 시작' : '게임 재시작' }
                        </button>
                    </div> 
                </div>
            </Fragment>
        );
    }
}

export default BingoView;
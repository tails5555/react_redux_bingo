// 첫 플레이 시, 빙고판을 무작위로 배치합니다.
const shuffle_array = () => {
    let array = Array.from({ length: 25 }, (v, k) => k + 1); 
    for (let k = array.length - 1; k > 0; k--) {
        const rand = Math.floor(Math.random() * (k + 1));
        [array[k], array[rand]] = [array[rand], array[k]];
    }
    return array;
}

// 게임을 시작 혹은 재시작할 때 값을 초기화하는 액션입니다.

export const GAME_INITIALIZE = 'GAME_INITIALIZE';

export const game_initialize = () => {
    return {
        type: GAME_INITIALIZE,
        payload: {
            status : 'PLAYING',
            player1 : {
                board: shuffle_array(),
                score: {
                    vertical: [0, 0, 0, 0, 0],
                    horizontal: [0, 0, 0, 0, 0],
                    left_cross: 0,
                    right_cross: 0
                }
            },
            player2 : {
                board: shuffle_array(),
                score: {
                    vertical: [0, 0, 0, 0, 0],
                    horizontal: [0, 0, 0, 0, 0],
                    left_cross: 0,
                    right_cross: 0
                }
            },
            call_queue : []
        }
    };
}

// 게임이 끝난 경우 상태를 반환하기 위한 액션입니다.

export const GAME_DONE = 'GAME_DONE';

export const game_done = () => {
    return {
        type: GAME_DONE
    }
}
// row, col 별 카운팅 획수를 추가하는 함수입니다.

const point_update_by_obj = (player, r, c) => {
    player.score.horizontal[r] += 1;
    player.score.vertical[c] += 1;
    
    if(r === c) {
        player.score.left_cross += 1;
    }
    if(4 - r === c){
        player.score.right_cross += 1;
    }

    return player;
}

// 숫자로 row, col 를 가공하여 카운팅 횟수를 추가하는 함수입니다.

const point_update_by_number = (player, num) => {
    const idx = player.board.indexOf(num);

    const r = Math.floor(idx / 5);
    const c = idx % 5;

    return point_update_by_obj(player, r, c);
}

// 플레이어가 블록 누르기를 성공하면 실행하는 액션입니다.

export const PLAYER_PUSHES_CELL_SUCCESS = 'PLAYER_PUSHES_CELL_SUCCESS';

export const player_pushes_cell_success = (turn, player1, player2, call_queue, r, c, num) => {
    let p1, p2;
    if(turn === 'PLAYER1') {
        p1 = point_update_by_obj(player1, r, c);
        p2 = point_update_by_number(player2, num);
    } else {
        p2 = point_update_by_obj(player2, r, c);
        p1 = point_update_by_number(player1, num);
    }

    call_queue.push(num);
    
    return {
        type: PLAYER_PUSHES_CELL_SUCCESS,
        payload: {
            player1 : p1, player2 : p2, call_queue, turn : turn === 'PLAYER1' ? 'PLAYER2' : 'PLAYER1'
        }
    };
}

// 플레이어가 블록을 클릭하다가 문제 생기면 진행하는 액션입니다.

export const PLAYER_PUSHES_CELL_FAILURE = 'PLAYER_PUSHES_CELL_FAILURE';

export const player_pushes_cell_failure = () => {
    return {
        type: PLAYER_PUSHES_CELL_FAILURE
    }
}
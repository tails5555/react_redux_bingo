import { GAME_INITIALIZE, GAME_DONE, PLAYER_PUSHES_CELL_SUCCESS, PLAYER_PUSHES_CELL_FAILURE } from 'actions/game_action';

// store 에 사용할 값을 초기화 합니다.
const INITIAL_STATE = {
    call_queue: [],
    status: 'READY',
    turn: 'PLAYER1',
    player1: {
        board: Array.apply(null, new Array(25)).map(Number.prototype.valueOf, 0),
        score: {
            vertical: [0, 0, 0, 0, 0],
            horizontal: [0, 0, 0, 0, 0],
            left_cross: 0,
            right_cross: 0
        }
    },
    player2: {
        board: Array.apply(null, new Array(25)).map(Number.prototype.valueOf, 0),
        score: {
            vertical: [0, 0, 0, 0, 0],
            horizontal: [0, 0, 0, 0, 0],
            left_cross: 0,
            right_cross: 0
        }
    }
}

// Action 타입에 따라 Store 에 저장할 값을 반환합니다.
export default function(state = INITIAL_STATE, action) {
    switch(action.type){
        case GAME_INITIALIZE :
            return { 
                ...state, 
                status: action.payload.status, 
                player1: action.payload.player1,
                player2: action.payload.player2,
                turn: 'PLAYER1',
                call_queue: action.payload.call_queue,
            };
        
        case PLAYER_PUSHES_CELL_SUCCESS :
            return { 
                ...state, 
                player1: action.payload.player1,
                player2: action.payload.player2,
                turn: action.payload.turn,
                call_queue: action.payload.call_queue,
            };

        case GAME_DONE :
            return { ...state, status: 'ENDING' };

        case PLAYER_PUSHES_CELL_FAILURE :
            return { ...state };

        default :
            return state;
    }
}
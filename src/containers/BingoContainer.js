import { BingoView } from 'views';
import { connect } from 'react-redux';

import { game_initialize, game_done, player_pushes_cell_success, player_pushes_cell_failure } from 'actions/game_action';

// Redux 행위를 사용할 컨테이너를 생성합니다.
const mapStateToProps = ({ game }) => ({
    call_queue: game.call_queue,
    status: game.status,
    player1: game.player1,
    player2: game.player2,
    turn: game.turn,
});

const mapDispatchToProps = (dispatch) => ({
    game_initialize: () => dispatch(game_initialize()),
    game_done: () => dispatch(game_done()),
    player_pushes_cell_success: (turn, player1, player2, call_queue, r, c, num) => dispatch(player_pushes_cell_success(turn, player1, player2, call_queue, r, c, num)),
    player_pushes_cell_failure: () => dispatch(player_pushes_cell_failure()),
});

export default connect(mapStateToProps, mapDispatchToProps)(BingoView);
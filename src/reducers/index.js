import { combineReducers } from 'redux';

import gameReducer from './game_reducer';

export default combineReducers({
    game : gameReducer
});
import React from 'react';
import { Provider } from 'react-redux';

import { RootStore } from 'stores';

import { BingoContainer } from 'containers';

const App = () => (
    <Provider store={ RootStore }>
      <BingoContainer />
    </Provider>
);

export default App;
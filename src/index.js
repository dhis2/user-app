import React from 'react';
import ReactDOM from 'react-dom';
import UserApp from './UserApp';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<UserApp />, document.getElementById('root'));
registerServiceWorker();

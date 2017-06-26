import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import './index.css';

ReactDOM.render(<App levelWidth={30} levelHeight={30} cellSize={32} />, document.getElementById('root'));
registerServiceWorker();

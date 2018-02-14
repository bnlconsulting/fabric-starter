import React from 'react';
import ReactDOM from 'react-dom';

//REDUX items
import { Provider } from 'react-redux';
import store from './redux/store';

//antd
import {LocaleProvider} from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';
import 'antd/dist/antd.css';

import './index.css';
import App from './App';


ReactDOM.render(
    <LocaleProvider locale={enUS}>
        <Provider store={store}>
            <App />
        </Provider>
    </LocaleProvider>,
    document.getElementById('root'));

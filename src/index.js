import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { Provider } from 'react-redux';
import { persistor, store } from './libs/store/config';
import { PersistGate } from 'redux-persist/integration/react';
import axios  from 'axios';
import 'filepond/dist/filepond.min.css';
import Loader from './components/util/Loader';

// const baseUrl = document.getElementsByTagName('base')[0].getAttribute('href');
const root = ReactDOM.createRoot(document.getElementById('root'));
axios.defaults.baseURL = 'https://localhost:7028';


root.render(
		<Provider store={store}>
			<PersistGate loading={<Loader/>} persistor={persistor}>
				<App />
			</PersistGate>
		</Provider>
);

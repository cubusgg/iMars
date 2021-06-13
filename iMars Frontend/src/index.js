import React from 'react';
import ReactDOM from 'react-dom';
import 'normalize.css';
import './index.css';
import App from './App';
import 'tachyons';
import { AuthContextProvider } from "./context/AuthContext";

ReactDOM.render(
  <React.StrictMode>
      <AuthContextProvider>
          <App />
      </AuthContextProvider>
  </React.StrictMode>,
  document.getElementById('root')
);


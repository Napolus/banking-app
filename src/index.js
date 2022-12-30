import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';

import { BrowserRouter } from 'react-router-dom';

import reportWebVitals from './reportWebVitals';

const container = document.getElementById('root');

 var base='/';
 base=base.substring(0,base.length-1)

const root = createRoot(container); // createRoot(container!) if you use TypeScript
root.render(
  <BrowserRouter basename={base}>
    <App base_url={base}/>
  </BrowserRouter>
);



// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

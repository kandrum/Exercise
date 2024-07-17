import React from "react";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import { Login } from "./Components/Login";
import { Home } from "./Components/Home";
import {Provider} from 'react-redux';//provideing whole application to acess the store
import {store} from './redux/store';
import ProtectedRoute from "./ProtectedRouter";

function App(){
  return(
    <Provider store={store}>
    <Router>
      <Routes>
        <Route path="/" element={<Login />}></Route>
        <Route path= "/home" element={<ProtectedRoute><Home /></ProtectedRoute>}></Route>
      </Routes>
    </Router>
    </Provider>
  );
}

export default App;
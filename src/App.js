import React, { Component } from 'react';
import {
    BrowserRouter as Router,
    Redirect,
    Switch,
    Route,
    Link
} from "react-router-dom";

import Home from './components/public/Home'

import UserHome from './components/private/Home'

import Login from './components/user/Login'
import Signup from './components/user/Signup'

import NotFound from './components/statusCodes/NotFound'
import ServerError from './components/statusCodes/ServerError'

class App extends React.Component {

  constructor(props) {
      super(props)
  }
  
  render() {

    return (
      <Router>
          <Route exact={true} path="/" component={Home}/>
          <Route exact={true} path="/login" component={Login}/>
          <Route exact={true} path="/signup" component={Signup}/>
          <Route exact={true} path="/users" component={UserHome}/>

          <Route path="*/404" component={NotFound} />
          <Route path="*/500" component={ServerError} />
      </Router>
    )
  }
}

export default App;
import React from 'react';
import './App.css';
import { Container } from 'semantic-ui-react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import { Provider } from 'react-redux'

import Login from './components/login'
import Auth from './components/auth'
import Projects from './components/projects'

import store from './store'


function App() {
  return (
    <Provider store = {store}>
      <Router>
        <Switch>

          <Route exact path = '/'>
            <Container style = {{margin:20}}>
              <Login></Login>
            </Container>
          </Route>

          <Route path = '/auth' component = {Auth}/>

          <Route path = '/projects' component = {Projects}/>

        </Switch>
      </Router>
    </Provider>
  );
}

export default App

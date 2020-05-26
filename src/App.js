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
import ProjectDetail from './components/projectDetail'
import IssueDetails from './components/issueDetails'

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

          <Route exact path = '/projects' component = {Projects}/>

          <Route exact path = '/projects/:id' component = {ProjectDetail}/>

          <Route exact path = '/issue/:id' component = {IssueDetails}/>

        </Switch>
      </Router>
    </Provider>
  );
}

export default App

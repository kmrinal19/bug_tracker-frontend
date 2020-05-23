import React from 'react';
import './App.css';
import Login from './components/login'
import { Container } from 'semantic-ui-react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

function App() {
  return (
    <Router>
      <Switch>

        <Route exact path = '/'>
          <Container style = {{margin:20}}>
            <Login></Login>
          </Container>
        </Route>
        
      </Switch>

    </Router>
  );
}

export default App;

import React from 'react';
import './css/App.css';
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
import NewProject from './components/newProject'
import NewIssue from './components/newIssue'
import Footer from './components/footer'
import Navbar from './components/navbar'
import Logout from './components/logout'
import MyPage from './components/myPage'
import EditProject from './components/editProject'

import store from './store'


function App() {
  return (
    <Provider store = {store}>
      <Router>

        <Navbar/>
        <Switch>

          <Route exact path = '/'>
              <Login/>
          </Route>

          <Route path = '/auth' component = {Auth}/>

          <Route exact path = '/projects' component = {Projects}/>

          <Route exact path = '/projects/:id' component = {ProjectDetail}/>

          <Route exact path = '/issue/:id' component = {IssueDetails}/>

          <Route exact path = '/newproject' component = {NewProject}/>

          <Route exact path = '/projects/:id/newissue' component = {NewIssue}/>

          <Route exact path = '/logout' component = {Logout}/>

          <Route exact path = '/myPage' component = {MyPage}/>

          <Route exact path = '/projects/:id/editProject' component = {EditProject}/>

        </Switch>

        <Footer/>

      </Router>
    </Provider>
  );
}

export default App

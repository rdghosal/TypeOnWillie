import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './App.css';
import Main from './Main';
import Landing from './Landing';


const App: React.FC = () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <Landing />
        </Route>
        <Route path="/app">
          <Main />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;

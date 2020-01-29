import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './App.css';
import Main from './Main';
import Home from './Home';


const App: React.FC = () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route path="/app">
          <Main />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;

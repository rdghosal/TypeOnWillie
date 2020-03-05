import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './App.css';
import { Main } from './Main';
import Landing from './Landing';
import { TypeSession } from './TypeSession';


const App: React.FC = () => {
  return (
      <Router>
          <Switch>
              <Route exact path="/" render={ props => <Landing {...props} /> } />
              <Route path="/app" component={Main} />
          </Switch>
      </Router>
  );
}

export default App;

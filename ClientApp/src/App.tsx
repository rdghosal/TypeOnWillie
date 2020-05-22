import React, { useState } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './App.css';
import { Main } from './Main';
import Landing from './Landing';
import Login from './Login';
import Register from './Register';
import { User } from './AuthUtils';
import { Profile } from './Profile';



export const AppContext = React.createContext<any>(undefined);

const AppContextProvider : React.FC = (props) => {
    const [ user, setUser ] = useState<User|null>(); // Cache user data
    const [ accessToken, setToken ] = useState<string|null>(); // Cache user data
    return (
        <AppContext.Provider value={{ user, setUser, accessToken, setToken }}>
            { props.children }
        </AppContext.Provider>
    );
}

export const App: React.FC = () => {
  return (
      <Router>
          <Switch>
              <Route exact path="/" render={ props => <Landing {...props} /> } />
              <Route path="/app" render={props => <AppContextProvider><Main {...props}/></AppContextProvider>} />
              <Route path="/login" render={props => <AppContextProvider><Login {...props} /></AppContextProvider>} />
              <Route path="/register" render={props => <AppContextProvider><Register {...props}/></AppContextProvider>} />
              <Route path="/profile" render={props => <AppContextProvider><Profile /></AppContextProvider>} />
          </Switch>
      </Router>
  );
}


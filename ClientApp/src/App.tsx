import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './App.css';
import { Main } from './Main';
import Landing from './Landing';
import Login from './Login';
import Register from './Register';
import { AuthErrorTypes, TokenHandler, User } from './AuthUtils';
import { Profile } from './Profile';
import { GuestSessionCache } from './GuestSessionCache';


export const AppContext = React.createContext<any>(undefined);

const AppContextProvider : React.FC = (props) => {
    const [ user, setUser ] = useState<User|null>(null); // Cache user data
    const [ accessToken, setToken ] = useState<string|null>(); // Cache user data
    const [ guestCache, setGuestCache ] = useState<GuestSessionCache|null>(null);
    
    useEffect(() => {
        console.log("Searching for guest cache.");
        setUser(getCachedUser());
        console.log(getCachedUser());
    }, []);

    useEffect(() => {
        if (!user) return;
        if (user.id === "guest" && !guestCache) {
            console.log("setting guest cache", new Date().toISOString())
            setGuestCache(GuestSessionCache.getCache());
        }
    }, [user]);

    useEffect(() => {
        console.log("let's take a look at the User data: ", user);

        if (user && user.id === "guest") return;

        // Parse sessionStorage for User data.
        // If absent, go to login
        if (window.location.href.indexOf("/login") === -1) {

            if (!accessToken) {
                TokenHandler.refreshAccessToken()
                    .then(token => {
                        if (token === AuthErrorTypes.EXPIRED || token === AuthErrorTypes.INVALID) {
                            // TODO errors handle separately
                            return window.location.href = "/login";
                        }
                        console.log(accessToken);
                        setToken(accessToken);
                    });
            }
        }
    }, [accessToken]);


    useEffect(() => {
        if (accessToken) 
            if (!user) { setUser(TokenHandler.parseClaims(accessToken)) }
    }, [user, accessToken]);

    return (
        <AppContext.Provider value={{ user, setUser, accessToken, setToken, guestCache, setGuestCache }}>
            { props.children }
        </AppContext.Provider>
    );
}

export const App: React.FC = () => {
  return (
      <Router>
          <Switch>
              <Route exact path="/" render={ props => <AppContextProvider><Landing {...props} /></AppContextProvider> } />
              <Route path="/app" render={props => <AppContextProvider><Main {...props}/></AppContextProvider>} />
              <Route path="/login" render={props => <AppContextProvider><Login {...props} /></AppContextProvider>} />
              <Route path="/register" render={props => <AppContextProvider><Register {...props}/></AppContextProvider>} />
              <Route path="/profile" render={props => <AppContextProvider><Profile /></AppContextProvider>} />
          </Switch>
      </Router>
  );
}

function getCachedUser() : User | null {
    
    let userData : string | null;
    userData = sessionStorage.getItem("user");
    console.log(userData)
    
    if (userData) {
        return JSON.parse(userData) as User;
    } else {
        return null;
    }
}
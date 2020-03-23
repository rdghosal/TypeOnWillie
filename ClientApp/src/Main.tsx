import React, { Fragment, useState, useEffect, useContext } from "react";
import Navbar from "./Navbar";
import SonnetMenu from "./SonnetMenu";
import queryString from "query-string";
import { RouteComponentProps } from "react-router";
import { TypeSession } from "./TypeSession";
import Sonnet from "./Sonnet";
import Login from "./Login";
import { AppContext } from "./App";
import { TokenHandler, AuthErrorTypes } from "./AuthUtils";


export const MainContext = React.createContext<any>(undefined);

export const Main: React.FC<RouteComponentProps> = (props) => {

    const params = queryString.parse(props.location.search);
    const { user, setUser, accessToken, setToken } = useContext(AppContext);
    const [currentSonnet, setSonnet] = useState<Sonnet|undefined>(undefined); // Track sonnet in session

    useEffect(() => {
        // Parse sessionStorage for User data.
        // If absent, go to login
        if (!accessToken) {
            TokenHandler.refreshAccessToken()
                .then(token => {
                    if (token === AuthErrorTypes.EXPIRED || token === AuthErrorTypes.INVALID) {
                        // TODO errors handle separately
                        return props.history.push("/login");
                    }
                    console.log(token);
                    setToken(token);
                });
        }
    }, [accessToken]);

    return (
        <Fragment>
            <MainContext.Provider value={{ currentSonnet, setSonnet, user, setUser }}>
                <Navbar />
                { params["sonnet"] && user ? <TypeSession sonnetId={ params["sonnet"] } /> : <SonnetMenu /> }
            </MainContext.Provider>
        </Fragment>
    );
}

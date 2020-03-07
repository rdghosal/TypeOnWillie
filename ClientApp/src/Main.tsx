import React, { Fragment, useState, useEffect, useContext } from "react";
import Navbar from "./Navbar";
import SonnetMenu from "./SonnetMenu";
import queryString from "query-string";
import { RouteComponentProps } from "react-router";
import { TypeSession } from "./TypeSession";
import Sonnet from "./Sonnet";
import Login from "./Login";
import { AppContext } from "./App";


export const MainContext = React.createContext<any>(undefined);

export const Main: React.FC<RouteComponentProps> = (props) => {

    const params = queryString.parse(props.location.search);
    const { user, setUser } = useContext(AppContext);
    const [currentSonnet, setSonnet] = useState<Sonnet|undefined>(undefined); // Track sonnet in session

    useEffect(() => {
        // Parse sessionStorage for User data.
        // If absent, go to login
        if (!user) {
            const sessionData = sessionStorage.getItem("user");
            if (!sessionData) {
                return props.history.push("/login");
            }
            return setUser(JSON.parse(sessionData));
        }
    }, [user]);

    return (
        <Fragment>
            <MainContext.Provider value={{ currentSonnet, setSonnet, user, setUser }}>
                <Navbar />
                { params["sonnet"] ? <TypeSession sonnetId={ params["sonnet"] } /> : <SonnetMenu /> }
            </MainContext.Provider>
        </Fragment>
    );
}

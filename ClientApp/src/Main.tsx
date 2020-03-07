import React, { Fragment, useState, useEffect } from "react";
import Navbar from "./Navbar";
import SonnetMenu from "./SonnetMenu";
import queryString from "query-string";
import { RouteComponentProps } from "react-router";
import { TypeSession } from "./TypeSession";
import Sonnet from "./Sonnet";


export interface User {
    id: string;
    username: string;
    age: number|null;
    highestEducation: string|null;
    nationality: string|null;
}

export const MainContext = React.createContext<any>(undefined);

export const MainContextProvider: React.FC = (props) => {
    
}


export const Main: React.FC<RouteComponentProps> = (props) => {

    const params = queryString.parse(props.location.search);

    const [currentSonnet, setSonnet] = useState<Sonnet|undefined>(undefined); // Track sonnet in session
    const [ user, setUser ] = useState<User|null>(); // Cache user data

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
            <MainContext.Provider value={{ currentSonnet, setSonnet }}>
                <Navbar />
                { params["sonnet"] ? <TypeSession sonnetId={ params["sonnet"] } /> : <SonnetMenu /> }
            </MainContext.Provider>
        </Fragment>
    );
}

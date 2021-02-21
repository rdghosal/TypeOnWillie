import React, { Fragment, useState, useEffect, useContext } from "react";
import Navbar from "./Navbar";
import SonnetMenu from "./SonnetMenu";
import queryString from "query-string";
import { RouteComponentProps } from "react-router";
import { TypeSession } from "./TypeSession";
import { Sonnet } from "./Sonnet";
import Login from "./Login";
import { AppContext } from "./App";
import { TokenHandler, AuthErrorTypes, User } from "./AuthUtils";


export const MainContext = React.createContext<any>(undefined);

export const Main: React.FC<RouteComponentProps> = (props) => {

    const params = queryString.parse(props.location.search);
    const { user, setUser, accessToken, setToken } = useContext(AppContext);
    const [currentSonnet, setSonnet] = useState<Sonnet|undefined>(undefined); // Track sonnet in session

    return (
        <Fragment>
            <MainContext.Provider value={{ currentSonnet, setSonnet, user, setUser }}>
                {
                    user &&
                        params["sonnet"] && currentSonnet
                        ? <TypeSession sonnetId={params["sonnet"]} userId={user.id} />
                        : <SonnetMenu />
                }
            </MainContext.Provider>
        </Fragment>
    );
}

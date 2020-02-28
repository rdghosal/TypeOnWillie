import React, { Fragment, useState } from "react";
import Navbar from "./Navbar";
import SonnetMenu from "./SonnetMenu";
import queryString from "query-string";
import { RouteComponentProps } from "react-router";
import TypeSession from "./TypeSession";
import Sonnet from "./Sonnet";


export const MainContext = React.createContext<any>(undefined);

export const MainContextProvider: React.FC = (props) => {
    const [currentSonnet, setSonnet] = useState<Sonnet|undefined>(undefined);
    return (
        <MainContext.Provider value={{ currentSonnet, setSonnet }}>
            { props.children }
        </MainContext.Provider>
        );
}


export const Main: React.FC<RouteComponentProps> = (props) => {

    const params = queryString.parse(props.location.search);

    return (
        <Fragment>
            <MainContextProvider>
                <Navbar />
                {params["sonnet"] ? <TypeSession sonnetId={ params["sonnet"] } /> : <SonnetMenu /> }
            </MainContextProvider>
        </Fragment>
    );
}

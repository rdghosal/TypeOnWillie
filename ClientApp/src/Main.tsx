import React, { Fragment } from "react";
import Navbar from "./Navbar";
import SonnetMenu from "./SonnetMenu";

const Main: React.FC = () => {
    return (
        <Fragment>
            <Navbar />
            <SonnetMenu />
        </Fragment>
    );
}

export default Main;
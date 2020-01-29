import React, { Fragment } from "react";
import Navbar from "./Navbar";
import SonnetCard from "./SonnetCard";

const Main: React.FC = () => {
    return (
        <Fragment>
            <Navbar />
            <SonnetCard />
        </Fragment>
    );
}

export default Main;
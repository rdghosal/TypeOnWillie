import React, { useState, useEffect, Fragment } from "react";
import SonnetCard from "./SonnetCard";
import Sonnet from "./Sonnet";

const SonnetMenu : React.FC = () : JSX.Element => {

    const [ sonnetCollection, setSonnetCollection ] = useState<Array<Sonnet> | null>(null);

    useEffect(() => {
        // Fetch sonnet data on page load
        if (sonnetCollection === null) {
            fetchSonnects()
                .then(data => {
                    setSonnetCollection(data)
                });
        }
    }, [sonnetCollection]);

    return (
        <Fragment>
            { sonnetCollection && sonnetCollection!.map((sonnet, i) => <SonnetCard key={i} sonnet={sonnet}/>) }
        </Fragment>
    );
}

export default SonnetMenu;


async function fetchSonnects(): Promise<Array<Sonnet>> {
    let res = await fetch("api/sonnetmenu");
    return res.json();
}

import React, { useState, Props, useEffect, Fragment } from "react";
import SonnetCard from "./SonnetCard";
import Sonnet from "./Sonnet";

const SonnetMenu : React.FC = () : JSX.Element => {

    const [ sonnetCollection, setSonnetCollection ] = useState<Array<Sonnet> | null>(null);

    useEffect(() => {
        if (sonnetCollection === null) {
            fetchSonnects()
                .then(data => setSonnetCollection(data));
        }
    }, [sonnetCollection]);

    async function fetchSonnects(): Promise<Array<Sonnet>> {
        let res = await fetch("sonnetmenu");
        return await res.json();
    }

    return (
        <Fragment>
            { sonnetCollection!.map((sonnet, i) => <SonnetCard key={i} sonnet={sonnet}/>) }
        </Fragment>
    );
}

export default SonnetMenu;
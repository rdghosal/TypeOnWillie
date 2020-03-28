import React, { useState, useEffect, Fragment } from "react";
import SonnetCard from "./SonnetCard";
import Sonnet from "./Sonnet";

const SonnetMenu : React.FC = () : JSX.Element => {

    const [ sonnetCollection, setSonnetCollection ] = useState<Array<Sonnet> | null>(null);

    useEffect(() => {
        // Fetch sonnet data on page load
        if (sonnetCollection === null) {
            // Retrieve sonnets from cache or fetch
            const cache = localStorage.getItem("sonnets");
            if (!cache) {
                fetchSonnects()
                    .then(data => {
                        localStorage.setItem("sonnets", JSON.stringify(data));
                        setSonnetCollection(data);
                    });
            } else {
                setSonnetCollection(JSON.parse(cache));
            }
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
    let sonnetCollection = await res.json() as Array<Sonnet>;
    return sonnetCollection.sort((a, b) => a.id - b.id); // Sort collection by id asc
}

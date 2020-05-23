import React, { useState, useEffect, Fragment, useContext } from "react";
import SonnetCard from "./SonnetCard";
import Sonnet from "./Sonnet";
import SonnetDetails from "./SonnetDetails";
import { AppContext } from "./App";

const SonnetMenu : React.FC = (props) : JSX.Element => {

    const [ sonnetCollection, setSonnetCollection ] = useState<Array<Sonnet> | null>(null);
    const [ sonnetInFocus, focusSonnet ] = useState<Sonnet|null>(null);

    const { user } = useContext(AppContext);

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
        <div className="container-fluid">
            <div className="row">
                <div className="col-3">
                    { 
                        sonnetCollection && sonnetCollection!.map((sonnet:Sonnet, i) => {
                            return (
                                <div className="row" key={i}>
                                    <SonnetCard key={i} sonnet={sonnet} focusSonnet={focusSonnet} />
                                </div>
                            );
                        })
                    }
                </div>
                <div className="col-8">
                    {
                        <SonnetDetails sonnet={sonnetInFocus} user={user} />   
                    }
                </div>
            </div>
        </div>
    );
}

export default SonnetMenu;


async function fetchSonnects(): Promise<Array<Sonnet>> {
    let res = await fetch("api/sonnetmenu");
    let sonnetCollection = await res.json() as Array<Sonnet>;
    return sonnetCollection.sort((a, b) => a.id - b.id); // Sort collection by id asc
}

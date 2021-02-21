import React, { useState, useEffect, Fragment, useContext } from "react";
import SonnetCard from "./SonnetCard";
import { Sonnet } from "./Sonnet";
import SonnetDetails from "./SonnetDetails";
import { AppContext } from "./App";
import { User } from "./AuthUtils";
import SearchBar from "./SearchBar";
import RandomButton from "./RandomButton";
import queryString from "query-string";
import { RouteComponentProps, withRouter } from "react-router";
import Navbar from "./Navbar";


const SonnetMenu : React.FC<RouteComponentProps> = (props) : JSX.Element => {

    const [ sonnetCollection, setSonnetCollection ] = useState<Array<Sonnet> | null>(null);
    const [ sonnetsDisplayed, setSonnetsDisplayed ] = useState<Array<Sonnet> | null>(null);
    const [ sonnetInFocus, focusSonnet ] = useState<Sonnet|null>(null);

    const { user } = useContext(AppContext);

    useEffect(() => {

        if (!sonnetCollection) return;

        const params = queryString.parse(props.location.search);

        if (params["focus"]) {
            console.log("found focus", params["focus"][0])
            const inFocus = parseInt(params["focus"][0]);
            if (!isNaN(inFocus)) handleFocusByUrl(inFocus);
        }

    }, []);

    useEffect(() => {
        if (!user) {
            return;
        }

        // Fetch sonnet data on page load
        if (sonnetCollection === null) {
            // Retrieve sonnets from cache or fetch
            const cache = localStorage.getItem("sonnets");
            if (!cache) {
                fetchSonnects(user as User)
                    .then(data => {
                        localStorage.setItem("sonnets", JSON.stringify(data));
                        setSonnetCollection(data);
                    });
            } else {
                setSonnetCollection(JSON.parse(cache));
            }
        }
    }, [user, sonnetCollection]);

    useEffect(() => {

        if (sonnetCollection) {
            setSonnetsDisplayed(sonnetCollection);
        }

    }, [sonnetCollection]);

    function handleFocusByUrl(focusId : number) {
        const sonnetToFocus = sonnetCollection!.filter((s: Sonnet) => s.id === focusId)[0];
        focusSonnet(sonnetToFocus);
    }

    return (
        <>
            <Navbar isLogInPage={false} />
            <div className="container-fluid">
                <div className="row">
                    <div className="col-3">
                        <SearchBar sonnetsDisplayed={sonnetCollection} sonnetCollection={sonnetCollection}
                                setSonnetsDisplayed={setSonnetsDisplayed} />                    
                        <RandomButton sonnetCollection={sonnetCollection!} focusSonnet={focusSonnet} />
                        { 
                            sonnetsDisplayed && sonnetsDisplayed!.map((sonnet:Sonnet, i) => {
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
        </>
    );
}

export default withRouter(SonnetMenu);


async function fetchSonnects(user : User): Promise<Array<Sonnet>> {

    let res = await fetch("api/sonnetmenu", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            userId: user.id
        })
    });

    let sonnetCollection = await res.json() as Array<Sonnet>;
    return sonnetCollection.sort((a, b) => a.id - b.id); // Sort collection by id asc
}

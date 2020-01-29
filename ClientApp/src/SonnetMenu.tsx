import React, { useState, ReactHTMLElement, FunctionComponent, Props } from "react";
import SonnetCard from "./SonnetCard";

class Sonnet {

    private sonnetNumber: number | null = null;
    private sonnetText: string | null = null;

    public constructor(sonnetNumber: number, sonnetText: string) {
        this.sonnetNumber = sonnetNumber;
        this.sonnetText = sonnetText;
    }

}

const SonnetMenu = () => {

    const [ sonnetCollection, setSonnetCollection ] = useState<Array<Sonnet>|null>(null);

    async function fetchSonnects(): Promise<Array<Sonnet>> {
        let res = await fetch("home");
        return await res.json();
    }

    if (sonnetCollection === null) {
        fetchSonnects()
            .then(data => setSonnetCollection(data))
    } else {
        sonnetCollection.map((sonnet, index) => <SonnetCard key={index} sonnet={sonnet} />);
    }
}

export default SonnetMenu;
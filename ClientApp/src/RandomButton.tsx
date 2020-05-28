import React from "react";
import { Sonnet } from "./Sonnet";

type RandomButtonProps = {
    sonnetCollection: Sonnet[];
    focusSonnet: React.Dispatch<React.SetStateAction<Sonnet | null>>;
}

const RandomButton: React.FC<RandomButtonProps> = (props) => {

    const handleClick = () => {

        const numSonnets = props.sonnetCollection.length;
        let focusId = Math.floor(Math.random() * numSonnets);
        if (focusId === 0) focusId += 1;

        const targetSonnet: Sonnet = props.sonnetCollection.filter((sonnet: Sonnet) => sonnet.id === focusId )[0];

        props.focusSonnet(targetSonnet);
    }

    return (
        <button className="btn btn-warning" onClick={handleClick} >Select Random!</button>
    );
}


export default RandomButton;

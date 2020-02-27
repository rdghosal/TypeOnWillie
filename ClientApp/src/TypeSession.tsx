import React, { useContext } from "react";
import { MainContext } from "./Main";

const TypeSession: React.FC = () => {

    const { currentSonnet } = useContext(MainContext);
    // TODO request backend if no context data

    return (<div> { currentSonnet.lines.toString() } </div>);
} 

export default TypeSession;
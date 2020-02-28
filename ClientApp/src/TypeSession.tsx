import React, { useContext, useState, useEffect, ChangeEvent } from "react";
import { MainContext } from "./Main";


type TypeSessionProps = {
    sonnetId: string | string[];
}

const TypeSession: React.FC<TypeSessionProps> = ({ sonnetId }) => {

    // Current Sonnet in session
    const { currentSonnet, setSonnet } = useContext(MainContext);

   // Pointers to column (word) and row (line) of sonnet matrix
    const [ currentLine, incrementLine ] = useState<number>(0);
    const [ currentWord, incrementWord ] = useState<number>(0);
    const [ wordArray, setWordArray ] = useState<Array<string>>(new Array<string>());

    useEffect(() => {
        // Fetch sonnet if no context data
        if (!currentSonnet) {
            fetch(`api/sonnetmenu?id=${sonnetId}`)
                .then(res => res.json())
                .then(data => setSonnet(data));
        }
    });

    useEffect(() => {
        if (!currentSonnet) return;
        setWordArray(currentSonnet.lines[currentLine].split(" "));
    }, [currentLine, currentSonnet]);

    function evalInput() {
        const input = (document.getElementById("session-input") as HTMLInputElement);
        const currentInput = input.value;
        console.log(currentInput)
        // TODO move to next line
        incrementWord(currentWord => currentWord += 1);
        input.value = "";
    }

    return (
        <div className="typesession">
            {
                currentSonnet
                    ? <>
                        <h2>{ currentSonnet.title }</h2>
                        <div className="typesession__current-line">
                            { wordArray[currentWord] }
                        </div>
                        <input type="text" id="session-input" onKeyUp={ e => (e.keyCode === 32) ? evalInput() : null }/>
                      </>
                    : null
            }
        </div>
    ) 
} 

export default TypeSession;

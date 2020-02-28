import React, { useContext, useState, useEffect, ChangeEvent } from "react";
import { MainContext } from "./Main";


type TypeSessionProps = {
    sonnetId: string | string[];
}

const TypeSession: React.FC<TypeSessionProps> = ({ sonnetId }) => {

    // Current Sonnet in session
    const { currentSonnet, setSonnet } = useContext(MainContext);

   // Pointers to column (wordIndex) and row (lineIndex) of sonnet matrix
    const [ lineIndex, setLine ] = useState<number>(0);
    const [ wordIndex, setWord ] = useState<number>(0);
    const [ wordArray, setWordArray ] = useState<Array<string>>(new Array<string>());
    
    // Cache for user progress
    const [ currentLine, setCurrentLine ] = useState<Array<string>>(new Array<string>());
    const [ currentProgress, pushProgress ] = useState<Array<string>>(new Array<string>()); 

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
        setWordArray(currentSonnet.lines[lineIndex].split(" "));
    }, [lineIndex, currentSonnet]);

    function handleInput() {
        const input = (document.getElementById("session-input") as HTMLInputElement);
        const currentInput = input.value;
        console.log(currentInput)

        // TODO evalInput

        if (wordIndex === wordArray.length - 1) {
            // Move to next line and beginning thereof
            setWord(0);
            setLine(lineIndex => lineIndex += 1);
            
            // Make array of words typed thus far (+ currentInput) into a string and store
            const progress = [...currentLine, currentInput].join(" ");
            pushProgress(currentProgress => [...currentProgress, progress]);
            setCurrentLine(new Array<string>()); // Reset to empty

        } else {
            // Store input and move to next word in line
            setCurrentLine(currentLine => [...currentLine, currentInput]);
            setWord(wordIndex => wordIndex += 1);
        }

        // Clear input field
        input.value = "";
    }

    return (
        <div className="typesession">
            {
                currentSonnet
                    ? <>
                        <h2>{ currentSonnet.title }</h2>
                        <div className="typesession__current-lineIndex">
                            { wordArray[wordIndex] }
                        </div>
                        <input type="text" id="session-input" onKeyUp={ e => (e.keyCode === 32) ? handleInput() : null }/>
                      </>
                    : <div>Loading...</div>
            }
            <div className="typesession__model-text">
                { 
                    currentSonnet 
                        ? currentSonnet.lines.map((line:string, i:number) => <p key={i}>{line}</p>) 
                        : <p>Loading...</p> 
                }
            </div>
            <div className="typesession__progress">
                <div className="typesession__progress--line">
                    { currentLine.join(" ") }
                </div>
                <div className="typesession__progress--sonnet">
                    { currentProgress.map((line:string, i:number) => <p key={i}>{line}</p>) }
                </div>
            </div>
        </div>
    ) 
} 

export default TypeSession;

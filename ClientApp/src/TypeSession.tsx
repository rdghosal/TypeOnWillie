import React, { useContext, useState, useEffect } from "react";
import { MainContext } from "./Main";


type TypeSessionProps = {
    sonnetId: string | string[];
}

class WordSet {
    readonly modelWord: string;
    readonly typedWord: string;

    constructor(model: string, typed:string) {
        this.modelWord = model;
        this.typedWord = typed;        
    }
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
    const [ currentWordCount, incrementCount ] = useState<number>(0);
    const [ currentProgress, pushProgress ] = useState<Array<string>>(new Array<string>()); 
    const [ correctWords, incrementCorrectWords ] = useState<number>(0);
    const [ incorrectWords, pushIncorrect ] = useState<Array<WordSet>>(new Array<WordSet>());

    // To track session
    const [ isFinished, toggleSessionStatus ] = useState<boolean>(false);
    const [ intervalId, setIntervalId ] = useState<any>();
    const [ wordCount, incrementWordCount ] = useState<number>(0);

    useEffect(() => {
        // Fetch sonnet if no context data
        if (!currentSonnet) {
            fetch(`api/sonnetmenu?id=${sonnetId}`)
                .then(res => res.json())
                .then(data => setSonnet(data));
        }
    });

    useEffect(() => {
        if (!intervalId && currentSonnet && !isFinished) {
            const id = setInterval(() => incrementTime(), 1000);
            setIntervalId(id);
        } else if (isFinished) {
            clearInterval(intervalId);
        }
    }, [currentSonnet, isFinished]);
    
    useEffect(() => {
        // End session if all words have been typed
        if (!currentSonnet) return;
        if (currentWordCount === currentSonnet.length) {
            toggleSessionStatus(true);
        }
    }, [currentWordCount]);

    useEffect(() => {
        // Split current line into an array of words
        if (!currentSonnet || currentWordCount === currentSonnet.wordCount) return; // TODO test
        setWordArray(currentSonnet.lines[lineIndex].split(" "));
    }, [lineIndex, currentSonnet]);

    useEffect(() => {
        const scoreEl = document.querySelector(".typesession__score");
        if (scoreEl) {
            const correctRatio = Math.ceil(correctWords / currentWordCount * 100);
            scoreEl.innerHTML = (correctRatio).toString();
        }
    }, [currentWordCount]);

    function handleInput() {
        const input = (document.getElementById("session-input") as HTMLInputElement);
        const currentInput = input.value;
        console.log(currentInput)

        // TODO evalInput
        evalInput(currentInput, wordArray[wordIndex]);

        // Add word count
        incrementCount(currentWordCount => currentWordCount += 1);

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

        incrementWordCount(wordCount => wordCount++);

        // Clear input field
        input.value = "";
    }

    function evalInput(typedWord:string, modelWord:string) {
        // Adds to score if typed and model word are identical
        typedWord = typedWord.replace(" ", ""); // Strip space from rear of input
        if (typedWord == modelWord) {
            incrementCorrectWords(correctWords => correctWords += 1);
        } else {
            pushIncorrect(incorrectWords => [...incorrectWords, new WordSet(modelWord, typedWord)]);
        }

    }

    function incrementTime() {
        const timer = document.querySelector(".typesession__timer");
        if (timer) {
            let currentTime = timer.innerHTML;
            timer.innerHTML = (parseInt(currentTime) + 1).toString();
        }
    }

    return (
        <div className="typesession">
            {
                currentSonnet
                    ? <>
                        <h2>{ currentSonnet.title }</h2>
                        <div className="typesession__timer">
                            0
                        </div>
                        <div className="typesession__score">
                            0
                        </div>
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
                <div className="typesession__incorrect-list">
                    <ul>
                        { incorrectWords.map((wordSet:WordSet, i:number) => <li key={i}>{wordSet.modelWord} | {wordSet.typedWord}</li>)}
                    </ul>
                </div>
            </div>
        </div>
    ) 
} 

export default TypeSession;

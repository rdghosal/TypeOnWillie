import React, { useContext, useState, useEffect } from "react";
import { MainContext } from "./Main";
import SessionTimer from "./SessionTimer";
import SessionScore from "./SessionScore";
import { LoadingMessage } from "./LoadingMessage";
import CurrentModelText from "./CurrentModelText";
import TypeHint from "./TypeHint";
import Sonnet from "./Sonnet";
import MisspelledWordList from "./MisspelledWordList";

type TypeSessionProps = {
    sonnetId: string | string[];
}

export class WordSet {
    readonly modelWord: string;
    readonly typedWord: string;
    readonly index: number;

    constructor(model: string, typed:string, index: number) {
        this.modelWord = model;
        this.typedWord = typed;        
        this.index = index;
    }
}

export interface MisspelledWordMap {
    [key: number] : Array<WordSet>
}

export const TypeSession: React.FC<TypeSessionProps> = ({ sonnetId }) => {
    // Current Sonnet in session
    const { currentSonnet, setSonnet } = useContext(MainContext);

   // Pointers to column (wordIndex) and row (lineIndex) of sonnet matrix
    const [ lineIndex, setLine ] = useState<number>(0);
    const [ wordIndex, setWord ] = useState<number>(0);
    const [ wordArray, setWordArray ] = useState<Array<string>>(new Array<string>());
    
    // Cache for user progress
    const [ currentLine, setCurrentLine ] = useState<Array<string>>(new Array<string>());
    const [ currentProgress, pushProgress ] = useState<Array<string>>(new Array<string>()); 
    const [ misspelledWords, pushMisspelled ] = useState<MisspelledWordMap>({});
    const [ correctWordCount, incrementCorrectWords ] = useState<number>(0);
    
    // To track session
    const [ isStarted, toggleStart ] = useState<boolean>(false);
    const [ isFinished, toggleFinish ] = useState<boolean>(false);
    const [ currentWordCount, incrementCount ] = useState<number>(0);

    // Track whether using touch keyboard
    const [ isTouchScreen, toggleInputType ] = useState<boolean>(false);

    window.onbeforeunload = (e : BeforeUnloadEvent) => {
        e.preventDefault();
        console.log("WAIT!")
    };

    useEffect(() => {
        // Fetch data if not in context
        if (!currentSonnet) {
            return fetchSonnetById();
        }
    }, [currentSonnet]);

    useEffect(() => {
        return () => {
            if (!isFinished && isStarted) window.confirm("Are you sure?");
        };
    });

    useEffect(() => {
        // End session if all words have been typed
        if (!currentSonnet) return;
        if (currentWordCount > currentSonnet.wordCount - 1) {
            const inputEl = (document.getElementById("session-input") as HTMLInputElement);
            inputEl.disabled = true;
            return toggleFinish(true); // TODO test
        }
    }, [currentWordCount]);

    useEffect(() => {
        // Split current line and store as array
        if (!currentSonnet || isFinished) return;
        if (lineIndex <= Sonnet.MAX_LINES - 1) {
            setWordArray(currentSonnet.lines[lineIndex].split(" "));
        }
    }, [lineIndex, currentSonnet, currentWordCount]);

    function fetchSonnetById() {
        // Fetch sonnet data by sonnetId props and save to state
        fetch(`api/sonnetmenu?id=${sonnetId}`)
            .then(res => res.json())
            .then(data => setSonnet(data));
    }

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

        // Clear input field
        input.value = "";
    }

    function evalInput(typedWord:string, modelWord:string) {
        // Adds to score if typed and model word are identical
        typedWord = typedWord.replace(/\s*$/, ""); // Strip all space from rear of input only
        if (typedWord === modelWord) {
            incrementCorrectWords(correctWordCount => correctWordCount += 1);
        } else {
            const currentWords = new WordSet(modelWord, typedWord, wordIndex);
            pushMisspelled(misspelledWords => {
                const temp = misspelledWords[lineIndex];
                let newWords = (temp) ? [...temp, currentWords] : [ currentWords ];
                return {
                    ...misspelledWords,
                    [lineIndex] : newWords
                }
            });
        }
    }

    function handleKeyUp(e : React.KeyboardEvent<HTMLInputElement>) {
        const targetKey = (wordIndex === wordArray.length - 1) ? 13 : 32;
        if (e.keyCode === targetKey) return handleInput(); 
    }

    return (
        <div className="typesession">
            {
                currentSonnet
                    ? <>
                        <h2>{ currentSonnet.title }</h2>
                        <SessionTimer 
                            currentWordCount={currentWordCount}
                            isStarted={isStarted} 
                            isFinished={isFinished} />
                        <SessionScore 
                            currentWordCount={currentWordCount} 
                            remainingWords={currentSonnet.wordCount - currentWordCount} 
                            correctWordCount={correctWordCount} />
                        { !isFinished && 
                            <CurrentModelText wordArray={wordArray} wordIndex={wordIndex} /> }
                        <input type="text" id="session-input" 
                            onKeyUp={ handleKeyUp } onClick={() => toggleStart(true)} onTouchStart={() => toggleInputType(true)}/>
                        <TypeHint endOfLine={ wordIndex === wordArray.length - 1 }/>
                        <div className="typesession__model-text">
                            { currentSonnet.lines.map((line:string, i:number) => (i > lineIndex) && <p key={i}>{line}</p>) }
                        </div>
                        <div className="typesession__progress--sonnet">
                            { currentProgress.map((line:string, i:number) => <p key={i}>{line}</p>) }
                            <p>{ currentLine.join(" ") }</p>
                        </div>
                        <MisspelledWordList 
                            misspelledWords={ misspelledWords } lineIndex={lineIndex} />
                      </>
                    : <LoadingMessage insertText={"your session"} />
            }
        </div>
    ) 
} 
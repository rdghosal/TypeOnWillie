import React, { useContext, useState, useEffect, useRef } from "react";
import { MainContext } from "./Main";
import SessionTimer from "./SessionTimer";
import SessionScore from "./SessionScore";
import { LoadingMessage } from "./LoadingMessage";
import CurrentModelText from "./CurrentModelText";
import TypeHint from "./TypeHint";
import Sonnet from "./Sonnet";
import MisspelledWordList from "./MisspelledWordList";
import { AppContext } from "./App";

type TypeSessionProps = {
    userId: string;
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

interface ISessionData {
    userId: string,
    sonnetId: number,
    secondsElapsed: number,
    numberMisspelled: number,
    misspelledString: string,
    percentCorrect: number,
    percentFinished: number
    quit: string,
    touchScreen: string
}

interface ISessionState {
    isFinished: boolean,
    isStarted: boolean
}

export const TypeSession: React.FC<TypeSessionProps> = ({ sonnetId, userId }) => {

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

    const sessionState = useRef<ISessionState>();
    const sessionData = useRef<ISessionData>();

    useEffect(() => {
        // Fetch data if not in context
        if (!currentSonnet) {
            return fetchSonnetById();
        }
    }, [currentSonnet]);

    useEffect(() => {
        console.log("fired")
        return () => { handleDismount() }
    }, []);

    useEffect(() => {

        if (!isStarted) return;

        // Update ref with current session data
        const data = {} as ISessionData;

        data.userId = userId;
        data.sonnetId = currentSonnet.id;
        data.secondsElapsed = parseInt(document.getElementById("timer")!.innerHTML);
        data.numberMisspelled = calcNumMisspelled(misspelledWords);
        data.misspelledString = stringifyMisspelledWords(misspelledWords);
        data.percentCorrect = parseFloat((correctWordCount / currentWordCount).toFixed(3));
        data.percentFinished = parseFloat((currentWordCount / currentSonnet.wordCount).toFixed(3));
        data.touchScreen = (isTouchScreen) ? "Y" : "N";

        sessionData.current = data;

        // Update state with current session state
        const state = {} as ISessionState;

        state.isFinished = isFinished;
        state.isStarted = isStarted;

        sessionState.current = state;

    }, [isFinished,
        isStarted,
        misspelledWords,
        userId,
        currentSonnet,
        correctWordCount,
        currentWordCount,
        misspelledWords,
        isTouchScreen]);

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

    function handleDismount() {
        console.log("Cleanup!")
        const state = sessionState.current;
        if (!state!.isFinished && state!.isStarted) {
            const isQuit = window.confirm("Your session is unfinished!\nAre you sure you want to quit?");
            if (isQuit) logSession(isFinished);
        } else if (state!.isFinished) {
            logSession(isFinished);
        }
    }

    /** 
     * Sends current state to server upon session quit for logging
     * @param {boolean} quitSession Flag for whether exiting session before finish
     * @returns {Promise<void>}
    */
    async function logSession(quitSession : boolean) : Promise<void> {
        // Pull data of current state

        const data = sessionData.current;
        const state = sessionState.current;

        console.log("DATA:", { data });
        console.log("STATE:", { state });

        data!.quit = (state!.isFinished) ? "N" : "Y";

        const response = await fetch("api/typesession/LogSession", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        if (!response.ok) console.log(response.statusText);
    }

    /**
     * Calculates number of misspelled words after flattening cache Object
     * @param   {MisspelledWordMap} misspelledWordMap Cache of words misspelled
     * @returns {Number} Total number of misspelled words              
    */
    function calcNumMisspelled(misspelledWordMap : MisspelledWordMap) : number {
        const m = new Array();
        const t = m.concat(Object.values(misspelledWordMap));
        return t.length;
    }

    /**
     * Converts MisspelledWordMap to a string
     * @param misspelledWordMap 
     * @returns {String} String delimited by | of words misspelled
     */
    function stringifyMisspelledWords(misspelledWordMap : MisspelledWordMap) : string {
        let temp = new Array();
        temp = temp.concat(Object.values(misspelledWordMap));
        
        let modelWords = new Array<string>(temp.length);
        for (let i = 0; i < temp.length; i++) {
            const mw = temp[i].modelWord;
            console.log("MODEL WORD", mw);
            modelWords[i] = mw;
        }

        console.log(modelWords)
        return modelWords.join("|");
    }
    
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

        // Add word count
        evalInput(currentInput, wordArray[wordIndex]);
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
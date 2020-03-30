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
import { Prompt } from "react-router";

const DELIM = "|";

type TypeSessionProps = {
    userId: string;
    sonnetId: string | string[];
}

export class WordSet {
    public modelWord: string;
    public typedWord: string;
    public index: number;

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
    misspelledWords: string,
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
        /**
         * Update ref to be used at component unmount
         */

        // Return if session yet started
        if (!isStarted) return;

        // Update ref with current session data
        const data = {} as ISessionData;

        // Transfrom MisspelledWordMap into string
        const misspelledWordString = stringifyMisspelledWords(misspelledWords);

        data.userId = userId;
        data.sonnetId = currentSonnet.id;
        data.secondsElapsed = parseInt(document.getElementById("timer")!.innerHTML);
        data.numberMisspelled = calcNumMisspelled(misspelledWordString);
        data.misspelledWords = misspelledWordString;
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
        if ((!state!.isFinished && state!.isStarted) || state!.isFinished) {
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
     * @param   {String} misspelledWordString Stringified cache of words misspelled delimited by "|"
     * @returns {Number} Total number of misspelled words              
    */
    function calcNumMisspelled(misspelledWordString : string) : number {
        return misspelledWordString.split(DELIM).length;
    }

    /**
     * Converts MisspelledWordMap to a string
     * @param   {MisspelledWordMap} misspelledWordMap Hash table cache of WordSets, which encapsulate instances of misspelled words
     * @returns {String} String delimited by | of words misspelled
     */
    function stringifyMisspelledWords(misspelledWordMap: MisspelledWordMap): string {
        // Flatten hash table into two-dimensional array
        const wordSetCollection: Array<WordSet[]> = Object.values(misspelledWordMap);
        if (wordSetCollection.length < 1) return "";

        // Flatten further into one-dimensional array
        const wordSetList = new Array<WordSet>();
        wordSetCollection.forEach((wsl) => {
            for (let i = 0; i < wsl.length; i++) {
                wordSetList.push(wsl[i]);
            }
        });

        // Extract only the modelWord from each WordSet
        const modelWords = wordSetList.map(ws => ws.modelWord);

        // Stringify with delimiter
        return modelWords.join(DELIM);
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
                        <Prompt
                            when={!isFinished && isStarted}
                            message={"Are you sure you want to quit and lose this session?"} />
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
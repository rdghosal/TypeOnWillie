import React, { useContext, useState, useEffect, useRef } from "react";
import { MainContext } from "./Main";
import SessionTimer from "./SessionTimer";
import SessionScore from "./SessionScore";
import { LoadingMessage } from "./LoadingMessage";
import CurrentModelText from "./CurrentModelText";
import TypeHint from "./TypeHint";
import { Sonnet } from "./Sonnet";
import MisspelledWordList from "./MisspelledWordList";
import { AppContext } from "./App";
import { Prompt } from "react-router";
import SessionInput from "./SessionInput";
import { GuestSessionCache, SessionResult, CacheHandler } from "./GuestSessionCache";
import ResultModal from "./ResultModal";
import { clear } from "console";

const DELIM = "|";

type TypeSessionProps = {
    userId: string;
    sonnetId: string | string[];
}

export class WordTuple {
    readonly modelWord: string;
    readonly typedWord: string;
    readonly index: number; // Starts from 0
    readonly lineNumber: number; // Ranges from 1 - 14

    constructor(model: string, typed:string, index: number, lineNumber: number) {
        this.modelWord = model;
        this.typedWord = typed;        
        this.index = index;
        this.lineNumber = lineNumber;
    }
}

export interface MisspelledWordMap {
    [key: number] : Array<WordTuple>
}

interface ISessionData {
    dateTime: string,
    userId: string,
    sonnetId: number,
    secondsElapsed: number,
    misspelledWordCount: number,
    misspelledWords: Array<WordTuple>,
    correctWordCount: number,
    typedWordCount: number
    quit: string,
    touchScreen: string
}

interface ISessionState {
    isFinished: boolean,
    isStarted: boolean,
    isPaused: boolean,
    intervalId: NodeJS.Timeout | null
}

export const TypeSession: React.FC<TypeSessionProps> = ({ sonnetId, userId }) => {

    // Current Sonnet in session
    const { guestCache, setGuestCache } = useContext(AppContext);
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
    const [ intervalId, setIntervalId ] = useState<NodeJS.Timeout|null>(null);
    const [ isStarted, toggleStart ] = useState<boolean>(false);
    const [ isFinished, toggleFinish ] = useState<boolean>(false);
    const [ isPaused, togglePause ] = useState<boolean>(true);
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

        console.log("Current state: ", sessionState.current);

        // Return if session yet started
        if (!isStarted) return;

        // Update ref with current session data
        const data = {} as ISessionData;

        // Transfrom MisspelledWordMap into string
        const _misspelledWords = flattenMisspelledWords(misspelledWords);

        data.userId = userId;
        data.sonnetId = currentSonnet.id;
        data.secondsElapsed = parseInt(document.getElementById("timer")!.innerHTML);
        data.misspelledWordCount = _misspelledWords.length;
        data.misspelledWords = _misspelledWords;
        data.correctWordCount = correctWordCount;
        data.typedWordCount = currentWordCount;
        data.touchScreen = (isTouchScreen) ? "Y" : "N";

        sessionData.current = data;

        // Update state with current session state
        const state = {} as ISessionState;

        state.isFinished = isFinished;
        state.isStarted = isStarted;
        state.isPaused = isPaused;
        state.intervalId = intervalId;
        console.log("Current interval Id", intervalId);
        if (state.intervalId && (isPaused || isFinished)) {
            clearTimer(state.intervalId);
        }

        sessionState.current = state;

    }, [intervalId,
        isPaused,
        isFinished,
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
            togglePause(true);
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

        if (!state) return;
        if ((!state!.isFinished && state!.isStarted) || state!.isFinished) {
            console.log("logging..., current session", state.intervalId);

            toggleStart(false);
            toggleFinish(true);
            
            logSession(isFinished);
        }
        if (state.intervalId) {
            clearTimer(state.intervalId!);
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
        //data!.dateTime = new Date().toISOString();

        console.log("cache ", guestCache);
        if (userId === "guest") {
            //if (data!.quit === "Y") {
            const result = new SessionResult(
                data!.sonnetId, 
                data!.misspelledWords!,
                data!.correctWordCount!,
                data!.typedWordCount!,
                data!.secondsElapsed!
                );
            

            console.log("CACHE BEFORE: ", guestCache)
            CacheHandler.updateCache(guestCache, result);
            console.log("CACHE AFTER: ", guestCache)
            setGuestCache(guestCache);
            //}
        }

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
    function flattenMisspelledWords(misspelledWordMap: MisspelledWordMap): Array<WordTuple> {
        // Flatten hash table into two-dimensional array
        const wordTupleCollection: Array<WordTuple[]> = Object.values(misspelledWordMap);
        if (wordTupleCollection.length < 1) return [];

        // Flatten further into one-dimensional array
        const wordTupleList = new Array<WordTuple>();
        wordTupleCollection.forEach((wsl) => {
            for (let i = 0; i < wsl.length; i++) {
                wordTupleList.push(wsl[i]);
                console.log("misspellings ", wordTupleList);
            }
        });

        return wordTupleList;
    }
    
    function fetchSonnetById() {
        // Fetch sonnet data by sonnetId props and save to state
        fetch(`api/sonnetmenu?id=${sonnetId}`)
            .then(res => res.json())
            .then(data => setSonnet(data));
    }


    function clearTimer(id: NodeJS.Timeout) {
        console.log("Clearing interval, ", id);
        clearInterval(id);
        setIntervalId(null);
    }

    return (
        <div className="typesession">
            {
                currentSonnet
                    ? <>
                        <Prompt
                            when={isStarted && !isFinished}
                            message={"Are you sure you want to quit and lose this session?"} />
                        <h2>{ currentSonnet.title }</h2>
                        <SessionTimer 
                            intervalId={intervalId}
                            setIntervalId={setIntervalId}
                            currentWordCount={currentWordCount}
                            isStarted={isStarted} 
                            isFinished={isFinished} 
                            isPaused={isPaused}
                            clearTimer={clearTimer}/>
                        <SessionScore 
                            currentWordCount={currentWordCount} 
                            remainingWords={currentSonnet.wordCount - currentWordCount} 
                            correctWordCount={correctWordCount} />
                        { !isFinished && 
                            <CurrentModelText wordArray={wordArray} wordIndex={wordIndex} /> }
                        
                        <SessionInput 
                            wordIndex={wordIndex} 
                            setWord={setWord}
                            lineIndex={lineIndex}
                            setLine={setLine}
                            currentLine={currentLine}
                            setCurrentLine={setCurrentLine}
                            incrementCount={incrementCount}
                            incrementCorrectWords={incrementCorrectWords}
                            pushMisspelled={pushMisspelled}
                            wordArray={wordArray}
                            pushProgress={pushProgress}
                            isStarted={isStarted}
                            toggleStart={toggleStart}
                            togglePause={togglePause}
                            toggleInputType={toggleInputType}/>

                        <TypeHint endOfLine={ wordIndex === wordArray.length - 1 }/>
                        <div className="typesession__model-text">
                            { currentSonnet.lines.map((line:string, i:number) => (i > lineIndex) && <p key={i}>{line}</p>) }
                        </div>
						{ isFinished && <ResultModal completeLines={currentProgress}/> }
                      </>
                    : <LoadingMessage insertText={"your session"} />
            }
        </div>
    ) 
} 

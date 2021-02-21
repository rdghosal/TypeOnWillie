import React from 'react'
import { WordTuple, MisspelledWordMap } from './TypeSession';


type SessionInputProps = {
    wordIndex: number;
    lineIndex: number;
    wordArray: string[];
    currentLine: string[];
    isStarted: boolean;

    setWord:React.Dispatch<React.SetStateAction<number>>;
    setLine: React.Dispatch<React.SetStateAction<number>>;
    setCurrentLine: React.Dispatch<React.SetStateAction<string[]>>;
    incrementCount:React.Dispatch<React.SetStateAction<number>>;
    incrementCorrectWords:React.Dispatch<React.SetStateAction<number>>;
    pushMisspelled: React.Dispatch<React.SetStateAction<MisspelledWordMap>>;
    pushProgress: React.Dispatch<React.SetStateAction<string[]>>
    toggleStart: React.Dispatch<React.SetStateAction<boolean>>
    toggleInputType: React.Dispatch<React.SetStateAction<boolean>>
    togglePause: React.Dispatch<React.SetStateAction<boolean>>
};


const SessionInput : React.FC<SessionInputProps> = ({
        wordIndex,
        setWord,
        lineIndex,
        setLine,
        currentLine,
        setCurrentLine,
        incrementCount,
        incrementCorrectWords, 
        pushMisspelled, 
        wordArray,
        pushProgress,
        isStarted,
        toggleStart,
        toggleInputType,
        togglePause
    }) => {

    function evalInput(typedWord:string, modelWord:string) : boolean {
        // Adds to score if typed and model word are identical
        // Returns true if matching and vice-versa
        let isMatching: boolean;
        isMatching = false;

        typedWord = typedWord.replace(/\s/g, ""); // Strip all space from rear of input only
        console.log(typedWord)
        if (typedWord === modelWord) {
            incrementCorrectWords(correctWordCount => correctWordCount += 1);
            isMatching = true;
        } else {
            const currentWords = new WordTuple(modelWord, typedWord, wordIndex, lineIndex + 1);
            pushMisspelled((misspelledWords: MisspelledWordMap) => {
                console.log(misspelledWords);
                const temp = misspelledWords[lineIndex];
                let newWords = (temp) ? [...temp, currentWords] : [ currentWords ];
                return {
                    ...misspelledWords,
                    [lineIndex] : newWords
                }
            });
        }

        return isMatching;
    }

    function handleInput() {

        let isMatching : boolean;
        isMatching = false;

        const input = (document.getElementById("session-input") as HTMLInputElement);
        let currentInput = input.value;

        // Check if matching and pre/append highlighting if misspelling
        isMatching = evalInput(currentInput, wordArray[wordIndex]);
        if (!isMatching) {
            currentInput = `<span style="color:red;">${currentInput}</span>`;
        }

        // Add word count
        incrementCount(currentWordCount => currentWordCount += 1);

        if (wordIndex === wordArray.length - 1) {
            // Move to next line and beginning thereof
            setWord(0);
            setLine(lineIndex => lineIndex += 1);
            
            // Make array of words typed thus far (+ currentInput) into a string and store
            const progress = [...currentLine, currentInput].join(" ");
            pushProgress((currentProgress)=> [...currentProgress, progress]);
            setCurrentLine(() => new Array<string>()); // Reset to empty

        } else {
            // Store input and move to next word in line
            setCurrentLine(currentLine => [...currentLine, currentInput]);
            setWord(wordIndex => wordIndex += 1);
        }

        // Clear input field
        input.value = "";
    }

    const initSession = () => {
        togglePause(false);
        if (!isStarted) {
        console.log("Initing session...")
            toggleStart(true);
        }
    }

    function handleKeyUp(e : React.KeyboardEvent<HTMLInputElement>) {
        const targetKey = (wordIndex === wordArray.length - 1) ? 13 : 32;
        if (e.keyCode === targetKey) return handleInput(); 
    }

    return (
        <div>
            <input type="text" id="session-input" 
                onBlur={() => togglePause(true)}
                onKeyUp={ handleKeyUp } onClick={ initSession } onTouchStart={ initSession }/>
            
        </div>
    )
}

export default SessionInput

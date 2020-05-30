import React from 'react'
import { WordTuple, MisspelledWordMap } from './TypeSession';


type SessionInputProps = {

    wordIndex: number;
    setWord:React.Dispatch<React.SetStateAction<number>>;

    lineIndex: number;
    setLine: React.Dispatch<React.SetStateAction<number>>;

    incrementCount:React.Dispatch<React.SetStateAction<number>>;

    incrementCorrectWords:React.Dispatch<React.SetStateAction<number>>;

    pushMisspelled: React.Dispatch<React.SetStateAction<MisspelledWordMap>>;

    wordArray: string[];

    currentLine: string[];
    setCurrentLine: React.Dispatch<React.SetStateAction<string[]>>;

    pushProgress: React.Dispatch<React.SetStateAction<string[]>>

    toggleStart: React.Dispatch<React.SetStateAction<boolean>>
    toggleInputType: React.Dispatch<React.SetStateAction<boolean>>

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
        toggleStart,
        toggleInputType
    }) => {

    function evalInput(typedWord:string, modelWord:string) {
        // Adds to score if typed and model word are identical
        typedWord = typedWord.replace(/\s*$/, ""); // Strip all space from rear of input only
        if (typedWord === modelWord) {
            incrementCorrectWords(correctWordCount => correctWordCount += 1);
        } else {
            const currentWords = new WordTuple(modelWord, typedWord, wordIndex, lineIndex + 1);
            pushMisspelled((misspelledWords: MisspelledWordMap) => {
                const temp = misspelledWords[lineIndex];
                let newWords = (temp) ? [...temp, currentWords] : [ currentWords ];
                return {
                    ...misspelledWords,
                    [lineIndex] : newWords
                }
            });
        }
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

    function handleKeyUp(e : React.KeyboardEvent<HTMLInputElement>) {
        const targetKey = (wordIndex === wordArray.length - 1) ? 13 : 32;
        if (e.keyCode === targetKey) return handleInput(); 
    }

    return (
        <div>
            <input type="text" id="session-input" 
                onBlur={() => toggleStart(false)}
                onKeyUp={ handleKeyUp } onClick={() => toggleStart(true)} onTouchStart={() => toggleInputType(true)}/>
            
        </div>
    )
}

export default SessionInput

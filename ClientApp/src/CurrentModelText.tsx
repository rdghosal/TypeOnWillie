import React, { useState, useEffect, Fragment } from 'react'

type CurrentModelTextProps = {
    wordArray: string[],
    wordIndex: number
}


const CurrentModelText = ({ wordArray, wordIndex } : CurrentModelTextProps) => {

    const [ wordString, appendWord ] = useState<string>();

    useEffect(() => {
        // Load next line
        if (wordIndex < 0) return;
        appendWord(wordArray[wordIndex - 1]);
    }, [wordArray]);

    useEffect(() => {
        // Add previous word to line
        const prev = wordIndex - 1;
        if (prev < 0 || !wordArray) return;
        let newWord = (wordString) ? wordString + " " + wordArray[prev] : wordArray[prev];
        appendWord(newWord);
    }, [wordIndex]);

    return (
        <div className="typesession__model-text">
            <div className="model-text__line">
                { wordIndex > 0 ? wordString + " " : null}<h2>{ wordArray[wordIndex] }</h2>
            </div>
        </div>
    )
}

export default CurrentModelText

import React, { useState, useEffect, Fragment } from 'react'

type CurrentModelTextProps = {
    typedLine: string[],
    wordArray: string[],
    wordIndex: number
}


const CurrentModelText = ({ wordArray, wordIndex, typedLine } : CurrentModelTextProps) => {

    const [ wordString, appendWord ] = useState<string | undefined>();

    useEffect(() => {
        // Load next line
        if (wordIndex == 0) appendWord(wordArray[wordIndex - 1]);
    }, [wordArray]);

    useEffect(() => {
        // Add previous word to line
        const prev = wordIndex - 1;
        if (prev < 0 || !wordArray) return;
        let newWord = (wordString) ? wordString + " " + typedLine[prev] : typedLine[prev];
        appendWord(newWord);
    }, [wordIndex]);

    const makeCurrentLine = () : {"__html" : string } | undefined  => {

        return wordIndex > 0 ? { "__html": wordString + " " } : undefined;
    }

    return (
        <div className="typesession__model-text">
            <div className="model-text__line">
                <p className="model-text__text"
                    dangerouslySetInnerHTML={makeCurrentLine()}></p>
                <h2>{ wordArray[wordIndex] }</h2>
            </div>
        </div>
    )
}

export default CurrentModelText

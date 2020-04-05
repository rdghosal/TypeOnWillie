import React, { useState, useEffect } from 'react'
import { MisspelledWordMap, WordTuple } from './TypeSession'

type MisspelledWordListProps = {
    misspelledWords : MisspelledWordMap,
    lineIndex : number
}

const MisspelledWordList = ({ misspelledWords, lineIndex } : MisspelledWordListProps) => {

    const [ misspelledList, concatMisspelled ] = useState<Array<WordTuple>>();

    useEffect(() => {
        // Cache misspelled words as list for mapping to li els
        const temp = misspelledList;
        const currLineList = misspelledWords[lineIndex];

        // TODO get up to last word in line

        let newList; 
        if (!temp && currLineList) {
            // Init misspelledList
            newList = [ currLineList[currLineList.length - 1] ]; 
        } else if (temp && currLineList) {
            // Preserve previous and concatenate
            newList = [ ...temp, currLineList[currLineList.length - 1]];
        } else if (temp && !currLineList) {
            // New line
            newList = temp;
        }

        if (!newList) return;
        concatMisspelled(newList);
    }, [lineIndex, misspelledWords]);

    return (
        <div>
            <div className="typesession__incorrect-list">
                <ul>
                    {
                        misspelledList
                            ? misspelledList.map((wordSet: WordTuple, i: number) => <li key={i}> {wordSet.modelWord} | {wordSet.typedWord} </li>)
                            : null
                    }
                </ul>
            </div>
        </div>
    )
}

export default MisspelledWordList

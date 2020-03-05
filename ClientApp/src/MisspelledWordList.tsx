import React, { useState, useEffect } from 'react'
import { MisspelledWordMap, WordSet } from './TypeSession'

type MisspelledWordListProps = {
    misspelledWords : MisspelledWordMap,
    lineIndex : number
}

const MisspelledWordList = ({ misspelledWords, lineIndex } : MisspelledWordListProps) => {

    const [ misspelledList, concatMisspelled ] = useState<Array<WordSet>>();

    useEffect(() => {
        // Cache misspelled words as list for mapping to li els
        const temp = misspelledList;
        const currLineList = misspelledWords[lineIndex];
        let newList = (temp && currLineList) ? [...temp, currLineList[currLineList.length - 1] ] : misspelledWords[lineIndex];
        concatMisspelled(newList);
    }, [lineIndex, misspelledWords]);

    return (
        <div>
            <div className="typesession__incorrect-list">
                <ul>
                    {
                        misspelledList
                            ? misspelledList.map((wordSet: WordSet, i: number) => <li key={i}> {wordSet.modelWord} | {wordSet.typedWord} </li>)
                            : null
                    }
                </ul>
            </div>
        </div>
    )
}

export default MisspelledWordList

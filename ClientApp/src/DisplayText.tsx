import React, { useEffect, useState } from 'react'
import { Misspelling } from './SonnetDetails';

const KEY_1 = "user";
const KEY_2 = "global";

type DisplayTextProps = {
    text: string[],
    misspellings?: MisspellingDict
};

const DisplayText : React.FC<DisplayTextProps> = (props) => {

    const [innerHtml, setHtml] = useState<_InnerHtml | undefined>({ __html: ""});

    useEffect(() => { 
        const html = formatAsHtml(props.text, props.misspellings);
        setHtml({ __html: html });
    }, [props.text, props.misspellings]);

    return (
        <p dangerouslySetInnerHTML={innerHtml}>
        </p>
    )
}

type MisspellingDict = {
    [key:string] : Misspelling[],
}

function formatAsHtml(lines: string[], misspellings?: MisspellingDict) {
    let htmlString: string = "";
    let lineMatrix : number[][];
    if (misspellings) {
        lineMatrix = getMisspellingMatrix(lines, misspellings); 
    }

    lines.forEach((line : string, i : number) => {
        const words : string[] = line.split(" ");
        
        for (let j = 0; j < lineMatrix[i].length; j++) {
            let toAppend: string = "";
            
            switch (lineMatrix[i][j]) {
                
                case Scope.USER:
                    toAppend = `<mark>${words[j]}</mark>`
                    break;
                case Scope.GLOBAL:
                    toAppend = `<span style="color:red;">${words[j]}</span>`
                    break;
                case Scope.BOTH:
                    toAppend = `<span style="color:green;">${words[j]}</span>`
                    break;
                case Scope.NONE:
                    toAppend = words[j];
                    break;
            }

            htmlString += toAppend + " ";
        }

        htmlString += "<br>";
    });

    return htmlString;
}

function getMisspellingMatrix(lines: string[], misspellings: MisspellingDict) : number[][] {
    
    let matrix : number[][] = [];
    const lineLengths: number[] = getLineLengths(lines);
    const keys : string[] = Object.keys(misspellings);

    // Initialize matrix
    lineLengths.forEach((lineLen : number) => { 
        const newRow = new Array<Scope>(lineLen);
        for (let i = 0; i < lineLen; i++) {
            newRow[i] = Scope.NONE;
        }
        matrix.push(newRow);
    });

    for (var k of keys) {
        misspellings[k].forEach((m:Misspelling, i: number) => {
            const currVal = matrix[m.lineNumber - 1][m.index];
            const newVal = (k === KEY_1) ? Scope.USER : Scope.GLOBAL;
            
            matrix[m.lineNumber - 1][m.index] = (currVal > 0) ? Scope.BOTH : newVal;
        });
    }

    return matrix;
}


function getLineLengths(lines : string[]) : number[] {
    let lineLens : number[] = [];
    lines.forEach((line: string) => lineLens.push(line.split(" ").length));
    return lineLens;
}

enum Scope {
    NONE = 0,
    GLOBAL = 1,
    USER = 2,
    BOTH = 3    
}

type _InnerHtml = {
    __html : string
}

export default DisplayText

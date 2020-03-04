import React, { useEffect } from 'react'

type SessionScoreProps = {
    currentWordCount: number,
    remainingWords: number,
    correctWordCount:number
};

const SessionScore = ({ currentWordCount, remainingWords, correctWordCount } : SessionScoreProps) => {

    useEffect(() => {
        const scoreEl = document.querySelector("#correctRatio");
        if (scoreEl) {
            const correctRatio = currentWordCount === 0 
                ? 0 
                : Math.ceil(correctWordCount / currentWordCount * 100);
            scoreEl.innerHTML = correctRatio.toString();
        }
    }, [currentWordCount]);
    
    return (
        <div className="typesession__score">
            <table className="table table-dark">
                <thead>
                    <tr>
                        <th>Words Typed</th>
                        <th>Words Remaining</th>
                        <th>Percent Correct</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{currentWordCount}</td>
                        <td>{remainingWords}</td>
                        <td id="correctRatio"></td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}

export default SessionScore;
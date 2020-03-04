import React, { useEffect, useState } from 'react'

type SessionTimerProps = {
    isStarted: boolean,
    isFinished: boolean,
    currentWordCount: number
};

const SessionTimer = ({ isStarted, isFinished, currentWordCount } : SessionTimerProps) => {

    const [ intervalId, setIntervalId ] = useState<any>();

    useEffect(() => {
        if (!intervalId && !isFinished && isStarted) {
            const id = setInterval(() => incrementTime(), 1000);
            setIntervalId(id);
        } else if (isFinished) {
            clearInterval(intervalId);
        }
    }, [isStarted, isFinished]);

    useEffect(() => {
        const speedEl = document.getElementById("typingSpeed");
        const timer = document.getElementById("timer");
        if (speedEl && timer)  {
            // Get time and calculate wps
            const currentTime = parseInt(timer.innerHTML);
            const wpm = currentTime > 0 ? Math.ceil(currentWordCount / currentTime * 60) : 0;

            // Render wps to score table
            speedEl.innerHTML = wpm.toString();            
        }

    }, [currentWordCount]);

    return (
        <table className="table table-light">
            <thead>
                <tr>
                    <th>
                        Seconds Elapsed
                    </th>
                    <th>
                        Current Speed (wpm)
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td id="timer">0</td>
                    <td id="typingSpeed"></td>
                </tr>
            </tbody>
        </table>
    )
}

function incrementTime() {
    const timer = document.getElementById("timer");
    if (timer) {
        let currentTime = timer.innerHTML;
        timer.innerHTML = (parseInt(currentTime) + 1).toString();
    }
}

export default SessionTimer;
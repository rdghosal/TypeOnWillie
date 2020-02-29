import React, { useEffect, useState } from 'react'

type SessionTimerProps = {
    isFinished: boolean
};

const SessionTimer = ({ isFinished } : SessionTimerProps) => {

    const [ intervalId, setIntervalId ] = useState<any>();

    useEffect(() => {
        if (!intervalId && !isFinished) {
            const id = setInterval(() => incrementTime(), 1000);
            setIntervalId(id);
        } else if (isFinished) {
            clearInterval(intervalId);
        }
    }, [isFinished]);

    return (
        <div className="typesession__timer">
            0
        </div>
    )
}

function incrementTime() {
    const timer = document.querySelector(".typesession__timer");
    if (timer) {
        let currentTime = timer.innerHTML;
        timer.innerHTML = (parseInt(currentTime) + 1).toString();
    }
}

export default SessionTimer;
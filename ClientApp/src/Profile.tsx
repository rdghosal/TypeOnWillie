import React, { useEffect, useState, useContext } from 'react';
import ProgressLine from './ProgressLine';
import SkillsGraph from './SkillsGraph';
import Navbar from './Navbar';
import { AppContext } from './App';
import { User } from "./AuthUtils"
import { LoadingMessage } from './LoadingMessage';

export const Profile : React.FC = () => {

    const { user, accessToken, setUser } = useContext(AppContext);
    const [ profileData, setProfile ] = useState<Profile | null>(null);
    const [ scoreType, setScoreType ] = useState<ScoreType>(ScoreType.ACCURACY);
    const [ dateType, setDateType ] = useState<DateType>(DateType.MONTH);
    const [ progressLineData, setProgressLine ] = useState<Array<ScorePoint>|null>(null);
    const [ skillsGraphData, setSkillsGraph ] = useState<UserMetrics|null>(null);

    useEffect(() => {
        if(!user) {
            return;
        }

        if (!profileData) {
            fetch("/api/profile/", {
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ // TODO make params class
                    userId : user.id, 
                    currentDate : new Date().toISOString()
                })

            }).then(resp => {
                if (!resp.ok) {
                    return console.log("Failed to fetch profile!");
                }

                return resp.json();
            }).then(data => {
                setProfile(data.userData);
                setProgressLine(ScoreFactory(data.userData.scores, scoreType, dateType));
                setSkillsGraph(data.userData.metrics);
            }); 
        }

    }, [user]);

    if (!profileData || !user) {
        return (
            <>
            <Navbar />
            <LoadingMessage insertText={"profile"} />
            </>
        );
    }

    return (
            <>
                <Navbar />
                <div className="container-fluid profile__container"> 
                    <div className="col-8 profile__greeting">Welcome back, {user.username}</div>
                    <div className="col-8 profile__global-stats"></div>
                    <div className="profile__user-stats container-fluid">
                        { progressLineData && <ProgressLine data={progressLineData} />}
                        { skillsGraphData && <SkillsGraph data={skillsGraphData} /> }
                    </div>
                    <div className="profile__controls container-fluid">
                        <select name="progressType">
                            <option value={ScoreType.ACCURACY}>Accuracy</option>
                            <option value={ScoreType.WPM}>WPM</option>
                            <option value={ScoreType.TIME}>Time</option>
                        </select>
                        <div className="controls__date">
                            <input type="radio" name="" id=""/>
                        </div>
                    </div>
                </div>
            </>
    );
}

type Profile = {
    user: User,
    scores: Array<ScoreCollection>,
    metrics: UserMetrics,
    records: RecordCollection,
    topMisspellings: Array<string>
};


export type UserMetrics = {
    punctuation : number,
    capitalLetters : number,
    averageAccuracy : number,
    averageWpm : number, 
    averageTime : number
};

export type RecordCollection = {

    favoriteSonnet: number,
    topTime: number,
    topAccuracy: number, // make into tuple w/ date?
    topWpm: number

};

export type ScoreCollection = {
    averageAccuracy?: number,
    averageWpm?: number,
    averageTime?: number,
    month?: Date,
    day?: Date
};

export class ScorePoint {

    private readonly _x : Date;
    private readonly _y : number;

    constructor(x: Date, y: number) {
        this._x = x;
        this._y = y;
    }
}

export enum ScoreType {
    ACCURACY,
    WPM,
    TIME
};

export enum DateType {
    MONTH,
    DAY
};

function ScoreFactory(scoreData: Array<ScoreCollection>, scoreType : ScoreType, dateType: DateType) : Array<ScorePoint> {

    return scoreData.map(data => {
        
        let x : Date;
        let y : number;

        x = (dateType === DateType.MONTH) ? data.month! : data.day!;

        switch (scoreType) {
            case ScoreType.ACCURACY:
                y = data.averageAccuracy!;
                break;
            case ScoreType.WPM:
                y = data.averageWpm!;
                break;
            case ScoreType.TIME:
                y = data.averageTime!;
                break;
            default:
                break;
        }

        const p = new ScorePoint(x, y!);
        return p;
    });
}


import React, { useEffect, useState, useContext, ChangeEvent } from 'react';
import ProgressLine from './ProgressLine';
import SkillsGraph from './SkillsGraph';
import Navbar from './Navbar';
import { AppContext } from './App';
import { User } from "./AuthUtils"
import { LoadingMessage } from './LoadingMessage';
import RecordsTable from './RecordsTable';

export const Profile : React.FC = () => {

    const { user } = useContext(AppContext);
    const [ profileData, setProfile ] = useState<Profile|null>(null);
    const [ scoreType, setScoreType ] = useState<ScoreType>(ScoreType.ACCURACY);
    const [ dateType, setDateType ] = useState<DateType>(DateType.MONTH);
    const [ selectMonth, setMonth ] = useState<number|null>(null);
    const [ selectYear, setYear ] = useState<number|null>(null);
    const [ progressLineData, setProgressLine ] = useState<Array<ScorePoint>|null>(null);
    const [ skillsGraphData, setSkillsGraph ] = useState<SkillsGraphData|null>(null);

    useEffect(() => {
        if(!user) {
            return;
        }

        if (!profileData) {
            const url = (user.id === "guest") ? "/api/profile/guest" : "api/profile";

            fetch(url, {
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ // TODO make params class
                    userId : user.id, 
                    month: (selectMonth) ? selectMonth : null,
                    year: (selectMonth) ? selectYear : null,
                    currentDate : (dateType === DateType.MONTH) ? new Date().toISOString(): null
                })

            }).then(resp => {
                if (!resp.ok) {
                    return console.log("Failed to fetch profile!");
                }

                return resp.json();
            }).then(data => {
                setProfile(data.userData);
                setProgressLine(scoreFactory(data.userData.scores, scoreType, dateType));
                setSkillsGraph(skillsDataFactory(data.userData.metrics));
            }); 
        }

    }, [user, scoreType, dateType]);

    const handleRadioChange = (e : React.ChangeEvent<HTMLInputElement>) => {
        setDateType(parseInt(e.target.value));
        
    };

    const handleSelect = (e: React.SyntheticEvent<HTMLSelectElement>) => {
        setScoreType(parseInt(e.currentTarget.value));    
    };

    const handleDateInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.id === "selMonth") {
            return setMonth(parseInt(e.target.value));
        }

        let year = parseInt(e.target.value);
        const currYear = new Date().getFullYear();

        if (year < 2018 && year > currYear) {
            year = currYear
        }

        return setYear(year);
    };

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
                        <RecordsTable data={profileData.records} />
                        { progressLineData && <ProgressLine data={progressLineData} />}
                        { skillsGraphData && <SkillsGraph data={skillsGraphData} /> }
                    </div>
                    <div className="profile__controls container-fluid">
                        <select name="progressType" onSelect={e => handleSelect(e)}>
                            <option value={ScoreType.ACCURACY}>Accuracy</option>
                            <option value={ScoreType.WPM}>WPM</option>
                            <option value={ScoreType.TIME}>Time</option>
                        </select>
                        <div className="controls__date">
                            <input type="radio" name="dateType" value={DateType.MONTH}
                                onChange={e => handleRadioChange(e)}/>
                            <input type="radio" name="dateType" value={DateType.DAY}
                                onChange={e => handleRadioChange(e)}/>
                                {
                                    dateType === DateType.MONTH &&
                                        <div className="container">
                                            <input type="month" name="month" 
                                                id="selMonth" onChange={e => handleDateInput(e)}/>
                                            <input type="number" name="year" 
                                                id="selYear" onChange={e => handleDateInput(e)}/> 
                                        </div>
                                }
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

export type SkillsGraphData = {
    labels: Array<string>,
    datasets: Array<SkillsGraphDataset>
};

export type SkillsGraphDataset = {
    userData: Array<number>
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

function skillsDataFactory(userMetrics : UserMetrics) : SkillsGraphData {
    
    const skillsDataset = {
        labels: ["Punctuation", "CapitalLetters", "AverageAccuracy", "AverageWpm", "AverageTime"],
        datasets: [{
            userData: [
                userMetrics.punctuation,
                userMetrics.capitalLetters,
                userMetrics.averageAccuracy,
                userMetrics.averageWpm,
                userMetrics.averageTime
            ]
        }]
    };

    return skillsDataset;
}


function scoreFactory(scoreData: Array<ScoreCollection>, scoreType : ScoreType, dateType: DateType) : Array<ScorePoint> {

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
import React, { useEffect, useState, useContext, ChangeEvent } from 'react';
import ProgressLine from './ProgressLine';
import SkillsGraph from './SkillsGraph';
import Navbar from './Navbar';
import { AppContext } from './App';
import { User } from "./AuthUtils"
import { LoadingMessage } from './LoadingMessage';
import RecordsTable from './RecordsTable';

export const Profile: React.FC = () => {

    const { user } = useContext(AppContext);
    const [profileData, setProfile] = useState<Profile | null>(null);
    const [scoreType, setScoreType] = useState<ScoreType | null>(ScoreType.ACCURACY);
    const [dateType, setDateType] = useState<DateType | null>(null);
    const [selectMonth, setMonth] = useState<number | null>(null);
    const [selectYear, setYear] = useState<number | null>(null);
    const [progressLineData, setProgressLine] = useState<ScoreData|null>(null);
    const [skillsGraphData, setSkillsGraph] = useState<SkillsGraphData | null>(null);

    useEffect(() => {
        if (!user) {
            return;
        }

        if (!profileData) {
            const url = (user.id === "guest") ? "/api/profile/guest" : "api/profile";

            fetch(url, {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ // TODO make params class
                    userId: user.id,
                    month: (selectMonth) ? selectMonth : 10,
                    year: (selectMonth) ? selectYear : new Date().getFullYear() - 2,
                    currentDate: (dateType === DateType.MONTH) ? new Date().toISOString() : null
                })

            }).then(resp => {
                if (!resp.ok) {
                    return console.log("Failed to fetch profile!");
                }

                return resp.json();
            }).then(data => {
                console.log(data)
                setProfile(data.userData);
                console.log(scoreFactory(data.userData.scores, scoreType!, dateType!))
                setProgressLine(scoreFactory(data.userData.scores, scoreType!, dateType!));
                setSkillsGraph(skillsDataFactory(data.userData.metrics, data.overallData.metrics));
            });
        }

    }, [user, scoreType, dateType]);

    useEffect(() => {
        if (!profileData) return;
        setProgressLine(scoreFactory(profileData.scores, scoreType!, dateType!));
    }, [scoreType]);

    const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDateType(parseInt(e.target.value));

    };

    const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setScoreType(parseInt(e.currentTarget.value));
        console.log(`Changed score type from ${scoreType}`)
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
            <div className="container profile__container">
                <div className="col-8 profile__greeting">Welcome back, {user.username}</div>
                <div className="col-8 profile__global-stats"></div>
                <div className="profile__user-stats container-fluid">
                    <RecordsTable data={profileData.records} />
                    {progressLineData && <ProgressLine data={progressLineData} />}
                    {skillsGraphData && <SkillsGraph data={skillsGraphData} />}
                </div>
                <div className="profile__controls container-fluid">
                    <select name="progressType" onChange={e => handleSelect(e)}>
                        <option value={ScoreType.ACCURACY}>Accuracy</option>
                        <option value={ScoreType.WPM}>WPM</option>
                        <option value={ScoreType.TIME}>Time</option>
                    </select>
                    <div className="controls__date">
                        <input type="radio" name="dateType" value={DateType.MONTH}
                            onChange={e => handleRadioChange(e)} />
                        <input type="radio" name="dateType" value={DateType.DAY}
                            onChange={e => handleRadioChange(e)} />
                        {
                            dateType === DateType.MONTH &&
                            <div className="container">
                                <input type="month" name="month"
                                    id="selMonth" onChange={e => handleDateInput(e)} />
                                <input type="number" name="year"
                                    id="selYear" onChange={e => handleDateInput(e)} />
                            </div>
                        }
                    </div>
                </div>
            </div>
        </>
    );
};

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


export class ScoreData {

    private _labels: string[] = []
    private _data: number[] = []
    private readonly _dateType: DateType;
    private readonly _scoreType: ScoreType;


    constructor(dt: DateType, st: ScoreType) {
        this._dateType = dt;
        this._scoreType = st;
    }

    public get labels() {
        return this._labels;
    }

    public get data() {
        return this._data;
    }

    private _getScoreName() {

        let scoreName = "";

        switch (this._scoreType) {
            case ScoreType.ACCURACY:
                scoreName = "Accuracy";
                break;
            case ScoreType.WPM:
                scoreName = "Words Per Minute (WPM)";
                break;
            case ScoreType.TIME:
                scoreName = "Elapsed Time (s)";
                break;
            default:
                break;
        }

        return scoreName;
    }

    public getChartData() {
        return {
            labels: this.labels,
            datasets: [{
                label: this._getScoreName(),
                data: this._data
            }]
        }
    }

    public addLabel(s: ScoreCollection) {
        const label = (this._dateType === DateType.MONTH) ? s.month! : s.day!;
        this._labels.push(label.toString());
    }

    public addData(s: ScoreCollection) {
        switch (this._scoreType) {
            case ScoreType.ACCURACY:
                this._data.push(s.averageAccuracy!);
                break;
            case ScoreType.WPM:
                this._data.push(s.averageWpm!);
                break;
            case ScoreType.TIME:
                this._data.push(s.averageTime!);
                break;
            default:
                console.log(`Invalid data ${s}`);
                break;
        }

    }

}


export type SkillsGraphData = {
    labels: Array<string>,
    datasets: Array<SkillsGraphDataset>
};

export type SkillsGraphDataset = {
    data: Array<number>,
    label: string
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

function skillsDataFactory(userMetrics : UserMetrics, overallMetrics: UserMetrics) : SkillsGraphData {
    
    const skillsDataset = {
        labels: ["Punctuation", "CapitalLetters", "AverageAccuracy", "AverageWpm", "AverageTime"],
        datasets: [{
            data: [
                userMetrics.punctuation,
                userMetrics.capitalLetters,
                userMetrics.averageAccuracy,
                userMetrics.averageWpm,
                userMetrics.averageTime
            ],
            label: "User"
        },{
            data: [
                overallMetrics.punctuation,
                overallMetrics.capitalLetters,
                overallMetrics.averageAccuracy,
                overallMetrics.averageWpm,
                overallMetrics.averageTime
            ],
            label: "Worldwide"
        }]
    };

    return skillsDataset;
}


function scoreFactory(scores: Array<ScoreCollection>, scoreType : ScoreType, dateType: DateType) : ScoreData {

    const scoreData = new ScoreData(dateType, scoreType);

    scores.forEach(data => {
        scoreData.addData(data);
        scoreData.addLabel(data);
    });

    return scoreData;
}
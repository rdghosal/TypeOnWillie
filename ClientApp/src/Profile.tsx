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
    const [timeScale, setScaleType] = useState<ScaleType>(ScaleType.YEAR);
    //const [selectMonth, setMonth] = useState<number | null>(null);
    //const [selectYear, setYear] = useState<number | null>(null);
    const [selectDate, setDate] = useState<string|null>(null);
    const [progressLineData, setProgressLine] = useState<ScoreData|null>(null);
    const [skillsGraphData, setSkillsGraph] = useState<SkillsGraphData | null>(null);

    useEffect(() => {
        if (!user) {
            return;
        }

        const url = (user.id === "guest") ? "/api/profile/guest" : "api/profile";

        fetch(url, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ // TODO make params class
                userId: user.id,
                endDate: (timeScale === ScaleType.YEAR) ? new Date().toISOString() : getEndDate(selectDate!),
                timeScale: timeScale
            })

        }).then(resp => {
            if (!resp.ok) {
                return console.log("Failed to fetch profile!");
            }

            return resp.json();
        }).then(data => {
            console.log(data)
            setProfile(data);
            console.log(scoreFactory(data.scores, scoreType!, timeScale!))
            setProgressLine(scoreFactory(data.scores, scoreType!, timeScale!));
            setSkillsGraph(skillsDataFactory(data.percentiles));
        });

    }, [user, scoreType, selectDate]);

    useEffect(() => {
        if (profileData && timeScale === ScaleType.YEAR) {
            (document.getElementById("monthYearInput") as HTMLInputElement).disabled = true;
        }
    }, [profileData]);

    useEffect(() => {
        if (!profileData) return;
        setProgressLine(scoreFactory(profileData.scores, scoreType!, timeScale!));
    }, [scoreType]);

    useEffect(() => {

        if (!profileData) {
            console.log("No profile!")
            return;
        }

        const inputEl = (document.getElementById("monthYearInput") as HTMLInputElement);

        let isDisabled = false;
        if (timeScale === ScaleType.YEAR) {
            console.log("Setting to YEAR");
            setDate(new Date().toISOString());
            inputEl.value = "";
            isDisabled = true;
        } 

        inputEl.disabled = isDisabled;

    }, [timeScale]);

    const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log("SCALE", e.target.value);
        setScaleType(parseInt(e.target.value));
    };

    const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setScoreType(parseInt(e.currentTarget.value));
        console.log(`Changed score type from ${scoreType}`)
    };

    const handleDateInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        // TODO: setDate
        console.log(e.target.value);
        const date = e.target.value;
        if (!date) {
            return;
        } else if (date.length < 7) {
            return alert("Select BOTH month and year!");
        }
        
        setDate(e.target.value);
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
                <div className="container">
                    <input type="month" className="form-control" name="month"
                        min="2018-01" max={new Date().toISOString().substring(0, 7)}
                        id="monthYearInput" onBlur={e => handleDateInput(e)} />
                </div>
                <div className="profile__controls container-fluid">
                    <select name="progressType" onChange={e => handleSelect(e)}>
                        <option value={ScoreType.ACCURACY}>Accuracy</option>
                        <option value={ScoreType.WPM}>WPM</option>
                        <option value={ScoreType.TIME}>Time</option>
                    </select>
                    <div className="controls__date">
                        <label htmlFor="byCurrentDate">The last 12 months</label>
                        <input type="radio" name="timeScale" id="byCurrentDate" value={ScaleType.YEAR}
                            onChange={e => handleRadioChange(e)} defaultChecked />
                        <label htmlFor="bySelectDate">For a select year and month</label>
                        <input type="radio" name="timeScale" id="bySelectDate" value={ScaleType.MONTH}
                            onChange={e => handleRadioChange(e)} />
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
    percentiles: Array<PercentileCollection>,
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

export type PercentileCollection = {
    punctuationPercentile: number,
    capitalLetterPercentile: number,
    accuracyPercentile: number,
    wpmPercentile: number,
    timePercentile: number
}

export type RecordCollection = {
    bestAccuracySonnet: number,
    worstAccuracySonnet: number,
    bestAccuracy: number, // make into tuple w/ date?
    worstAccuracy: number, // make into tuple w/ date?

    bestTimeSonnet: number,
    worstTimeSonnet: number,
    bestTime: number,
    worstTime: number,

    bestWpmSonnet: number, // make into tuple w/ date?
    worstWpmSonnet: number, // make into tuple w/ date?
    bestWpm: number
    worstWpm: number
};

export type ScoreCollection = {
    averageAccuracy?: number,
    averageWpm?: number,
    averageTime?: number,
    year?: number,
    month?: number,
    day?: number
};


export class ScoreData {

    private _labels: string[] = []
    private _data: number[] = []
    private readonly _timeScale: ScaleType;
    private readonly _scoreType: ScoreType;


    constructor(dt: ScaleType, st: ScoreType) {
        this._timeScale = dt;
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
        const label = (this._timeScale === ScaleType.YEAR)
            ? `${s.year!.toString()}-${s.month!.toString()}`
            : `${s.year!.toString()}-${s.month!.toString()}-${s.day!.toString()}`;

        this._labels.push(label);
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

export enum ScaleType {
    YEAR,
    MONTH
};

function skillsDataFactory(percentiles : PercentileCollection) : SkillsGraphData {
    
    const skillsDataset = {
        labels: ["Punctuation", "CapitalLetters", "Accuracy", "Wpm", "Time"],
        datasets: [{
            data: [
                percentiles.punctuationPercentile,
                percentiles.capitalLetterPercentile,
                percentiles.accuracyPercentile,
                percentiles.wpmPercentile,
                percentiles.timePercentile
            ],
            label: "User"
        }]
    };

    return skillsDataset;
}


function scoreFactory(scores: Array<ScoreCollection>, scoreType : ScoreType, timeScale: ScaleType) : ScoreData {

    const scoreData = new ScoreData(timeScale, scoreType);

    scores.forEach(data => {
        scoreData.addData(data);
        scoreData.addLabel(data);
    });

    return scoreData;
}

function getEndDate(inDate: string): string {
    return inDate + "-01";
}
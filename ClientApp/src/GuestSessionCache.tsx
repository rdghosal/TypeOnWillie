import { WordTuple } from "./TypeSession";

export class GuestSessionCache {

    private static _KEY = "guestCache";
    private static _instance : GuestSessionCache | null = null;

    public topTime : number = 0;
    public topWpm : number = 0;
    public topAccuracy : number = 0;

    public resultCollection : ResultCollection = {} as ResultCollection;

    private _updateMisspellings(s: SessionResult) {

        const sId = s.sonnetId;
        const current = this.resultCollection[sId];
        const UBOUND = 5;
        
        if (!this.resultCollection[sId].results.misspellings) {
            for (let i = 0; i < UBOUND; i++) {
                this.resultCollection[sId].results.misspellings.push(s.misspellings[i]);
            }

            return;
        }

        let foundCount = 0;
        const found = new Array<number>(5);
        const notFound : number[] = [];
        
        const prevMisspellings = current.results.misspellings;
        s.misspellings.forEach((m:WordTuple, idx: number) => {
            let foundOverlap = false;
            for (let i = 0; i < prevMisspellings.length; i++) {
                const pm = prevMisspellings[i];
                if (m.index === pm.index && m.lineNumber === pm.lineNumber) {
                    foundOverlap = true;
                    found[i] = 1;
                    foundCount++;
                }
            }
            if (!foundOverlap && foundCount < UBOUND) notFound.push(idx);
        });

        while (foundCount < UBOUND) {
            for (let i = 0; i < found.length; i++) {
                if (!found[i]) {
                    this.resultCollection[sId].results.misspellings[i] = s.misspellings[notFound.pop()!];
                }
            }

            foundCount++;
        }
    }

    private _updateScores(s: SessionResult) {
        const sId = s.sonnetId;
        const current = this.resultCollection[sId];
        console.log("CURRENT", current)
        if (!current) {
            this.resultCollection[sId] = {
                count: 0,
                results: s
            };
        }

        const prevCount = this.resultCollection[sId].count;

        const prevTotalAcc = (current.results.accuracy * prevCount);
        const prevTotalTime = (current.results.time * prevCount);
        const prevTotalWpm = (current.results.wpm * prevCount);
        
        this.resultCollection[sId].count++;
        const newCount = this.resultCollection[sId].count;
        
        const newAvgAcc = (prevTotalAcc + s.accuracy) / newCount;
        const newAvgTime = (prevTotalTime + s.time) / newCount;
        const newAvgWpm  = (prevTotalWpm + s.wpm) / newCount;

        this.resultCollection[sId].results.time = newAvgTime;
        this.resultCollection[sId].results.wpm = newAvgWpm;
    }

    private _updateRecords(s: SessionResult) {
        [ s.accuracy, s.time, s.wpm ].forEach((score: number, i: number) => {
            switch (i) {
                case 0:
                    this.topAccuracy = (score > this.topAccuracy) ? score : this.topAccuracy;
                    break;
                case 1:
                    this.topTime = (score > this.topTime) ? score : this.topTime;
                    break;
                case 2:
                    this.topWpm = (score > this.topWpm) ? score : this.topWpm;
                    break;
                default:
                    break;
            }
        });
    }
    
    public static getCache() {
        if (!GuestSessionCache._instance) {
            const cache = sessionStorage.getItem(this._KEY);
            GuestSessionCache._instance = (cache === null) 
                ? new GuestSessionCache() 
                : JSON.parse(cache!);
        }
        return GuestSessionCache._instance;
    }

    public update(s: SessionResult) {
        console.log("updating")
        GuestSessionCache.getCache()!._updateScores(s);
        GuestSessionCache.getCache()!._updateRecords(s);
        GuestSessionCache.getCache()!._updateMisspellings(s);
        sessionStorage.setItem(GuestSessionCache._KEY, JSON.stringify(GuestSessionCache.getCache()));
    }

}

type ResultCollection = {
    [k: number] : {
        count: number;
        results: SessionResult;
    }
};

export class SessionResult {

    public sonnetId : number;
    public misspellings: WordTuple[];
    public accuracy: number;
    public wpm: number;
    public time: number;

    constructor(sId: number, m: WordTuple[], correctWc: number, typedWc: number, time: number) {
        this.sonnetId = sId;
        this.misspellings = m;
        this.accuracy = correctWc/typedWc;
        this.wpm = typedWc/time * 60.0;
        this.time = time;
    }

}


import { WordTuple } from "./TypeSession";

export class GuestSessionCache {

    private static _KEY = "guestCache";
    private static _instance : GuestSessionCache | null = null;

    public topTime : number = 0;
    public topWpm : number = 0;
    public topAccuracy : number = 0;

    public resultCollection : ResultCollection = {} as ResultCollection;

    public static getCache() {
        if (!GuestSessionCache._instance) {
            const cache = sessionStorage.getItem(this._KEY);
            GuestSessionCache._instance = (cache === null) 
                ? new GuestSessionCache() 
                : JSON.parse(cache!);
        }
        return GuestSessionCache._instance;
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


export class CacheHandler {

    private static readonly _STORAGE_KEY = "guestCache";

    public static updateCache(cache: GuestSessionCache, s: SessionResult) {
        console.log("updating")
        CacheHandler._updateScores(cache, s);
        CacheHandler._updateRecords(cache, s);
        CacheHandler._updateMisspellings(GuestSessionCache.getCache()!, s);
        sessionStorage.setItem(CacheHandler._STORAGE_KEY, JSON.stringify(cache));
    }

    private static _updateScores(gsc: GuestSessionCache, s: SessionResult) {
        const sId = s.sonnetId;
        const current = gsc.resultCollection[sId];
        console.log("CURRENT", current)
        if (!current) {
            gsc.resultCollection[sId] = {
                count: 0,
                results: s
            };

            return;
        }

        const prevCount = gsc.resultCollection[sId].count;

        const prevTotalAcc = (current.results.accuracy * prevCount);
        const prevTotalTime = (current.results.time * prevCount);
        const prevTotalWpm = (current.results.wpm * prevCount);
        
        gsc.resultCollection[sId].count++;
        const newCount = gsc.resultCollection[sId].count;
        
        const newAvgAcc = (prevTotalAcc + s.accuracy) / newCount;
        const newAvgTime = (prevTotalTime + s.time) / newCount;
        const newAvgWpm  = (prevTotalWpm + s.wpm) / newCount;

        gsc.resultCollection[sId].results.time = newAvgTime;
        gsc.resultCollection[sId].results.wpm = newAvgWpm;
    }

    private static _updateRecords(gsc: GuestSessionCache, s: SessionResult) {
        [ s.accuracy, s.time, s.wpm ].forEach((score: number, i: number) => {
            switch (i) {
                case 0:
                    gsc.topAccuracy = (score > gsc.topAccuracy) ? score : gsc.topAccuracy;
                    break;
                case 1:
                    gsc.topTime = (score < gsc.topTime || gsc.topTime === 0) ? score : gsc.topTime;
                    break;
                case 2:
                    gsc.topWpm = (score > gsc.topWpm) ? score : gsc.topWpm;
                    break;
                default:
                    break;
            }
        });
    }

    private static _updateMisspellings(gsc: GuestSessionCache, s: SessionResult) {

        console.log("Updating misspellings\nHere's the guest cache ", gsc);

        const sId = s.sonnetId;
        const current = gsc.resultCollection[sId];
        const UBOUND = 5;
        
        const temp = new Array<WordTuple>();

        // TODO : Add algorithm to randomize misspellings added when over 5
        for (let i = 0; i < UBOUND; i++) {
            temp.push(s.misspellings[i]);
        }

        gsc.resultCollection[sId].results.misspellings = temp;

        return;
        //if (!gsc.resultCollection[sId].results.misspellings) {
        //    for (let i = 0; i < UBOUND; i++) {
        //        gsc.resultCollection[sId].results.misspellings.push(s.misspellings[i]);
        //    }

        //    return;
        //}

        //let foundCount = 0;
        //const found = new Array<number>(5);
        //const notFound : number[] = [];
        
        //const prevMisspellings = current.results.misspellings;
        //console.log("Previous: ", prevMisspellings);
        //console.log("New: ", s.misspellings);
        //s.misspellings.forEach((m:WordTuple, idx: number) => {
        //    let foundOverlap = false;
        //    for (let i = 0; i < prevMisspellings.length; i++) {
        //        const pm = prevMisspellings[i];
        //        if (m.index === pm.index && m.lineNumber === pm.lineNumber) {
        //            foundOverlap = true;
        //            found[i] = 1;
        //            foundCount++;
        //        }
        //    }
        //    if (!foundOverlap && foundCount < UBOUND) notFound.push(idx);
        //});

        //while (foundCount < UBOUND) {
        //    for (let i = 0; i < found.length; i++) {
        //        if (!found[i]) {
        //            gsc.resultCollection[sId].results.misspellings[i] = s.misspellings[notFound.pop()!];
        //        }
        //    }

        //    foundCount++;
        //}
    }


}

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var GuestSessionCache = /** @class */ (function () {
    function GuestSessionCache() {
        this.topTime = 0;
        this.topWpm = 0;
        this.topAccuracy = 0;
        this.resultCollection = {};
    }
    GuestSessionCache.getCache = function () {
        if (!GuestSessionCache._instance) {
            var cache = sessionStorage.getItem(this._KEY);
            GuestSessionCache._instance = (cache === null)
                ? new GuestSessionCache()
                : JSON.parse(cache);
        }
        return GuestSessionCache._instance;
    };
    GuestSessionCache._KEY = "guestCache";
    GuestSessionCache._instance = null;
    return GuestSessionCache;
}());
exports.GuestSessionCache = GuestSessionCache;
var SessionResult = /** @class */ (function () {
    function SessionResult(sId, m, correctWc, typedWc, time) {
        this.sonnetId = sId;
        this.misspellings = m;
        this.accuracy = correctWc / typedWc;
        this.wpm = typedWc / time * 60.0;
        this.time = time;
    }
    return SessionResult;
}());
exports.SessionResult = SessionResult;
var CacheHandler = /** @class */ (function () {
    function CacheHandler() {
    }
    CacheHandler.updateCache = function (cache, s) {
        console.log("updating");
        CacheHandler._updateScores(cache, s);
        CacheHandler._updateRecords(cache, s);
        CacheHandler._updateMisspellings(GuestSessionCache.getCache(), s);
        sessionStorage.setItem(CacheHandler._STORAGE_KEY, JSON.stringify(cache));
    };
    CacheHandler._updateScores = function (gsc, s) {
        var sId = s.sonnetId;
        var current = gsc.resultCollection[sId];
        console.log("CURRENT", current);
        if (!current) {
            gsc.resultCollection[sId] = {
                count: 0,
                results: s
            };
            return;
        }
        var prevCount = gsc.resultCollection[sId].count;
        var prevTotalAcc = (current.results.accuracy * prevCount);
        var prevTotalTime = (current.results.time * prevCount);
        var prevTotalWpm = (current.results.wpm * prevCount);
        gsc.resultCollection[sId].count++;
        var newCount = gsc.resultCollection[sId].count;
        var newAvgAcc = (prevTotalAcc + s.accuracy) / newCount;
        var newAvgTime = (prevTotalTime + s.time) / newCount;
        var newAvgWpm = (prevTotalWpm + s.wpm) / newCount;
        gsc.resultCollection[sId].results.time = newAvgTime;
        gsc.resultCollection[sId].results.wpm = newAvgWpm;
    };
    CacheHandler._updateRecords = function (gsc, s) {
        [s.accuracy, s.time, s.wpm].forEach(function (score, i) {
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
    };
    CacheHandler._updateMisspellings = function (gsc, s) {
        console.log("Updating misspellings\nHere's the guest cache ", gsc);
        var sId = s.sonnetId;
        var current = gsc.resultCollection[sId];
        var UBOUND = 5;
        var temp = new Array();
        for (var i = 0; i < UBOUND; i++) {
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
    };
    CacheHandler._STORAGE_KEY = "guestCache";
    return CacheHandler;
}());
exports.CacheHandler = CacheHandler;
//# sourceMappingURL=GuestSessionCache.js.map
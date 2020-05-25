"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Sonnet = /** @class */ (function () {
    function Sonnet(sonnetId, sonnetNumber, sonnetLines, sonnetWordCount, hasHistory) {
        this._id = sonnetId;
        this._title = sonnetNumber;
        this._lines = sonnetLines;
        this._wordCount = sonnetWordCount;
        this._hasHistory = hasHistory;
    }
    Object.defineProperty(Sonnet.prototype, "id", {
        get: function () {
            return this._id;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sonnet.prototype, "title", {
        get: function () {
            return this._title;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sonnet.prototype, "lines", {
        get: function () {
            return this._lines;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sonnet.prototype, "wordCount", {
        get: function () {
            return this._wordCount;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sonnet.prototype, "hasHistory", {
        get: function () {
            return this._hasHistory;
        },
        enumerable: true,
        configurable: true
    });
    // Max sonnet lines
    Sonnet.MAX_LINES = 14;
    return Sonnet;
}());
exports.Sonnet = Sonnet;
var HistoryFlag;
(function (HistoryFlag) {
    HistoryFlag[HistoryFlag["FALSE"] = 0] = "FALSE";
    HistoryFlag[HistoryFlag["TRUE"] = 1] = "TRUE";
})(HistoryFlag = exports.HistoryFlag || (exports.HistoryFlag = {}));
;
//# sourceMappingURL=Sonnet.js.map
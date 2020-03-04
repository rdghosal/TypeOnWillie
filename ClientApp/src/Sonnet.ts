export default class Sonnet {

    // Max sonnet lines
    static MAX_LINES: number = 14;

    // SonnetId
    private readonly _id : number;
    public get id() : number {
        return this._id;
    }

    // E.g. 'Sonnet IX' etc.
    private readonly _title : string;
    public get title() : string {
        return this._title;
    }

    // L1-14 of sonnet
    private readonly _lines : string[];
    public get lines() : string[] {
        return this._lines;
    }

    // Number of words
    private readonly _wordCount : number;
    public get wordCount() : number {
        return this._wordCount;
    }
    
    public constructor(sonnetId: number, sonnetNumber: string, sonnetLines: string[], sonnetWordCount: number) {
        this._id = sonnetId;
        this._title = sonnetNumber;
        this._lines = sonnetLines;
        this._wordCount = sonnetWordCount;
    }
}

export default class Sonnet {
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
    private readonly _text : string[];
    public get text() : string[] {
        return this._text;
    }
    
    public constructor(sonnetId: number, sonnetNumber: string, sonnetText: string) {
        this._id = sonnetId;
        this._title = sonnetNumber;
        this._text = sonnetText.split("|"); // Delimiters used in database
    }
}

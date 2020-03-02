class GeeoWebPage {
    private text: string = null;
    private parsed: string = null;
    constructor(text: string) {
        this.text = text;
    }
    public build(): string {
        this.parse(this.text);
        return this.parsed;
    }
    private parse(text: string) {
        this.parsed = text;
    }
}

import * as fs from 'fs';
export default class GeeoPage {
    private url: string = '';
    private unparsedContent = '';
    private static TAG_REGEX = /(\<\w+(?:\/)?\>)(.*)(\<\/\w+\>)/gm;
    constructor(url: string) {
        this.url = url;
        this.unparsedContent = fs.readFileSync(this.url).toString();
        this.load();
    }
    public load(): void {
        let x = this.unparsedContent
            .trim()
            .replace(/\r\n/gm, '<NL>')
            .replace(/\s+/gm, '')
            .split(GeeoPage.TAG_REGEX)
            .splice(1, 3);

        console.log(x);
    }
    public preparse() {
        let x = this.unparsedContent
            .trim()
            .replace(/\r\n/gm, '<NL>')
            .replace(/\s+/gm, '')
            .split(GeeoPage.TAG_REGEX);
    }
    public create(): string {
        return;
    }
}

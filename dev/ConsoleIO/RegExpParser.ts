export default function RegExpParser(s: string): RegExp {
    let result: RegExp;
    let res: string = '';
    let splitted = s.split(' ');
    if (splitted.length == 0) {
        result = null;
    } else {
        splitted.forEach((item: string) => {
            if (item.startsWith('<') && item.endsWith('>')) {
                let match = item.substring(1, item.length - 1).split(':');
                let group_name = match[0];
                let type = match[1];
                let length = "+";
                if(match.length == 3){
                    length = match[2];
                }
                let typer = '';
                switch (type) {
                    case 'any':
                        typer = '.*';
                        length = "";
                        break;
                    case 'number':
                        typer = '\\d+';
                        break;
                    case 'dnumber':
                        typer = '\\d+[\\.\\,]\\d+';
                        break;
                    default:

                        break;
                }
                res = res.concat(`(${typer})${length}`);
            } else {
                res = res.concat(`(?:${item}\\s+)`);
            }
            if(res.substring(res.length - 4, res.length - 1) !== '\\s+'){
                res = res.concat('\\s+');
            }
        });
        res = res.substring(0, res.length - 3);
        result = new RegExp(res, 'g');
    }

    return result;
}

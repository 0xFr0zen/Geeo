import express from 'express';
export function prepareRoutes(r: express.Router, logic: any): express.Router {
    let all_logics: any = logic.all;
    for (const iterator in all_logics) {
        let entries = Object.entries(all_logics[iterator]);
        entries.forEach((route: any) => {
            const y = Object.keys(route);
            y.forEach((s: any) => {
                if (typeof route[y[s]] === 'string') {
                    let d: string = route[y[s]];
                    let rr = route[1]();
                    let linkname = rr[0];
                    let fn = rr[1];
                    switch (d) {
                        case 'post':
                            r.post(linkname, fn);
                            break;
                        case 'get':
                            r.get(linkname, fn);
                            break;
                        default:
                            r.use(linkname, fn);
                            break;
                    }
                }
            });
        });
    }
    return r;
}

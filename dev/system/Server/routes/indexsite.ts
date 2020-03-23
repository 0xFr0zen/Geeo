import express from 'express';
import Pager from '../../Pager';

namespace indexsite {
    export function get(req: express.Request, res: express.Response) {
        let resources: Pager.Resource[] = new Array<Pager.Resource>();
        resources.push(
            new Pager.Resource('essentials.js', Pager.ResourceType.JS)
        );
        resources.push(new Pager.Resource('main.js', Pager.ResourceType.JS));
        let page = new Pager.Page(Pager.PageVersion.MAIN, resources);
        return page.render(res);
    }
}
export default indexsite;

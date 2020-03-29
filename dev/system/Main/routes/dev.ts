import express from 'express';
import Pager from '../../Pager';
namespace dev {
    export function get() {
        return [
            '/dev$',
            (req: express.Request, res: express.Response) => {
                let page = new Pager.Page(
                    Pager.PageVersion.DEV,
                    'essentials.js',
                    'main.js',
                    'main.css',
                    'loader.css'
                );
                return page.render(res);
            },
        ];
    }
}
export default dev;

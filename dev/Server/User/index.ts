import * as express from 'express';
import User from '../../User';
import Safe from '../../Entity/Safe';
import { GeeoMap } from '../../GeeoMap/index';
function UserRouter() {
    let router: express.Router = express.Router({ mergeParams: true });
    router.use('/:name/', UserNormalRouter());
    router.use('/$', function(req: express.Request, res: express.Response) {
        res.redirect('/');
    });
    return router;
}
export default UserRouter();

function UserNormalRouter() {
    let router: express.Router = express.Router({ mergeParams: true });
    router.use('/$', function(req: express.Request, res: express.Response) {
        res.render('user', { username: req.params.name });
    });
    router.use('/storages', function(
        req: express.Request,
        res: express.Response
    ) {
        let user = null;
        let name = req.params.name;
        if (name === 'me') {
            // user = User.load(name);
        } else {
            user = User.from(name);
        }
        let safes = user.getSafes();
        let showcase_safes: any[] = [];
        safes.forEach(safe => {
            let s: Safe = Safe.from(safe);
            let storage: IStorage = {
                name: s.getName(),
                created: s.getCreated(),
                space: s.getSpace(),
            };
            showcase_safes.push(storage);
        });
        res.json(showcase_safes);
    });
    return router;
}
interface IStorage {
    name: string;
    created: Date;
    space: GeeoMap<string, any>;
}

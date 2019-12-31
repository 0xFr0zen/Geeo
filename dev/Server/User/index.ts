import * as express from 'express';
import User from '../../Entity/User';
import Safe, { StorageType } from '../../Entity/Safe';
import { GeeoMap } from '../../GeeoMap/index';
import Identity from '../../Identity';
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
    router.use('/storages$', function(
        req: express.Request,
        res: express.Response
    ) {
        let user = null;
        let name = req.params.name;
        user = User.from(Identity.of(name));

        let showcase_safes: any[] = [];
        if (user != null) {
            let safes = user.getSafes();

            safes.forEach(safe => {
                if (safe.getLastLoaded() != null) {
                    let storage: IStorage = {
                        name: safe.getName(),
                        created: safe.getCreated(),
                        last_loaded: safe.getLastLoaded(),
                        space: safe.getSpace(),
                    };
                    showcase_safes.push(storage);
                }
            });
        }

        res.json(showcase_safes);
    });
    router.use('/storage/:invname', function(
        req: express.Request,
        res: express.Response
    ) {
        let user = null;
        let name = req.params.name;
        let invname = req.params.invname;
        user = User.from(Identity.of(name));
        let result: Safe = null;
        if (user != null) {
            let safes = user.getSafes();
            safes.find((safe: Safe) => {
                return safe.getName() === invname;
            });
            result = safes[0];
        }
        if (result != null) {
            res.json(JSON.parse(result.toString()).safe);
        } else {
            res.status(404).send(`Storage '${name}' not found`);
        }
    });

    router.post('/storages/:operation/:invname', function(
        req: express.Request,
        res: express.Response
    ) {
        let user: User = null;
        let result: boolean = false;
        let name: string = req.params.name;
        let invname: string = req.params.invname;

        user = User.from(Identity.of(name));

        if (user != null) {
            switch (req.params.operation) {
                case 'add':
                    console.log(`trying to add inventory '${invname}'.`);
                    user.addSafe(invname);
                    result = user.save();

                    break;
                case 'remove':
                    console.log(`trying to remove inventory '${invname}'.`);
                    
                    user.removeSafe(invname);
                    result = user.save();
                    break;
                case 'edit':
                    console.log('trying to edit inventory');
                    let safe:Safe = user.getSafe(invname);
                    // safe.addItem()
                    result = user.save();
                    break;

                default:
                    break;
            }
        }
        res.json({ added: result });
    });
    return router;
}
interface IStorage {
    name: string;
    created: Date;
    space: GeeoMap<string, any>;
    last_loaded: Date;
}

import express from 'express';
import User from '../../Entity/User';
import Safe, { Safes } from '../../Entity/Safe';
import { GeeoMap } from '../../GeeoMap';
namespace user {
    export function profile() {
        return [
            '/user/:name$',
            async (req: express.Request, res: express.Response) => {
                console.log('user profile');
                let user1 = await User.findFirst({ username: req.params.name });
                if (user1 != null) {
                    return res.render('user', { user: user1.toJSON() });
                } else {
                    throw new Error(`Could'nt find user`);
                }
            },
        ];
    }
    export function storages() {
        return [
            '/user/:name/storages',
            async (req: express.Request, res: express.Response) => {
                let name = req.params.name;

                Safes.listof(name)
                    .then(list => {
                        console.log('done safes list');

                        res.json(list);
                    })
                    .catch(message => {
                        res.status(500).json({ error: { message: message } });
                    });
            },
        ];
    }
    export function storage() {
        return [
            '/user/:name/storage/:invname',
            (req: express.Request, res: express.Response) => {
                let username = req.params.name;
                let invname = req.params.invname;
                User.findFirst({ name: username })
                    .then(user => {
                        let result: Safe = null;
                        if (user != null) {
                            let safes = user.getSafes();
                            safes.find((safe: Safe) => {
                                return safe.getName() === invname;
                            });
                            result = safes[0];
                        }
                        if (result != null) {
                            return res.json(JSON.parse(result.toString()).safe);
                        } else {
                            return res
                                .status(404)
                                .send(`Storage '${username}' not found`);
                        }
                    })
                    .catch(e => console.error(e));
            },
        ];
    }
    export function operate() {
        return [
            '/user/:name/storages/:operation/:invname',
            (req: express.Request, res: express.Response) => {
                let result: boolean = false;
                let username: string = req.params.name;
                let invname: string = req.params.invname;
                User.findFirst({ name: username })
                    .then(async user => {
                        switch (req.params.operation) {
                            case 'add':
                                user.addSafe(invname);

                                break;
                            case 'remove':
                                user.removeSafe(invname);
                                break;
                            case 'edit':
                                let safe: Safe = await user.getSafe(invname);
                                break;

                            default:
                                break;
                        }
                        return res.json({ added: result });
                    })
                    .catch(e => console.error(e));
            },
        ];
    }
}
export default user;

interface IStorage {
    name: string;
    created: Date;
    space: GeeoMap<string, any>;
    last_loaded: Date;
}

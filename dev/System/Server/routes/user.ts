import express from 'express';
import User from '../../Entity/User';
import Safe from '../../Entity/Safe';
import { GeeoMap } from '../../GeeoMap';
namespace user {
    export async function profile(req: express.Request, res: express.Response) {
        console.log('user profile');
        let user1 = await User.findFirst({ username: req.params.name });
        if (user1 != null) {
            return res.render('user', { user: user1.toJSON() });
        } else {
            throw new Error(`Could'nt find user`);
        }
    }
    export async function storages(
        req: express.Request,
        res: express.Response
    ) {
        let name = req.params.name;
        let user = await User.findFirst({ username: name });

        let showcase_safes: any[] = [];
        if (user != null) {
            let safes = user.getSafes();
            if (safes.length > 0) {
                console.log(safes);

                safes.forEach(async (safe: Safe) => {
                    if (safe.getLastLoaded() != null) {
                        let storage: IStorage = {
                            name: safe.getName(),
                            created: await safe.getCreated(),
                            last_loaded: await safe.getLastLoaded(),
                            space: await safe.getSpace(),
                        };
                        showcase_safes.push(storage);
                    }
                });
            } else {
                return res.json([]);
            }
        }

        return res.json(showcase_safes);
    }
    export async function storage(req: express.Request, res: express.Response) {
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
    }
    export function operate(req: express.Request, res: express.Response) {
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
    }
}
export default user;

interface IStorage {
    name: string;
    created: Date;
    space: GeeoMap<string, any>;
    last_loaded: Date;
}

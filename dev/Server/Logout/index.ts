import * as express from 'express';
import User from '../../User';
function RLogout() {
    let router: express.Router = express.Router({ mergeParams: true });
    router.get('/$', function(req:express.Request, res:express.Response){
        let user = User.from("oezguer.isbert");
        user.setLoggedIn(false);
        if(user.save()){

            res.redirect("/");
        }else {
            res.send("Woops");
        }
    });
    return router;
}
export default RLogout();
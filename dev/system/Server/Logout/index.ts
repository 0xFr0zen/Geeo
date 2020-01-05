import * as express from 'express';
import User from '../../Entity/User';
import Identity from '../../Identity';
function RLogout() {
    let router: express.Router = express.Router({ mergeParams: true });
    router.get('/$', function(req:express.Request, res:express.Response){
        let user = User.from(Identity.of("admin"));
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
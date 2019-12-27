import * as express from 'express';
import User from '../../Entity/User';
import Identity from '../../Identity';
function RLogin() {
    let router: express.Router = express.Router({ mergeParams: true });
    router.get('/$', function(req:express.Request, res:express.Response){
        res.render("login");
    });
    router.post('/$', function(req:express.Request, res:express.Response){
        let queries = req.query;
        let user = User.from(Identity.of("admin"));
        user.setLoggedIn(true);
        if(user.save()){
            res.send("OK");
        }
        
    });
    return router;
}
export default RLogin();
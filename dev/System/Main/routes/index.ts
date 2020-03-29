import login from './login';
import register from './register';
import logout from './logout';
import resources from '../../../Server/routes/resources';
import indexsite from './indexsite';
import dev from './dev';
namespace routeslist {
    export const all = {
        indexsite: indexsite,
        resourceprotecter: resources.find('resourceprotecter'),
        themes: resources.find('themes'),
        scripts: resources.find('scripts'),
        images: resources.find('images'),
        fonts: resources.find('fonts'),
        login: login,
        logout: logout,
        register: register,
        dev: dev,
    };
}

export default routeslist;

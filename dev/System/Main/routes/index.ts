import login from './login';
import register from './register';
import logout from './logout';
import resources from '../../../Server/routes/resources';
import indexsite from './indexsite';
namespace routeslist {
    export const all = {
        indexsite: indexsite,
        themes: resources.find('themes'),
        scripts: resources.find('scripts'),
        images: resources.find('images'),
        fonts: resources.find('fonts'),
        login: login,
        logout: logout,
        register: register,
    };
}

export default routeslist;

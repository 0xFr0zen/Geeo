import login from './login';
import register from './register';
import user from './user';
import logout from './logout';
import resources from './resources';
import cashieritem from './cashieritem';
namespace routeslist {
    export const all = {
        themes: resources.find('themes'),
        scripts: resources.find('scripts'),
        images: resources.find('images'),
        fonts: resources.find('fonts'),
        login: login,
        logout: logout,
        register: register,
        user: user,
        cashieritem:cashieritem
    };
}

export default routeslist;

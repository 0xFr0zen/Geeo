import themes from './themes';
import scripts from './scripts';
import images from './images';
import fonts from './fonts';
import login from './login';
import register from './register';
import user from './user';
import logout from './logout';
namespace routeslist {
    export const all = {
        themes: themes,
        scripts: scripts,
        images: images,
        fonts: fonts,
        login: login,
        logout: logout,
        register: register,
        user: user,
    };
}

export default routeslist;

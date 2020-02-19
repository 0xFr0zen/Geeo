import express from 'express';

import login from './login';
import logout from './logout';
import user from './user';
import themes from './themes';
import scripts from './scripts';
import images from './images';
import register from './register';
import fonts from './fonts';
import headers from './headers';
import indexsite from './indexsite';
import cashier from './cashier';
namespace routes {
    export const all = [
        login,
        logout,
        user,
        themes,
        scripts,
        images,
        register,
        fonts,
        cashier,
    ];
}
export default routes;

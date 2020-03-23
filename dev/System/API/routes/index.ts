import user from './user';
import resources from '../../Server/routes/resources';
import cashieritem from './cashieritem';
namespace routeslist {
    export const all = {
        themes: resources.find('themes'),
        scripts: resources.find('scripts'),
        images: resources.find('images'),
        fonts: resources.find('fonts'),
        user: user,
        cashieritem:cashieritem
    };
}

export default routeslist;

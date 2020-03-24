import themes from './themes';
import scripts from './scripts';
import images from './images';
import fonts from './fonts';

namespace resources {
    const resourcelist: Resource = {
        themes: themes,
        scripts: scripts,
        images: images,
        fonts: fonts,
    };
    export function find(name: string) {
        if (Object.keys(resourcelist).includes(name)) {
            return resourcelist[name];
        }
    }
}
interface Resource {
    [name: string]: any;
}
export default resources;

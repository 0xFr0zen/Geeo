import * as path from 'path';
import { existsSync } from 'fs';
import express from 'express';
namespace Pager {
    export class Page {
        private pathurl: PageVersion;
        private resourcepack: Resource[] = [];
        private bodyPack: Body;
        constructor(
            pathurl: PageVersion,
            ...resourcePack: Resource[] | string[]
        ) {
            this.pathurl = pathurl;
            resourcePack.forEach((v: Resource | string) => {
                if (v instanceof Resource) {
                    this.resourcepack.push(v);
                } else {
                    let splittedFileConstr = v.split('.');
                    let fileExtension =
                        splittedFileConstr[splittedFileConstr.length - 1];
                    let resType: ResourceType = null;
                    switch (fileExtension) {
                        case 'js':
                            resType = ResourceType.JS;
                            break;
                        case 'json':
                            resType = ResourceType.JSON;
                            break;
                        case 'txt':
                            resType = ResourceType.TXT;
                            break;
                        case 'csv':
                            resType = ResourceType.CSV;
                            break;
                        case 'png':
                            resType = ResourceType.IMAGE;
                            break;
                        case 'jpg':
                            resType = ResourceType.IMAGE;
                            break;
                        case 'svg':
                            resType = ResourceType.IMAGE;
                            break;
                        case 'css':
                            resType = ResourceType.CSS;
                            break;
                        case 'ttf':
                            resType = ResourceType.FONT;
                            break;
                        case 'woff':
                            resType = ResourceType.FONT;
                            break;
                        case 'woff2':
                            resType = ResourceType.FONT;
                            break;
                        case 'eot':
                            resType = ResourceType.FONT;
                            break;
                        default:
                            resType = ResourceType.UNKNOWN;
                            break;
                    }
                    this.resourcepack.push(new Resource(v, resType));
                }
            });
            this.bodyPack = new Body(pathurl);
        }
        public render(response: express.Response) {
            let s = {
                header: ResourcePackager.compile(this.resourcepack),
                content: this.bodyPack.compile(),
                pathurl: this.pathurl,
            };
            return response.render('starter', s);
        }
    }
    export class Resource {
        private pathurl: string;
        private type: ResourceType;
        constructor(pathurl: string, type: ResourceType) {
            let p: string = path.join(
                process.cwd(),
                `./dev/System/Web/${type}/${pathurl}`
            );
            this.pathurl = pathurl;
            this.type = type;
            if (!existsSync(p)) {
                throw new Error(`This file '${this.pathurl}' doesnt exist`);
            }
        }
        public getType(): string {
            return this.type;
        }
        public getPath(): string {
            return this.pathurl;
        }
    }
    export abstract class ResourcePackager {
        public static compile(resources: Resource[]): ResourcePackage {
            let rp: ResourcePackage = {};
            for (const res of resources) {
                if (rp[res.getType().toLowerCase()]) {
                    if (rp[res.getType().toLowerCase()] == null) {
                        rp[res.getType().toLowerCase()] = [];
                    }
                } else {
                    rp[res.getType().toLowerCase()] = [];
                }
                rp[res.getType().toLowerCase()].push(
                    '/'
                        .concat(
                            path.join(
                                res.getType().toLowerCase(),
                                res.getPath()
                            )
                        )
                        .replace('\\', '/')
                );
            }

            return rp;
        }
    }
    export interface ResourcePackage {
        scripts?: [];
        themes?: [];
        images?: [];
        fonts?: [];
        [name: string]: any;
    }
    export enum ResourceType {
        IMAGE = 'Images',
        CSS = 'Themes',
        JSON = 'JSON',
        TXT = 'TXT',
        CSV = 'CSV',
        FONT = 'Fonts',
        JS = 'Scripts',
        UNKNOWN = 'unknown',
    }
    export class Body {
        private versionType: PageVersion;
        private path: string = '';
        constructor(version: PageVersion) {
            this.versionType = version;
            this.path = path.join(
                process.cwd(),
                `./dev/System/Templates/bodies/${this.versionType}/content.ejs`
            );
            if (!existsSync(this.path)) {
                throw new Error(`This file '${this.path}' doesnt exist`);
            }
        }
        public compile(): any {
            return this.versionType;
        }
    }
    export interface BodyContent {
        content: PageVersion;
    }
    export enum PageVersion {
        API = 'api',
        MAIN = 'main',
        RESOURCE = 'res',
    }
}
export default Pager;

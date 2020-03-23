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
                    this.resourcepack.push(
                        new Resource(v, ResourceType.UNKNOWN)
                    );
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
            this.pathurl = pathurl;
            this.type = type;
            if (
                !existsSync(
                    path.join(
                        process.cwd(),
                        `./dev/System/Web/${type}/${this.pathurl}`
                    )
                )
            ) {
                throw new Error('This file doesnt exist');
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
                    path.join(res.getType().toLowerCase(), res.getPath())
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
        constructor(version: PageVersion) {
            this.versionType = version;
            if (
                !existsSync(
                    path.join(
                        process.cwd(),
                        `./dev/System/Templates/bodies/${this.versionType}.ejs`
                    )
                )
            ) {
                throw new Error('This file doesnt exist');
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

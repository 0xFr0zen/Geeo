import { resolve } from 'dns';
import { rejects } from 'assert';
import { EventEmitter } from 'events';

interface IEntity {
    name: string;
    type: string;
    created: number;
    [key: string]: any;
}
export interface EntityFilter {
    name?: string;
    type?: string;
    created?: number;
}
export default class Entity extends EventEmitter {
    private properties: IEntity = { name: null, type: null, created: null };
    constructor(type: string, name: string, created?: number) {
        super();
        this.properties.type = type;
        this.properties.name = name;
        this.properties.created = created || Date.now();
    }
    protected addParameter(name: string, value: any): Promise<boolean> {
        return new Promise((resolve, reject) => {
            if (name.length == 0) {
                reject('Invalid attribute name length.');
            }
            this.properties[name] = value;
            resolve(true);
        });
    }
    protected hasParameter(name: string): boolean {
        return Object.keys(this.properties).indexOf(name) > -1;
    }
    protected updateParameter(name: string, newvalue: any): Promise<boolean> {
        return this.addParameter(name, newvalue);
    }
    protected removeParameter(name: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            if (name.length == 0) {
                reject('Invalid attribute name length.');
            }
            async () => {
                if (await this.hasParameter(name)) {
                    delete this.properties[name];
                    resolve(true);
                }
            };
        });
    }
    protected getParameter(name: string): any {
        return async () => {
            if (await this.hasParameter(name)) {
                return this.properties[name];
            }
        };
    }
    public getName(): string {
        return this.properties.name;
    }

    public getType(): string {
        return this.properties.type;
    }
    public getLastLoaded(): Promise<Date> {
        return new Promise((resolve, reject) => {
            if (this.hasParameter('last_loaded')) {
                resolve(this.getParameter('last_loaded'));
            } else {
                reject('Never loaded.');
            }
        });
    }
    public getCreated(): Promise<Date> {
        return new Promise((resolve, reject) => {
            if (this.hasParameter('created')) {
                let d = new Date(this.getParameter('created'));
                resolve(d);
            } else {
                reject('Never loaded.');
            }
        });
    }
    public toJSON(): any {
        return this.properties;
    }
}

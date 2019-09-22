import {Browser} from './Browser';

export class Analytics {
    static create(uid: string, appName: string, appVersion: string) {
        ga('create', uid, 'auto');
        ga('set', 'appName', appName);
        ga('set', 'appVersion', appVersion);
        
        this.sendEvent(name, Browser.getReferrer());
    }

    static buttonClick(name: string, value?: number) {
        ga('send', 'event', 'button', name, undefined, value);
    }
    
    static sendEvent(category: string, action: string, label?: string, value?: number) {
        ga('send', 'event', category, action, label, value);
    }
}
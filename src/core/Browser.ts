export class Browser {
    static getReferrer() {
        try {
            if (document.referrer) {
                return document.referrer.split('?')[0];
            }
            else {
                return document.location.href;
            }
        }
        catch (e) {
            return "unknown";
        }
    }
}
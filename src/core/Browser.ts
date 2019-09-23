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

    static getQueryStringParameter(name: string) {
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
        if (results !== null) 
            return decodeURIComponent(results[1].replace(/\+/g, " "));
    }

    static getQueryString(name : string, defaultValue?: string) {
        var result = this.getQueryStringParameter(name);
        return result || defaultValue;
    }

    static getQueryBoolean(name: string, defaultValue?: boolean) {
        var parameter = this.getQueryStringParameter(name);
        if (parameter)
            return parameter == "true"
        else
            return defaultValue;
    }

    static getQueryNumber(name: string, defaultValue?: number) {
        var result = this.getQueryStringParameter(name);
        return result !== undefined ? Number(result) : defaultValue;
    }
}
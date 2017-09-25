
class DataManager {
    static getAllActivites(handler) {
        _.get('api/activities.json', handler);
    }

    static getActivity(tag, successHandler, errorHandler) {
        _.get('api/activities.json', function search(response) {
            let succes = false;
            for (let i = 0; i < response.length; i++) {
                if (response[i].tag === tag) {
                    successHandler(response[i]);
                    succes = true;
                }
            }
            if (!succes && errorHandler !== undefined) {
                errorHandler(response);
            }
        });
    }

    static getParameter(name) {
        // First we cut the ?
        const getpath = window.location.search.substr(1);
        const pairs = getpath.split('&');
        for (let i = 0; i < pairs.length; i++) {
            const entry = pairs[i].split('=');
            if (name === decodeURIComponent(entry[0])) {
                return decodeURIComponent(entry[1]);
            }
        }
        return undefined;
    }
}


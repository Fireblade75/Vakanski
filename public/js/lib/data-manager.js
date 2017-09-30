/**
 * A class used to get data from the API
 */
class DataManager {
    /**
     * Creates a request to get all activities from the API
     * @param {function} handler the function to call when the results are ready
     */
    static getAllActivites(handler) {
        _.get('api/activities.json', handler);
    }

    /**
     * Creates a request to get a specific activity from the API
     * @param {function} successHandler the function to call when the results are ready
     * @param {function} errorHandler the function to call when there is an error
     */
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

    /**
     * Creates a request to get all locations from the API
     * @param {function} successHandler the function to call when the results are ready
     */
    static getAllLocations(handler) {
        _.get('api/locations.json', handler);
    }

    /**
     * Creates a request to get a specific location from the API
     * @param {function} successHandler the function to call when the results are ready
     * @param {function} errorHandler the function to call when there is an error
     */
    static getLocation(id, successHandler, errorHandler) {
        _.get('api/locations.json', function search(response) {
            let succes = false;
            for (let i = 0; i < response.length; i++) {
                if (String(response[i].id) === String(id)) {
                    successHandler(response[i]);
                    succes = true;
                }
            }
            if (!succes && errorHandler !== undefined) {
                errorHandler(response);
            }
        });
    }

    /**
     * Gets a GET paramater of the current page
     * If the parameter is not pressent the function will return undefined
     * @param {string} name the name of the attribute to look for
     * @return {string?} the value of the attribute
     */
    static getParameter(name) {
        // First we cut the ? from the get section
        const getpath = window.location.search.substr(1);
        // Then we split up this section by the & sign
        const pairs = getpath.split('&');
        // Now we have 'attribute=value' pairs and we can
        // Search for the right attribute
        for (let i = 0; i < pairs.length; i++) {
            const entry = pairs[i].split('=');
            // Attributes can use encoded characters so we need to decode them
            if (name === decodeURIComponent(entry[0])) {
                return decodeURIComponent(entry[1]);
            }
        }
        return undefined;
    }
}

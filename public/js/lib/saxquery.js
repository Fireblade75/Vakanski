'use strict';

/**
 * This class is used to manipulate on or more DOM elements.
 */
class SaxElement {
    /**
     * @constructor
     * @param {*} tag an id/class selector or an element or array of HTMLElements
     */
    constructor(tag) {
        if (tag === null) {
            this.objects = [];
        } else if (tag instanceof HTMLElement) {
            this.objects = [tag];
        } else if (tag instanceof Array) {
            this.objects = [];
            for (let i = 0; i < tag.length; i++) {
                const element = tag[i];
                if (element instanceof HTMLElement) {
                    this.objects.push(element);
                } else if (element instanceof SaxElement) {
                    for (let j = 0; j < element.objects.length; j++) {
                        this.objects.push(element.objects[j]);
                    }
                }
            }
        } else if (tag.startsWith('#')) {
            this.objects = [document.getElementById(tag.substr(1))];
        } else if (tag.startsWith('.')) {
            this.objects = [];
            const elements = document.getElementsByClassName(tag.substr(1));
            if (elements.length === 0) {
                throw Error(`No items of class ${tag} found.`);
            }
            for (let i = 0; i < elements.length; ++i) {
                this.objects.push(elements[i]);
            }
        } else {
            throw Error(`Unsupported tag detected: ${tag}`);
        }
    }

    /**
     * Get one of the HTMLElements represented by this SaxElement
     * @param {number} index the index of the HTMLElements
     * @return {HTMLElement} the requested HTMLElement
     */
    getElement(index) {
        if (index >= 0) {
            return this.objects[index];
        }
        return this.objects[this.objects.length - index];
    }

    /**
     * Get a SaxElement representing one of the HTMLElements of this SaxElement
     * @param {number} index the index of the HTMLElements
     * @return {SaxElement} the requested SaxElement
     */
    get(index) {
        return new SaxElement(this.getElement(index));
    }

    /**
     * Get or set the value of the represented HTMLElements
     * If no value is passed, the current value is returned
     * If this object represents multiple objects the value of
     * the first one is returned.
     * @param {*} value the new value to set
     * @return {*} the current/new value of the first element
     */
    val(value = null) {
        if (value === null) {
            return this.objects[0].value;
        }
        for (let i = 0; i < this.objects.length; i++) {
            this.objects[i].value = value;
        }
        return value;
    }

    /**
     * Get or set the source (src) of the represented HTMLElements
     * If no value is passed, the current value is returned
     * If this object represents multiple objects the value of
     * the first one is returned.
     * Optionally the alt tag can also be set at the same time.
     * @param {string} source the new src value to set
     * @param {string} alt the new alt tag for the image
     * @return {string} the current/new src of the first element
     */
    src(source = null, alt) {
        if (source === null) {
            return this.objects[0].src;
        }
        for (let i = 0; i < this.objects.length; i++) {
            this.objects[i].src = source;
            if (alt !== undefined) {
                this.objects[i].alt = alt;
            }
        }
        return source;
    }

    /**
     * Get or set a css property for all represented HTMLElements
     * If no value is passed the css value of the first element is returned
     * @param {string} propertyName the css propertyname
     * @param {*} value the new value for this porperty
     * @return {*} the current value for this property of the first HTMLElement
     */
    css(propertyName, value) {
        if (value === null) {
            return this.objects[0].style[propertyName];
        }
        for (let i = 0; i < this.objects.length; i++) {
            this.objects[i].style[propertyName] = value;
        }
        return value;
    }

    /**
     * Set an event listener for all represented HTMLElements
     * @param {string} name  the name of the event
     * @param {function} handler the function to execute
     */
    onEvent(name, handler) {
        for (let i = 0; i < this.objects.length; i++) {
            this.objects[i].addEventListener(name, handler);
        }
    }

    /**
     * Set a click event listener for all represented HTMLElements
     * @param {function} handler the function to execute
     */
    onClick(handler) {
        this.onEvent('click', handler);
    }

    /**
     * Set a input event listener for all represented HTMLElements
     * @param {function} handler the function to execute
     */
    onInput(handler) {
        this.onEvent('input', handler);
    }

    /**
     * Set a submit event listener for all represented HTMLElements
     * @param {function} handler the function to execute
     */
    onSubmit(handler) {
        this.onEvent('submit', handler);
    }

    /**
     * Adds or removes the disabled attribute to/from the represented HTMLElements
     * @param {boolean} bool false if the object should have the disabled attribute
     */
    setEnabled(bool) {
        for (let i = 0; i < this.objects.length; i++) {
            this.objects[i].disabled = !bool;
        }
    }

    /**
     * Sets the inner HTML of all represented HTMLElements the a new value or gets
     * the current HTML of the first represented HTMLElement.
     * This method also supports directly setting an HTMLElement or VirtualElement
     * as the new content.
     * @param {*} html the new inner HTML to set, or an object representing the new HTML
     * @return {*} the current inner HTML of the first HTMLElement
     */
    html(html = null) {
        if (html === null) {
            return this.objects[0].innerHTML;
        }
        if (html instanceof HTMLElement) {
            for (let i = 0; i < this.objects.length; i++) {
                this.objects[i].innerHTML = '';
                this.objects[i].appendChild(html);
            }
        } else if (html instanceof VirtualElement) {
            for (let i = 0; i < this.objects.length; i++) {
                this.objects[i].innerHTML = '';
                this.objects[i].appendChild(html.toHtml());
            }
        } else {
            for (let i = 0; i < this.objects.length; i++) {
                this.objects[i].innerHTML = html;
            }
        }
        return html;
    }

    /**
     * Removes the inner HTML of all represented objects.
     */
    clear() {
        for (let i = 0; i < this.objects.length; i++) {
            this.objects[i].innerHTML = '';
        }
    }

    /**
     * Hides the currently represented HTMLElements
     */
    hide() {
        for (let i = 0; i < this.objects.length; i++) {
            const currentStyle = this.objects[i].style.display;
            if (currentStyle !== '' && currentStyle !== 'none') {
                _.displayArr.push({ obj: this.objects[i], style: this.objects[i].style.display });
            }
            this.objects[i].style.display = 'none';
        }
    }

    /**
     * Unhides the currently represented HTMLElements
     */
    show() {
        for (let i = 0; i < this.objects.length; i++) {
            const currentObject = this.objects[i];
            const displayArrIndex = _.displayArr.findIndex(function equals(value) {
                return value.obj === currentObject;
            });

            if (displayArrIndex !== -1) {
                this.objects[i].style.display = _.displayArr[displayArrIndex].style;
                delete _.displayArr[displayArrIndex];
            } else {
                this.objects[i].style.display = null;
            }
        }
    }

    /**
     * Adds a new css class to all represented HTMLElements
     * @param {string} name the name of the css class
     */
    addClass(name) {
        for (let i = 0; i < this.objects.length; i++) {
            const classes = this.getClasses(i);
            if (!classes.includes(name)) {
                classes.push(name);
                this.setClasses(classes, i);
            }
        }
    }

    /**
     * Removes a css class from all represented HTMLElements
     * @param {string} name the name of the css class
     */
    removeClass(name) {
        for (let i = 0; i < this.objects.length; i++) {
            const classes = this.getClasses(i);
            const index = classes.indexOf(name);
            if (index !== -1) {
                classes.splice(index, 1);
                this.setClasses(classes, i);
            }
        }
    }

    /**
     * Removes or adds a css class from/to all represented HTMLElements
     * @param {string} name the name of the css class
     */
    toggleClass(name) {
        for (let i = 0; i < this.objects.length; i++) {
            const subElemet = this.get(i);
            if (subElemet.hasClass(name)) {
                subElemet.removeClass(name);
            } else {
                subElemet.addClass(name);
            }
        }
    }

    /**
     * Checks if a specific HTMLElement has a certain css class
     * If the index is omitted the first element is used
     * @param {string} name the name of the css class
     * @param {number} index the index of the HTMLElement
     */
    hasClass(name, index = 0) {
        return this.getClasses(index).includes(name);
    }

    /**
     * Gets all css classes of a specific HTMLElement
     * If the index is omitted the first element is used
     * @param {number} index the index of the HTMLElement
     * @return {string[]} the css classes of the HTMLElement
     */
    getClasses(index = 0) {
        return this.objects[index].className.split(' ');
    }

    /**
     * Sets all css classes of all represented HTMLElements
     * By specifing an index, only the classes of a specific
     * HTMLElement are replaced.
     * @param {string[]} classArr an array of the new css classes
     * @param {number} index the index of the HTMLElement
     */
    setClasses(classArr, index = -1) {
        const classes = classArr.join(' ').trim();
        if (index === -1) {
            for (let i = 0; i < this.objects.length; i++) {
                this.objects[i].className = classes;
            }
        } else {
            this.objects[index].className = classes;
        }
    }

    /**
     * Gets a SaxObject containing the parent nodes of all represented
     * HTMLElements in this object
     * @return {SaxObject} a SaxObject representing all parent nodes
     */
    parent() {
        const parentNodes = [];
        for (let i = 0; i < this.objects.length; i++) {
            parentNodes.push(this.objects[i].parentNode);
        }
        return new SaxElement(parentNodes);
    }

    /**
     * Gets a SaxObject containing all child nodes of all represented
     * HTMLElements in this object
     * @return {SaxObject} a SaxObject representing all child nodes
     */
    children() {
        const childNodes = [];
        for (let i = 0; i < this.objects.length; i++) {
            for (let j = 0; j < this.objects[i].children.length; j++) {
                childNodes.push(this.objects[i].children[j]);
            }
        }
        return new SaxElement(childNodes);
    }

    /**
     * Get a SaxObject conataining only HTMLElements that match
     * the given filter. If no HTMLElements match the filter
     * the method will return null.
     * @param {string} filterStr the filter string to use
     * @return {SaxElement} a SaxElement representing all matching elements
     */
    filter(filterStr) {
        const queryFilter = new QueryFilter(filterStr);
        const pureObjects = queryFilter.filter(this.objects);
        if (pureObjects.length > 0) {
            return new SaxElement(pureObjects);
        }
        return null;
    }

    /**
     * Get the first n HTMLElements represented by this object.
     * If n is omitted only the first object is returned
     * @param {Number} n the ammount of objects to return
     */
    first(n = null) {
        return new SaxElement(_.first(this.objects, n));
    }

    /**
     * Get the last n HTMLElements represented by this object.
     * If n is omitted only the last object is returned
     * @param {Number} n the ammount of objects to return
     */
    last(n = null) {
        return new SaxElement(_.last(this.objects, n));
    }

    /**
     * Add a node as the first child of all represented HTMLElements
     * This method supports HTMLElements, SaxElements and VirtualElements
     * @param {*} node the node to add
     */
    prependNode(node) {
        const domNodes = _.toHTMLElements(node);

        for (let i = 0; i < this.objects.length; i++) {
            const firstNode = _.first(this.get(i).children().objects);
            if (firstNode === undefined) {
                for (let j = 0; j < domNodes.length; j++) {
                    this.objects[i].appendChild(domNodes[j]);
                }
            } else {
                for (let j = 0; j < domNodes.length; j++) {
                    this.objects[i].insertBefore(domNodes[j], firstNode);
                }
            }
        }
    }

    /**
     * Add a node as the last child of all represented HTMLElements
     * This method supports HTMLElements, SaxElements and VirtualElements
     * @param {*} node the node to add
     * @deprecated
     */
    append(elements) {
        this.appendNode(elements);
        console.warn('You are using the deprecated fucntion \'append\', use appendNode instead.');
    }

    /**
     * Add a node as the last child of all represented HTMLElements
     * This method supports HTMLElements, SaxElements and VirtualElements
     * @param {*} node the node to add
     */
    appendNode(node) {
        const domNodes = _.toHTMLElements(node);
        for (let i = 0; i < this.objects.length; i++) {
            for (let j = 0; j < domNodes.length; j++) {
                this.objects[i].appendChild(domNodes[j]);
            }
        }
    }

    /**
     * Replace all represented nodes with a new node
     * This method supports HTMLElements, SaxElements and VirtualElements
     * @param {*} node the new node
     */
    replaceNode(newNode) {
        let domNode = _.toHTMLElements(newNode);
        if (domNode.length > 1) {
            throw Error('Cannot replace node with multiple nodes.');
        } else {
            domNode = _.first(domNode);
        }
        for (let i = 0; i < this.objects.length; i++) {
            const parent = this.objects[i].parentNode;
            if (parent instanceof HTMLElement) {
                parent.replaceChild(domNode, this.objects[i]);
            } else {
                throw Error('Cannot replace this node.');
            }
        }
    }

    /**
     * Remove a specific child node from all represented nodes
     * This method supports removing by index and by specific HTMLElements
     * Also removing by using the string 'first' and 'last' is supported
     * @param {*} node the new node to remove
     */
    removeChild(node) {
        let domNodes = null;
        const commands = ['first', 'last'];
        if (commands.indexOf(node) === -1 && !(Number.isInteger(node))) {
            domNodes = _.toHTMLElements(node);
        }
        for (let i = 0; i < this.objects.length; i++) {
            if (domNodes !== null) {
                for (let j = 0; j < domNodes.length; j++) {
                    this.objects[i].removeChild(domNodes[j]);
                }
            } else {
                const children = this.get(i).children();
                if (Number.isInteger(node)) {
                    this.objects[i].removeChild(children.objects[node]);
                } else if (node === 'first') {
                    this.objects[i].removeChild(_.first(children.objects));
                } else if (node === 'last') {
                    this.objects[i].removeChild(_.last(children.objects));
                }
            }
        }
    }

    /**
     * Creates a clone of the current SaxElement by cloning all represented HTMLElements
     * @param {boolean} deep thru if the HTMLElements should be deep cloned
     */
    clone(deep = true) {
        const newObjects = [];
        for (let i = 0; i < this.objects.length; i++) {
            newObjects.push(this.objects[i].cloneNode(deep));
        }
        return new SaxElement(newObjects);
    }
}

/**
 * A class use to represent a virtual DOM.
 * It provides an easy way to create HTML from JavaScript
 */
class VirtualElement {
    constructor(object) {
        this.object = object;
    }

    toHtml() {
        const node = document.createElement(this.object.tag);
        if (this.object.attributes !== undefined) {
            for (const key in this.object.attributes) {
                if (this.object.attributes.hasOwnProperty(key)) {
                    node.setAttribute(key, this.object.attributes[key]);
                }
            }
        }
        if (this.object.childNodes !== undefined) {
            for (let i = 0; i < this.object.childNodes.length; i++) {
                const childNode = this.object.childNodes[i];
                if (typeof childNode === 'string' || typeof childNode === 'number') {
                    node.appendChild(document.createTextNode(childNode));
                } else if (childNode instanceof VirtualElement) {
                    node.appendChild(childNode.toHtml());
                } else {
                    throw Error('Unsupported child node type found!');
                }
            }
        }
        return node;
    }
}

/**
 * An abstract class that can be implemented to create components
 */
class SaxComponent extends VirtualElement {
    constructor() {
        super(null);
    }

    /**
     * Converts this SaxComponent to an HTMLElement
     * @return {HTMLElement} a HTMLElment representing this component
     */
    toHtml() {
        return this.render().toHtml();
    }

    /**
     * Renders this SaxComponent to a VirtualElement
     * This method should be overridden by every component
     * @return {VirtualElement} a VirtualElement representing this component
     */
    render() {
        throw new Error('Abstract method render was called.');
    }
}

/**
 * Creates a new SaxElement by searching by ID or by css class
 * This method can also be used to directly create an SaxElement of
 * a single HTMLElement or from a array of HTMLElements.
 * @param {string} tag an id or an css class as a css style selector
 * @return {SaxElement} a SaxElement conaining the found HTMLElements
 */
let _ = function select(tag) {
    return new SaxElement(tag);
};

/**
 * This function creates a VirtualElement
 * @param {string} tag the name of the HTML node (the tag)
 * @param {Object} attributes an object representing the attributes of the node
 * @param {...*} childNodes VirtualElement or strings that are children of the node
 */
_.create = function createElement(tag, attributes, ...childNodes) {
    if (childNodes.length === 1 && Array.isArray(childNodes[0])) {
        childNodes = _.first(childNodes);
    }
    if (typeof attributes === 'string' || typeof attributes === 'number' || attributes instanceof VirtualElement) {
        childNodes.unshift(attributes);
        attributes = {};
    }
    if (attributes === undefined) {
        attributes = {};
    }
    return new VirtualElement({ tag, attributes, childNodes });
};

// An array used to keep track of previous states of hidden elements
_.displayArr = [];

/**
 * Execute a certain function after the DOM has loaded
 * @param {function} func the function to execute
 */
_.onReady = function onReady(func) {
    document.addEventListener('DOMContentLoaded', func);
};


/**
 * Send a GET request to a specific URL
 * The data should be a flat key-value javascript object
 * @param {string} url the url for the GET request
 * @param {Object} data the data to send to the server
 * @param {function} handler the handler to pass the result to
 */
_.get = function get(url, data, handler) {
    const httpRequest = new XMLHttpRequest();
    if (data instanceof Function) {
        handler = data;
        data = null;
    }
    httpRequest.onreadystatechange = function onPorgress() {
        if (httpRequest.readyState === XMLHttpRequest.DONE) {
            if (httpRequest.status === 200) {
                let response;
                try {
                    response = JSON.parse(httpRequest.responseText);
                } catch (e) {
                    response = httpRequest.responseText;
                }
                handler(response);
            }
        }
    };
    if (data !== null) {
        url += `?${this.toEncodedURL(data)}`;
    }
    httpRequest.open('GET', url, true);
    httpRequest.send();
};

/**
 * Send a POST request to a specific URL
 * The data should be a flat key-value javascript object
 * @param {string} url the url for the GET request
 * @param {Object} data the data to send to the server
 * @param {function} handler the handler to pass the result to
 */
_.post = function post(url, data, handler) {
    const httpRequest = new XMLHttpRequest();
    if (data instanceof Function) {
        handler = data;
        data = null;
    }
    httpRequest.onreadystatechange = function onPorgress() {
        if (httpRequest.readyState === XMLHttpRequest.DONE) {
            if (httpRequest.status === 200) {
                let response;
                try {
                    response = JSON.parse(httpRequest.responseText);
                } catch (e) {
                    response = httpRequest.responseText;
                }
                handler(response);
            }
        }
    };
    httpRequest.open('POST', url, true);
    if (data !== null) {
        const params = this.toEncodedURL(data);
        httpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        httpRequest.send(params);
    } else {
        httpRequest.send();
    }
};

/**
 * Converts a flat key-value javascript object to an encoded URI component
 * @param {Object} data the data to send that needs to be converted
 * @return {string} the data encoded as an URI component
 */
_.toEncodedURL = function toEncodedURL(data) {
    const params = Object.getOwnPropertyNames(data);
    let result = '';
    for (let i = 0; i < params.length; i++) {
        if (i !== 0) {
            result += '&';
        }
        result += `${params[i]}=${encodeURIComponent(data[params[i]])}`;
    }
    return result;
};

/**
 * Return the first n values of an array
 * If n is omitted only the first element is returned
 * @param {[]} arr the array to work with
 * @param {number} n the amount of values to return
 */
_.first = function fisrt(arr, n = null) {
    if (n === null) {
        return arr[0];
    }
    return arr.slice(0, n);
};

/**
 * Return the last n values of an array
 * If n is omitted only the last element is returned
 * @param {[]} arr the array to work with
 * @param {number} n the amount of values to return
 */
_.last = function last(arr, n = null) {
    if (n === null) {
        return arr.slice(-1)[0];
    }
    return arr.slice(-n);
};

/**
 * Converts a string to lower case with the first character and
 * ech character after a certain separator capitalized
 * @param {string} str the string to convert
 * @param {string} separator the separator to use (by default a space)
 * @return {string} the converted string
 */
_.toStartCase = function toStartCase(str, separator) {
    if (separator === undefined) {
        separator = ' ';
    }
    const strArr = str.toLowerCase().split(separator);
    return strArr.reduce(function combine(result, value) {
        const word = value.charAt(0).toUpperCase() + value.substring(1);
        if (result === undefined) {
            return word;
        }
        return result + separator + word;
    }, undefined);
};

/**
 * Converts a single element or array of elements of the types
 * HTMLElement, VirtualElements and SaxElements to an array of
 * HTMLElements. This makes it easier to work with these elements.
 * @param {...*} nodes the nodes to convert
 * @return {HTMLElement[]} the array of HTMLElements
 */
_.toHTMLElements = function toHTMLElements(...nodes) {
    if (nodes.length === 1 && nodes[0] instanceof Array) {
        nodes = _.first(nodes);
    }

    const result = [];
    for (let i = 0; i < nodes.length; i++) {
        if (nodes[i] instanceof HTMLElement) {
            result.push(nodes[i]);
        } else if (nodes[i] instanceof VirtualElement) {
            result.push(nodes[i].toHtml());
        } else if (nodes[i] instanceof SaxElement) {
            for (let j = 0; j < nodes[i].objects.length; j++) {
                result.push(nodes[i].objects[j]);
            }
        }
    }
    return result;
};

/**
 * Formats a number as a currency string
 * If no paramaters for the sign and decimal mark are passed the value is
 * formated as US dollars.
 * @param {number} value the value of the currency to convert
 * @param {string} currencySign the currency sign to use (default = $)
 * @param {string} decimalMark the decimal mark to use (default = .)
 * @return {string} the formatted string
 */
_.formatCurrency = function formatCurrency(value, currencySign = '$', decimalMark = '.') {
    const resultValue = value.toFixed(2).replace('.', decimalMark);
    return `${currencySign} ${resultValue}`;
};

/**
 * A class used to filter the content of an array of HTMLElements
 */
class QueryFilter {
    /**
     * Creates a QueryFilter by passing an array of filters to use
     * @param {...string} filters the filters to use
     */
    constructor(...filters) {
        if (filters.length === 1 && filters[0] instanceof Array) {
            filters = _.first(filters);
        }

        this.ids = [];
        this.tags = [];
        this.classes = [];
        for (let i = 0; i < filters.length; i++) {
            const filter = filters[i];
            if (filter.search(/^#-?[_a-zA-Z]+[_a-zA-Z0-9-]*$/) !== -1) {
                this.ids.push(filter);
            } else {
                const match = filter.match(/^(-?[_a-zA-Z]+[_a-zA-Z0-9-]*|)([.]-?[_a-zA-Z]+[_a-zA-Z0-9-]*|)$/);
                if (match === null || match[0] === '') {
                    throw Error(`Invalid filter: ${filter}`);
                } else {
                    const tag = match[1];
                    const className = match[2].substr(1);

                    if (tag !== '') {
                        this.tags.push(tag);
                    }
                    if (className !== '') {
                        this.classes.push(className);
                    }
                }
            }
        }
    }

    /**
     * Returns a list of HTMLElments that matched this filter
     * @param {...HTMLElement} elements the elements to filter
     * @return {HTMLElement[]} the elements that matched the filters
     */
    filter(...elements) {
        const result = [];
        if (elements.length === 1 && elements[0] instanceof Array) {
            elements = _.first(elements);
        }

        for (let i = 0; i < elements.length; i++) {
            const element = elements[i];
            if (element instanceof HTMLElement) {
                let pure = true;
                for (let j = 0; j < this.ids.length; j++) {
                    if (this.ids[j] !== element.id) {
                        pure = false;
                        break;
                    }
                }
                if (pure) {
                    for (let j = 0; j < this.tags.length; j++) {
                        if (this.tags[j].toLowerCase() !== element.tagName.toLowerCase()) {
                            pure = false;
                            break;
                        }
                    }
                }
                if (pure) {
                    for (let j = 0; j < this.classes.length; j++) {
                        const elementClasses = element.className.split(' ');
                        if (elementClasses.indexOf(this.classes[j]) === -1) {
                            pure = false;
                            break;
                        }
                    }
                }
                if (pure) {
                    result.push(element);
                }
            } else {
                console.log(element);
                throw Error('Can not filter non HTMLElements');
            }
        }
        return result;
    }
}

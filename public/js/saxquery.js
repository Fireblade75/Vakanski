'use strict';

class _object {
    constructor(tag) {
        if (tag === null) {
            this.objects = [];
        } else if (tag instanceof HTMLElement) {
            this.objects = [tag];
        } else if (tag.startsWith('#')) {
            this.objects = [document.getElementById(tag.substr(1))];
        } else if (tag.startsWith('.')) {
            this.objects = [];
            const elements = document.getElementsByClassName(tag.substr(1));
            if (elements.length === 0) {
                throw Error('No items of class " + tag + " found.');
            }
            for (let i = 0; i < elements.length; ++i) {
                this.objects.push(elements[i]);
            }
        } else {
            throw Error(`Unsupported tag detected: ${tag}`);
        }
    }

    get(index) {
        if (index >= 0) {
            return this.objects[index];
        }
        return this.objects[this.objects.length - index];
    }

    val(value = null) {
        if (value === null) {
            return this.objects[0].value;
        }
        for (let i = 0; i < this.objects.length; i++) {
            this.objects[i].value = value;
        }
        return value;
    }

    onClick(func) {
        for (let i = 0; i < this.objects.length; i++) {
            this.objects[i].addEventListener('click', func);
        }
    }

    onInput(func) {
        for (let i = 0; i < this.objects.length; i++) {
            this.objects[i].addEventListener('input', func);
        }
    }

    setEnabled(bool) {
        for (let i = 0; i < this.objects.length; i++) {
            this.objects[i].disabled = !bool;
        }
    }

    html(html = null) {
        if (html === null) {
            return this.objects[0].innerHTML;
        }
        if (html instanceof HTMLElement) {
            for (let i = 0; i < this.objects.length; i++) {
                this.objects[i].innerHTML = '';
                this.objects[i].appendChild(html);
            }
        } else if (html instanceof _virtualObject) {
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

    append(elements) {
        if (!Array.isArray(elements)) {
            elements = [elements];
        }
        for (let elem = 0; elem < elements.length; elem++) {
            if (elements[elem] instanceof HTMLElement) {
                for (let i = 0; i < this.objects.length; i++) {
                    this.objects[i].appendChild(elements[elem]);
                }
            } else if (elements[elem] instanceof _virtualObject) {
                for (let i = 0; i < this.objects.length; i++) {
                    this.objects[i].appendChild(elements[elem].toHtml());
                }
            } else {
                throw Error('Can only append HTMLElements!');
            }
        }
    }

    clear() {
        for (let i = 0; i < this.objects.length; i++) {
            this.objects[i].innerHTML = '';
        }
    }

    hide() {
        for (let i = 0; i < this.objects.length; i++) {
            const currentStyle = this.objects[i].style.display;
            if (currentStyle !== '' && currentStyle !== 'none') {
                _.displayArr.push({ obj: this.objects[i], style: this.objects[i].style.display });
            }
            this.objects[i].style.display = 'none';
        }
    }

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

    addClass(name) {
        for (let i = 0; i < this.objects.length; i++) {
            const classes = this.getClasses(i);
            if (!classes.includes(name)) {
                classes.push(name);
                this.setClasses(classes, i);
            }
        }
    }

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

    hasClass(name, index = 0) {
        return this.getClasses(index).includes(name);
    }

    getClasses(index = 0) {
        return this.objects[index].className.split(' ');
    }

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

    children() {
        const result = new _object(null);
        const childNodes = [];
        for (let i = 0; i < this.objects.length; i++) {
            for (let j = 0; j < this.objects[i].children.length; j++) {
                childNodes.push(this.objects[i].children[j]);
            }
        }
        result.objects = childNodes;
        return result;
    }

    filter(filterStr) {
        const queryFilter = new QueryFilter(filterStr);
        const pureObjects = queryFilter.filter(this.objects);
        if (pureObjects.length > 0) {
            const result = new _object(null);
            result.objects = pureObjects;
            return result;
        }
        return null;
    }
}

class _virtualObject {
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
                } else if (childNode instanceof _virtualObject) {
                    node.appendChild(childNode.toHtml());
                } else {
                    throw Error('Unsupported child node type found!');
                }
            }
        }
        return node;
    }
}

let _ = function select(tag) {
    return new _object(tag);
};

_.create = function createElement(tag, attributes, ...childNodes) {
    if (childNodes.length === 1 && Array.isArray(childNodes[0])) {
        return new _virtualObject({ tag, attributes, childNodes: childNodes[0] });
    }
    return new _virtualObject({ tag, attributes, childNodes });
};

_.displayArr = [];

_.onReady = function onReady(func) {
    document.addEventListener('DOMContentLoaded', func);
};

// Send a REST-style post request to an url
// Data should be a flat key-value java object
_.get = function get(url, data, handler) {
    const httpRequest = new XMLHttpRequest();
    if (data instanceof Function) {
        handler = data;
        data = null;
    }
    httpRequest.onreadystatechange = function onPorgress() {
        if (httpRequest.readyState === XMLHttpRequest.DONE) {
            if (httpRequest.status === 200) {
                const response = JSON.parse(httpRequest.responseText);
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

_.post = function post(url, data, handler) {
    const httpRequest = new XMLHttpRequest();
    if (data instanceof Function) {
        handler = data;
        data = null;
    }
    httpRequest.onreadystatechange = function onPorgress() {
        if (httpRequest.readyState === XMLHttpRequest.DONE) {
            if (httpRequest.status === 200) {
                const response = JSON.parse(httpRequest.responseText);
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

// Data should be a flat key-value javascript object
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

_.first = function fisrt(arr, n = null) {
    if (n === null) {
        return arr[0];
    }
    return arr.slice(0, n);
};

_.last = function last(arr, n = null) {
    if (n === null) {
        return arr.slice(-1)[0];
    }
    return arr.slice(-n);
};

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

class QueryFilter {
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

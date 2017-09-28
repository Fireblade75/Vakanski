'use strict';

class SaxElement {
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

    getElement(index) {
        if (index >= 0) {
            return this.objects[index];
        }
        return this.objects[this.objects.length - index];
    }

    get(index) {
        return new SaxElement(this.getElement(index));
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

    src(source = null) {
        if (source === null) {
            return this.objects[0].src;
        }
        for (let i = 0; i < this.objects.length; i++) {
            this.objects[i].src = source;
        }
        return source;
    }

    css(propertyName, value) {
        for (let i = 0; i < this.objects.length; i++) {
            this.objects[i].style[propertyName] = value;
        }
    }

    onEvent(name, handler) {
        for (let i = 0; i < this.objects.length; i++) {
            this.objects[i].addEventListener(name, handler);
        }
    }

    onClick(handler) {
        this.onEvent('click', handler);
    }

    onInput(handler) {
        this.onEvent('input', handler);
    }

    onSubmit(handler) {
        this.onEvent('submit', handler);
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

    toggleClass(name) {
        if (this.hasClass(name)) {
            this.removeClass(name);
        } else {
            this.addClass(name);
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

    parent() {
        const parentNodes = [];
        for (let i = 0; i < this.objects.length; i++) {
            parentNodes.push(this.objects[i].parentNode);
        }
        return new SaxElement(parentNodes);
    }

    children() {
        const childNodes = [];
        for (let i = 0; i < this.objects.length; i++) {
            for (let j = 0; j < this.objects[i].children.length; j++) {
                childNodes.push(this.objects[i].children[j]);
            }
        }
        return new SaxElement(childNodes);
    }

    filter(filterStr) {
        const queryFilter = new QueryFilter(filterStr);
        const pureObjects = queryFilter.filter(this.objects);
        if (pureObjects.length > 0) {
            return new SaxElement(pureObjects);
        }
        return null;
    }

    first(n = null) {
        return new SaxElement(_.first(this.objects, n));
    }

    last(n = null) {
        return new SaxElement(_.last(this.objects, n));
    }

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

    append(elements) {
        // if (!Array.isArray(elements)) {
        //     elements = [elements];
        // }
        // for (let elem = 0; elem < elements.length; elem++) {
        //     if (elements[elem] instanceof HTMLElement) {
        //         for (let i = 0; i < this.objects.length; i++) {
        //             this.objects[i].appendChild(elements[elem]);
        //         }
        //     } else if (elements[elem] instanceof VirtualElement) {
        //         for (let i = 0; i < this.objects.length; i++) {
        //             this.objects[i].appendChild(elements[elem].toHtml());
        //         }
        //     } else {
        //         throw Error('Can only append HTMLElements!');
        //     }
        // }
        this.appendNode(elements);
        console.warn('You are using the deprecated fucntion \'append\', use appendNode instead.');
    }

    appendNode(node) {
        const domNodes = _.toHTMLElements(node);
        for (let i = 0; i < this.objects.length; i++) {
            for (let j = 0; j < domNodes.length; j++) {
                this.objects[i].appendChild(domNodes[j]);
            }
        }
    }

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

    clone(deep = true) {
        const newObjects = [];
        for (let i = 0; i < this.objects.length; i++) {
            newObjects.push(this.objects[i].cloneNode(deep));
        }
        return new SaxElement(newObjects);
    }
}

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

class SaxComponent extends VirtualElement {
    constructor() {
        super(null);
    }

    toHtml() {
        return this.render().toHtml();
    }

    render() {
        throw new Error('Abstract method render was called.');
    }
}

let _ = function select(tag) {
    return new SaxElement(tag);
};

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

_.formatCurrency = function formatCurrency(value, currencySign = '$', decimalMark = '.') {
    const resultValue = value.toFixed(2).replace('.', decimalMark);
    return `${currencySign} ${resultValue}`;
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

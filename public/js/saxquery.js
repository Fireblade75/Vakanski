"use strict";

class _object {
    constructor(tag) {
        if (tag === null) {
            this.objects = [];
        } else if (tag instanceof HTMLElement) {
            this.objects = [tag];
        } else if (tag.startsWith("#")) {
            this.objects = [document.getElementById(tag.substr(1))];
        } else if (tag.startsWith(".")) {
            this.objects = [];
            let elements = document.getElementsByClassName(tag.substr(1));
            if (elements.length === 0) {
                throw Error("No items of class " + tag + " found.");
            }
            for (let i = 0; i < elements.length; ++i) {
                this.objects.push(elements[i]);
            }
        } else {
            throw Error("Unsupported tag detected: " + tag);
        }
    }

    get(index) {
        if (index >= 0) {
            return this.objects[index];
        } else {
            return this.objects[this.objects.length - index];
        }
    }

    val(value = null) {
        if (value === null) {
            return this.objects[0].value;
        } else {
            for (let i = 0; i < this.objects.length; i++) {
                this.objects[i].value = value;
            }
        }
    }

    onClick(func) {
        for (let i = 0; i < this.objects.length; i++) {
            this.objects[i].addEventListener("click", func);
        }
    }

    onInput(func) {
        for (let i = 0; i < this.objects.length; i++) {
            this.objects[i].addEventListener("input", func);
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
        } else {
            if (html instanceof HTMLElement) {
                for (let i = 0; i < this.objects.length; i++) {
                    this.objects[i].innerHTML = "";
                    this.objects[i].appendChild(html);
                }
            } else if (html instanceof _virtualObject) {
                for (let i = 0; i < this.objects.length; i++) {
                    this.objects[i].innerHTML = "";
                    this.objects[i].appendChild(html.toHtml());
                }
            } else {
                for (let i = 0; i < this.objects.length; i++) {
                    this.objects[i].innerHTML = html;
                }
            }
        }
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
                throw Error("Can only append HTMLElements!");
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
            let currentStyle = this.objects[i].style.display;
            if (currentStyle !== "" && currentStyle !== "none") {
                _.displayArr.push({ obj: this.objects[i], style: this.objects[i].style.display });
            }
            this.objects[i].style.display = 'none';
        }
    }

    show() {
        for (let i = 0; i < this.objects.length; i++) {
            const currentObject = this.objects[i];
            let displayArrIndex = _.displayArr.findIndex(function (value) {
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
            let classes = this.getClasses(i);
            if (!classes.includes(name)) {
                classes.push(name);
                this.setClasses(classes, i);
            }
        }
    }

    removeClass(name) {
        for (let i = 0; i < this.objects.length; i++) {
            let classes = this.getClasses(i);
            let index = classes.indexOf(name);
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
        return this.objects[index].className.split(" ");
    }

    setClasses(classArr, index = -1) {
        let classes = classArr.join(" ").trim();
        if (index === -1) {
            for (let i = 0; i < this.objects.length; i++) {
                this.objects[i].className = classes;
            }
        } else {
            this.objects[index].className = classes;
        }
    }

    children() {
        let result = new _object(null);
        let childNodes = [];
        for (let i = 0; i < this.objects.length; i++) {
            for (let j = 0; j < this.objects[i].children.length; j++) {
                childNodes.push(this.objects[i].children[j]);
            }
        }
        result.objects = childNodes;
        return result;
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
                    throw Error("Unsupported child node type found!");
                }
            }
        }
        return node;
    }
}

let _ = function (tag) {
    return new _object(tag);
};

_.create = function (tag, attributes, ...childNodes) {
    if (childNodes.length === 1 && Array.isArray(childNodes[0])) {
        return new _virtualObject({ tag, attributes, childNodes: childNodes[0] });
    }
    return new _virtualObject({ tag, attributes, childNodes });
};

_.displayArr = [];

_.onReady = function (func) {
    document.addEventListener("DOMContentLoaded", func);
};

// Send a REST-style post request to an url
// Data should be a flat key-value java object
_.get = function (url, data, handler) {
    let httpRequest = new XMLHttpRequest();
    if (data instanceof Function) {
        handler = data;
        data = null;
    }
    httpRequest.onreadystatechange = function () {
        if (httpRequest.readyState === XMLHttpRequest.DONE) {
            if (httpRequest.status === 200) {
                let response = JSON.parse(httpRequest.responseText);
                handler(response);
            }
        }
    };
    if (data !== null) {
        url += "?" + this.toEncodedURL(data);
    }
    httpRequest.open("GET", url, true);
    httpRequest.send();
};

_.post = function (url, data, handler) {
    let httpRequest = new XMLHttpRequest();
    if (data instanceof Function) {
        handler = data;
        data = null;
    }
    httpRequest.onreadystatechange = function () {
        if (httpRequest.readyState === XMLHttpRequest.DONE) {
            if (httpRequest.status === 200) {
                let response = JSON.parse(httpRequest.responseText);
                handler(response);
            }
        }
    };
    httpRequest.open("POST", url, true);
    if (data !== null) {
        let params = this.toEncodedURL(data);
        httpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        httpRequest.send(params);
    } else {
        httpRequest.send();
    }
};

// Data should be a flat key-value javascript object
_.toEncodedURL = function (data) {
    let params = Object.getOwnPropertyNames(data);
    let result = "";
    for (let i = 0; i < params.length; i++) {
        if (i !== 0) {
            result += "&";
        }
        result += params[i] + "=" + encodeURIComponent(data[params[i]]);
    }
    return result;
};

_.first = function (arr, n = null) {
    if (n === null) {
        return arr[0];
    } else {
        return arr.slice(0, n);
    }
};

_.last = function (arr, n = null) {
    if (n === null) {
        return arr.slice(-1)[0];
    } else {
        return arr.slice(-n);
    }
};

_.toStartCase = function (str, separator) {
    if (separator === undefined) {
        separator = ' ';
    }
    let strArr = str.toLowerCase().split(separator);
    return strArr.reduce(function (result, value) {
        const word = value.charAt(0).toUpperCase() + value.substring(1);
        if (result === undefined)
            return word;
        else
            return result + separator + word;
    }, undefined);
};
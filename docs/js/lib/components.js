
class LocationCard extends SaxComponent {
    constructor(props) {
        super();
        this.state = props;
    }

    filter(filterObj) {
        if (filterObj.hasOwnProperty('country')) {
            if (filterObj.country.toLowerCase() !== this.state.country.toLowerCase()) {
                return false;
            }
        }
        if (filterObj.hasOwnProperty('days')) {
            for (let i = 0; i < this.state.prices.length; i++) {
                if (this.state.prices[i].days >= filterObj.days.min) {
                    if (this.state.prices[i].days <= filterObj.days.max) {
                        if (filterObj.hasOwnProperty('price')) {
                            if (this.state.prices[i].price <= filterObj.price) {
                                return true;
                            }
                        } else {
                            return true;
                        }
                    }
                }
            }
            return false;
        } else if (filterObj.hasOwnProperty('price')) {
            for (let i = 0; i < this.state.prices.length; i++) {
                if (this.state.prices[i].price <= filterObj.price) {
                    return true;
                }
            }
            return false;
        }
        return true;
    }

    render() {
        const traitElements = [];
        for (let i = 0; i < this.state.traits.length; i++) {
            traitElements.push(_.create('li', this.state.traits[i]));
        }

        return _.create('a', { class: 'object-card', href: `location.html?id=${this.state.id}` },
            _.create('div', { class: 'image' },
                _.create('img', { src: this.state.img }),
            ),
            _.create('div', { class: 'description' },
                _.create('h3', (this.state.name)),
                _.create('ul', { class: 'check' },
                    traitElements,
                ),
            ),
        );
    }
}

class ActivityCard extends SaxComponent {
    constructor(props) {
        super();
        this.state = props;
    }

    render() {
        return _.create('a', { class: 'actionImage', href: `activity.html?activity=${this.state.tag}` },
            _.create('img', { src: this.state.img, alt: this.state.title }),
            _.create('span', this.state.title),
        );
    }
}

class LocationRow extends SaxComponent {
    constructor(propsArr) {
        super();
        this.children = [];
        this.filter = null;
        for (let i = 0; i < propsArr.length; i++) {
            this.children.push(new LocationCard(propsArr[i]));
        }
    }

    addFilter(filter) {
        this.filter = filter;
    }

    render() {
        let renderChildren = [];
        if (this.filter !== null) {
            for (let i = 0; i < this.children.length; i++) {
                if (this.children[i].filter(this.filter)) {
                    renderChildren.push(this.children[i]);
                }
            }
        } else {
            renderChildren = this.children;
        }

        return _.create('div', { id: 'location-row', class: 'row' }, renderChildren);
    }
}

class ActivityRow extends SaxComponent {
    constructor(props) {
        super();
        this.state = props;
    }

    render() {
        return _.create('div', { class: 'row' },
            _.create('div', { class: 'image-wrapper' },
                _.create('div', { class: 'actionImage' },
                    _.create('a', { href: `activity.html?activity=${this.state.tag}` },
                        _.create('img', { src: this.state.img, alt: this.state.title }),
                    ),
                ),

            ),
            _.create('div', { class: 'description' },
                _.create('h2',
                    _.create('a', { href: `activity.html?activity=${this.state.tag}` },
                        this.state.title,
                    ),
                ),
                _.create('p', this.state.description),
            ),
        );
    }
}

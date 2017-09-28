
class LocationCard extends SaxComponent {
    constructor(props) {
        super();
        this.state = props;
    }

    filter(filterObj) {
        if (filterObj.hasOwnProperty('country') && filterObj.country !== this.state.country) {
            return false;
        }
        if (filterObj.hasOwnProperty('days')) {
            for (let i = 0; i < this.state.prices; i++) {
                let success = false;
                if (this.state.prices[i].days === filterObj.days) {
                    success = true;
                    if (filterObj.hasOwnProperty('price')) {
                        return this.state.prices[i].price <= filterObj.price;
                    }
                }
                if (!success) {
                    return false;
                }
            }
        } else if (filterObj.hasOwnProperty('price')) {
            for (let i = 0; i < this.state.prices; i++) {
                if (this.state.prices[i].price === filterObj.price) {
                    return true;
                }
            }
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
        return _.create('a', { class: 'actionImage' },
            _.create('img', { src: this.state.img, alt: this.state.title }),
            _.create('span', this.state.title),
        );
    }
}

class LocationRow extends SaxComponent {
    constructor(propsArr) {
        super();
        this.children = [];
        for (let i = 0; i < propsArr.length; i++) {
            this.children.push(new LocationCard(propsArr[i]));
        }
    }

    render() {
        return _.create('div', { class: 'row' }, this.children);
    }
}

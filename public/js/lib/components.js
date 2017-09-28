
class LocationCard extends SaxComponent {
    constructor(json) {
        super();
        this.id = json.id;
        this.name = json.name;
        this.image = json.img;
        this.traits = json.traits;
    }

    render() {
        const traitElements = [];
        for (let i = 0; i < this.traits.length; i++) {
            traitElements.push(_.create('li', this.traits[i]));
        }

        return _.create('a', { class: 'object-card', href: `location.html?id=${this.id}` },
            _.create('div', { class: 'image' },
                _.create('img', { src: this.image }),
            ),
            _.create('div', { class: 'description' },
                _.create('h3', (this.name)),
                _.create('ul', { class: 'check' },
                    traitElements,
                ),
            ),
        );
    }
}

class ActivityCard extends SaxComponent {
    constructor(json) {
        super();
        this.title = json.title;
        this.image = json.img;
    }

    render() {
        return _.create('a', { class: 'actionImage' },
            _.create('img', { src: this.image, alt: this.title }),
            _.create('span', this.title),
        );
    }
}

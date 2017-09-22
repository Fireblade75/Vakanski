class Carrousel {
    constructor(tag) {
        if (tag === undefined) {
            tag = '.carrousel';
        }
        this.carrousel = _(tag).children().filter('.background');
    }

    next() {
        const lastImage = this.carrousel.children().last();
        const cloneImage = lastImage.clone();
        this.carrousel.prependNode(cloneImage);

        setTimeout(() => this.carrousel.removeChild('last'), 1000);
    }

    repeat(milliseconds = 5000) {
        this.interval = setInterval(() => this.next(), milliseconds);
    }

    stop() {
        clearInterval(this.interval);
    }
}

let carrousel;

_.onReady(function initCarrousel() {
    carrousel = new Carrousel();
    carrousel.repeat();
});


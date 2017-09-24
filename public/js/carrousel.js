class Carrousel {
    constructor(tag) {
        if (tag === undefined) {
            tag = '.carrousel';
        }
        this.carrousel = _(tag).children().filter('.background');
        this.milliseconds = 5000;
    }

    next() {
        const lastImage = this.carrousel.children().last();
        const cloneImage = lastImage.clone();
        this.carrousel.prependNode(cloneImage);

        setTimeout(() => this.carrousel.removeChild('last'), 800);
    }

    repeat(milliseconds) {
        if (this.interval == null) {
            if (milliseconds instanceof Number) {
                this.milliseconds = milliseconds;
            }

            this.interval = setInterval(() => this.next(), this.milliseconds);
            document.addEventListener('visibilitychange', this.pauze, false);
        }
    }

    stop() {
        clearInterval(this.interval);
        this.interval = null;
    }

    pauze() {
        let carrousel = this;
        if (!(carrousel instanceof Carrousel)) {
            carrousel = globalCarrousel;
        }

        if (document.hidden) {
            carrousel.stop();
        } else {
            carrousel.repeat();
        }
    }
}

let globalCarrousel;

_.onReady(function initCarrousel() {
    globalCarrousel = new Carrousel();
    globalCarrousel.repeat();
});

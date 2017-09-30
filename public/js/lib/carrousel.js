/**
 * A class that manages the carrousel on the front page
 */
class Carrousel {
    /**
     * Creates the carrousel manager by linking to the carrousel in the DOM
     * @param {string} id the id of the carrousel
     */
    constructor(id) {
        if (id === undefined) {
            id = '#carrousel';
        }
        this.carrousel = _(id).children().filter('.background');
        this.milliseconds = 5000;
    }

    /**
     * Shows the next image in the carrousel
     */
    next() {
        const lastImage = this.carrousel.children().last();
        const cloneImage = lastImage.clone();
        this.carrousel.prependNode(cloneImage);

        setTimeout(() => this.carrousel.removeChild('last'), 800);
    }

    /**
     * Calls the next() method with an interval. The ammount of milliseconds to use
     * should be more than 800ms.
     * @param {number} milliseconds the ammount of millisecods for the interval
     */
    repeat(milliseconds) {
        if (this.interval == null) {
            if (milliseconds instanceof Number) {
                if (milliseconds < 800) {
                    throw Error('The ammount of milliseconds can not be less than the animation length');
                }
                this.milliseconds = milliseconds;
            }

            this.interval = setInterval(() => this.next(), this.milliseconds);
            document.addEventListener('visibilitychange', this.pauze, false);
        }
    }

    /**
     * Stops the current repeat interval
     */
    stop() {
        clearInterval(this.interval);
        this.interval = null;
    }

    /**
     * Pauzes or unpauzes the carrousels repeat interval
     */
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


class Carrousel {
    init(id) {
        if (id === undefined) {
            id = '.carrousel';
        }
        this.carrousel = _('.carrousel').children().filter('.background');
    }

    next() {
        const lastImage = this.carrousel.children().last();
        const cloneImage = lastImage.clone();
        this.carrousel.prependNode(cloneImage);

        setTimeout(() => { this.carrousel.removeChild('last'); }, 1000);
    }
}

const carrousel = new Carrousel();

_.onReady(function initCarrousel() {
    carrousel.init();
    setInterval(() => carrousel.next(), 5000);
});


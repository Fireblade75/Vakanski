
class Carrousel {
    init(id) {
        if (id === undefined) {
            id = '.carrousel';
        }
        this.carrousel = _('.carrousel').children().filter('.background');
    }

    next() {
        return this;
    }
}

const carrousel = new Carrousel();

_.onReady(function initCarrousel() {
    carrousel.init();
});


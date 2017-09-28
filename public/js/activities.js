
_.onReady(function onReady() {
    _('#category-section').clear();

    DataManager.getAllActivites(function handle(response) {
        for (let i = 0; i < response.length; i++) {
            const category = _.create('div', { class: 'row' },
                _.create('div', { class: 'image-wrapper' },
                    _.create('div', { class: 'actionImage' },
                        _.create('a', { href: `activity.html?activity=${response[i].tag}` },
                            _.create('img', { src: response[i].img, alt: response[i].title }),
                        ),
                    ),

                ),
                _.create('div', { class: 'description' },
                    _.create('h2',
                        _.create('a', { href: `activity.html?activity=${response[i].tag}` },
                            response[i].title,
                        ),
                    ),
                    _.create('p', response[i].description),
                ),
            );
            _('#category-section').append(category);
        }
    });
});

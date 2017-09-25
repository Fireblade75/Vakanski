
_.onReady(function onReady() {
    _('#category-section').clear();

    DataManager.getActivity(DataManager.getParameter('activity'), function handle(response) {
        const category = _.create('div', { class: 'row' },
            _.create('div', { class: 'image-wrapper' },
                _.create('div', { class: 'actionImage' },
                    _.create('img', { src: response.img, alt: response.title }),
                ),

            ),
            _.create('div', { class: 'description' },
                _.create('h2',
                    response.title,
                ),
                _.create('p', response.description),
            ),
        );
        _('#category-section').append(category);
    });
});
_.onReady(function () {
    _('#contact-button').onClick(function () {
        _('.contact-intro-text').clear();
        const input = _.create('input', { type='text'});
        _('#contact-button').append(input);
    });
});
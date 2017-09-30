_.onReady(function () {
    var active = false;
    _('#contact-button').onClick(function () {

        if (!active) {
            active = true;
            _('.contact-intro-text').clear();
            const input = _.create('textarea', { id: 'input-contact' });
            _('.contact-intro-text').append(input);

            _('#contact-button').html('Verstuur');
            _('contact-intro-header').html('Wat wilt u vragen?');
        } else {

            _('.contact-intro').removeChild('last');
            _('#contact-intro-text').removeChild('last');
            _('#contact-intro-header').html('Helemaal klaar');
            _('#contact-intro-text').html('Bedankt voor uw contactverzoek. We nemen zo spoedig mogelijk contact met u op.');
        }

    });
});
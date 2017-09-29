_.onReady(function () {
    var active = false;
    _('#contact-button').onClick(function () {
        
        if (!active) {
            active = true;
            _('.contact-intro-text').clear();
            const input = _.create('textarea', { id: 'input-contact' });
            _('.contact-intro-text').append(input);

            var button = document.getElementById('contact-button');
            button.innerHTML = 'Verstuur';

            document.getElementById('contact-intro-header').innerHTML = 'Wat wilt u vragen?';
        } else {
            
            
            document.getElementById('contact-intro-header').innerHTML = 'Helemaal klaar';

            document.getElementById('contact-intro-text').innerHTML = 'Bedankt voor uw vraag, we nemen zo snel mogelijk contact met u op.'

        }

    });
});
_.onReady(function () {
    _('#contact-button').onClick(function () {

        _('.contact-intro-text').clear();
        const input = _.create('textarea', { id: 'input-contact' });
        _('.contact-intro-text').append(input);


        var button = document.getElementById('contact-button');
        button.innerHTML = 'Verstuur';
        button.id = 'contact-verstuur';

        document.getElementById('contact-intro-header').innerHTML = 'Wat wilt u vragen?';


    });
    _('#contact-verstuur').onClick(function () {
        
    });
});
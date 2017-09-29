
_.onReady(function init() {
    _('#hamburger-icon').onClick(function toggleActive() {
        _('#dropdown-links').toggleClass('active');
    });
});

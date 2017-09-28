
let locationRow;

_.onReady(function onReady() {
    DataManager.getAllLocations(function getAllLocations(locations) {
        locationRow = new LocationRow(locations);
        redraw();
    });

    _('#search-form').onSubmit(function onSubmit(event) {
        event.preventDefault();
        const filter = {};

        const country = _('#country-select').val();
        if (country !== 'Land') {
            filter.country = country;
        }

        const price = _('#price-select').val();
        if (price !== 'Prijs') {
            filter.price = Number(price);
        }

        const days = _('#days-select').val();
        if (days !== 'Dagen') {
            const [minDays, maxDays] = days.split('-');
            filter.days = { min: minDays, max: maxDays };
        }

        locationRow.addFilter(filter);
        redraw();
        return false;
    });
});

function redraw() {
    _('#location-row').replaceNode(locationRow);
}

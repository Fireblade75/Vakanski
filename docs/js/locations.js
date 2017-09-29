
let locationRow;

_.onReady(function onReady() {
    DataManager.getAllLocations(function searchLocations(locations) {
        const filter = {};
        const country = DataManager.getParameter('country');
        if (country !== undefined && country !== '') {
            _('#country-select').val(country);
            filter.country = country;
        }

        const price = DataManager.getParameter('price');
        if (price !== undefined && price !== '') {
            _('#price-select').val(price);
            filter.price = price;
        }

        const days = DataManager.getParameter('days');
        if (days !== undefined && days !== '') {
            _('#days-select').val(days);
            const [minDays, maxDays] = days.split('-');
            filter.days = { min: minDays, max: maxDays };
        }

        locationRow = new LocationRow(locations);
        locationRow.addFilter(filter);
        redraw();
    });

    _('#search-form').onSubmit(function searchLocations(event) {
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

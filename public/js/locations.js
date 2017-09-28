_.onReady(function onReady() {
    DataManager.getAllLocations(function getAllLocations(locations) {
        _('#location-row').replaceNode(new LocationRow(locations));
    });

    _('#search-form');
});

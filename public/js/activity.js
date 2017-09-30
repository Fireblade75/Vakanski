
_.onReady(function onReady() {
    _('#category-section').clear();

    DataManager.getActivity(DataManager.getParameter('activity'), function handle(response) {
        const activityRow = new ActivityRow(response);
        _('#category-section').appendNode(activityRow);
        for (let i = 0; i < response.featuredLocations.length; i++) {
            addFeaturedLocation(response.featuredLocations[i]);
        }
    });
});

function addFeaturedLocation(index) {
    DataManager.getLocation(index, function handle(response) {
        const locationCard = new LocationCard(response);
        _('#location-row').appendNode(locationCard);
    });
}

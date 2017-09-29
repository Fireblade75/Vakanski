
_.onReady(function onReady() {
    _('#category-section').clear();

    DataManager.getAllActivites(function handle(response) {
        for (let i = 0; i < response.length; i++) {
            let activityRow = new ActivityRow(response[i]);
            _('#category-section').appendNode(activityRow);
        }
    });
});


_.onReady(function init() {
    _('#activities-row').clear();

    DataManager.getAllActivites(function handle(response) {
        for (let i = 0; i < response.length; i++) {
            addActivity(response[i]);
        }
    });
});

function addActivity(json) {
    const activityCard = new ActivityCard(json);
    _('#activities-row').append(activityCard);
}

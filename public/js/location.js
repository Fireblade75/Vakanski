
_.onReady(function onReady() {
    DataManager.getLocation(DataManager.getParameter('id'), function handle(response) {
        _('#location-title').html(response.name);
        _('#location-span').html(response.location);
        _('#location-image').src(response.img);

        const traitsUl = _('#location-traits');
        traitsUl.clear();
        for (let i = 0; i < response.traits.length; i++) {
            traitsUl.append(_.create('li', response.traits[i]));
        }

        const pricesUl = _('#location-prices');
        pricesUl.clear();
        for (let i = 0; i < response.prices.length; i++) {
            const price = _.formatCurrency(response.prices[i].price, '\u20AC', ',');
            const label = `${response.prices[i].days} dagen: ${price}`;
            pricesUl.append(_.create('li', label));
        }
    });
});

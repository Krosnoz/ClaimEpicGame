"use strict";

async function freeGamesPromotions(client, country = "FR", allowCountries = "FR", locale = "fr-FR") {
    let { data } = await client.freeGamesPromotions(country, allowCountries, locale);
    let { elements } = data.Catalog.searchStore;
    let free = elements.filter((offer) => offer.promotions
        && offer.promotions.promotionalOffers.length > 0
        && offer.promotions.promotionalOffers[0].promotionalOffers.find((p) => p.discountSetting.discountPercentage === 0));

    let freeOffers =  await Promise.all(free.map(async(promo) => {
        return {
            "title":     promo.title,
            "id":        promo.id,
            "namespace": promo.namespace,
        };
    }));

    return freeOffers;
}

module.exports = { freeGamesPromotions };
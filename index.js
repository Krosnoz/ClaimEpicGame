const { "Launcher": EpicGames } = require("epicgames-client");
const { freeGamesPromotions } = require("./src/gamePromotions");

const Auths = require('./device_auths.json');

(async () => {

  for (let email in Auths) {
    let useDeviceAuth = true;
    let client = new EpicGames({ email });

    if (!await client.init()) {
      console.log("Error while initialize process.");
      break;
    }

    let freePromos = await freeGamesPromotions(client);

    console.log(`Found ${freePromos.length} game for ${email}`);

    let success = await client.login({ useDeviceAuth }).catch(() => false);
    if (!success) {
      console.log(`Failed to login as ${client.config.email}`);
      continue;
    }

    console.log(`Logged in as ${client.account.name} (${client.account.id})`);

    for (let offer of freePromos) {
      try {
        let purchased = await client.purchase(offer, 1);
        if (purchased) {
          console.log(`Successfully claimed ${offer.title} (${purchased})`);
        } else {
          console.log(`${offer.title} was already claimed for this account`);
        }

      } catch (err) {
        console.log(`Failed to claim ${offer.title} (${err})`);
        if (err.response
          && err.response.body
          && err.response.body.errorCode === "errors.com.epicgames.purchase.purchase.captcha.challenge") {
          console.log("Need captcha?");
          break;
        }
      }
    }
    await client.logout();
    console.log(`Logged ${client.account.name} out of Epic Games`);
  }
})();
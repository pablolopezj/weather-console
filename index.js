import * as dotenv from "dotenv";
import {
  leerInput,
  inquirerMenu,
  pausa,
  listPlaces,
} from "./helpers/inquiere.js";
import { Searches } from "./models/search.js";
dotenv.config();

const main = async () => {
  const searches = new Searches();

  let opt = "";

  do {
    opt = await inquirerMenu();

    switch (opt) {
      case "1":
        // Show menssage
        const term = await leerInput("City");
        // Search places
        const places = await searches.city(term);
        const id = await listPlaces(places);
        if (id === "0") continue;
        const { name, lat, lng } = places.find((l) => l.id === id);

        //Save on DB
        searches.addHistory(name);

        // Weather
        const weather = await searches.weatherPlace(lat, lng);

        // Show results
        console.clear();
        console.log("\n City information\n".green);
        console.log("City", name);
        console.log("Lat", lat);
        console.log("Lng", lng);
        console.log("Temperature", weather.temp);
        console.log("Min", weather.min);
        console.log("Max", weather.max);
        console.log("Weather description", weather.desc.green);
        break;

      case "2":
        searches.historyCapitalized.forEach((place, i) => {
          const idx = `${i + 1}`.green;
          console.log(`${idx} ${place}`);
        });
        break;
    }

    if (opt !== "0") await pausa();
  } while (opt !== "0");
};

main();

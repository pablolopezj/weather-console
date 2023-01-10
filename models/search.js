import fs from "fs";
import axios from "axios";

class Searches {
  history = [];
  dbPath = "./db/database.json";

  constructor() {
    this.readDB();
  }

  get historyCapitalized() {
    const capitalizedHstory = [];
    this.history.map((place) => {
      capitalizedHstory.push(this.capitlizedString(place));
    });

    return capitalizedHstory;
  }

  get paramsMapbox() {
    return {
      access_token: process.env.MAPBOX_KEY,
      limit: 5,
      language: "es",
    };
  }

  get paramsOpenWeather() {
    return {
      appid: process.env.OPENWEATHERMAP_KEY,
      units: "metric",
      lang: "es",
    };
  }

  capitlizedString(str = "") {
    const arr = str.split(" ");
    for (let i = 0; i < arr.length; i++) {
      arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
    }

    const str2 = arr.join(" ");
    return str2;
  }

  async city(place = "") {
    try {
      const instance = axios.create({
        baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${place}.json`,
        params: this.paramsMapbox,
      });

      const resp = await instance.get();

      return resp.data.features.map((place) => ({
        id: place.id,
        name: place.place_name,
        lng: place.center[0],
        lat: place.center[1],
      }));
    } catch (error) {
      return []; // Return places
    }
  }

  async weatherPlace(lat, lon) {
    try {
      // instance axios.create()
      const instance = axios.create({
        baseURL: `https://api.openweathermap.org/data/2.5/weather`,
        params: {
          ...this.paramsOpenWeather,
          lat,
          lon,
        },
      });

      const resp = await instance.get();
      const { weather, main } = resp.data;
      return {
        desc: weather[0].description,
        min: main.temp_min,
        max: main.temp_max,
        temp: main.temp,
      };
    } catch (err) {
      console.log(err);
    }
  }

  addHistory(place = "") {
    //Prevenir duplicados

    if (this.history.includes(place.toLocaleLowerCase())) {
      return;
    }

    this.history.unshift(place.toLocaleLowerCase());

    this.saveDB();
  }

  saveDB() {
    const payload = {
      history: this.history,
    };

    fs.writeFileSync(this.dbPath, JSON.stringify(payload));
  }

  readDB() {
    if (!fs.existsSync(this.dbPath)) {
      return null;
    }

    const info = fs.readFileSync(this.dbPath, { encoding: "utf-8" });
    const data = JSON.parse(info);
    this.history = data.history;
  }
}

export { Searches };

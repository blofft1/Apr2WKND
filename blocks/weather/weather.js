// blocks/weather/weather.js
// TIER ① INTEGRATION: fetch public third-party data in the browser.
// No API key, no server, no secret — so it's safe to run client-side.
// APIs used (both public, no key, CORS-enabled): open-meteo geocoding + forecast.

const WEATHER_CODES = {
  0: "Clear sky", 1: "Mainly clear", 2: "Partly cloudy", 3: "Overcast",
  45: "Fog", 48: "Rime fog", 51: "Light drizzle", 53: "Drizzle", 55: "Dense drizzle",
  61: "Light rain", 63: "Rain", 65: "Heavy rain", 71: "Light snow", 73: "Snow",
  75: "Heavy snow", 80: "Rain showers", 81: "Rain showers", 82: "Violent showers",
  95: "Thunderstorm", 96: "Thunderstorm w/ hail", 99: "Thunderstorm w/ hail",
};

export default async function decorate(block) {
  // 1) Read the city the AUTHOR typed into the block, then clear it.
  const city = block.textContent.trim() || "Portland";
  block.textContent = "";

  // 2) Show a loading state immediately (page is already visible + cached).
  const card = document.createElement("div");
  card.className = "weather-card";
  card.innerHTML = `<p class="weather-loading">Loading weather for ${city}…</p>`;
  block.append(card);

  try {
    // 3) Geocode the city name -> latitude/longitude (public, no key).
    const geoRes = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`
    );
    const geo = await geoRes.json();
    if (!geo.results || geo.results.length === 0) {
      throw new Error(`Couldn't find “${city}”.`);
    }
    const { latitude, longitude, name, country } = geo.results[0];

    // 4) Fetch current weather for those coordinates (public, no key).
    const wxRes = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}` +
        `&current=temperature_2m,weather_code,wind_speed_10m`
    );
    const wx = await wxRes.json();
    const current = wx.current;
    const description = WEATHER_CODES[current.weather_code] ?? "—";

    // 5) Render the real data.
    card.innerHTML = `
      <div class="weather-place">${name}, ${country}</div>
      <div class="weather-temp">${Math.round(current.temperature_2m)}°C</div>
      <div class="weather-desc">${description}</div>
      <div class="weather-wind">Wind ${Math.round(current.wind_speed_10m)} km/h</div>
      <div class="weather-updated">Live · fetched ${new Date().toLocaleTimeString()}</div>
    `;
  } catch (err) {
    // 6) Always handle failure — third-party APIs go down.
    card.innerHTML = `<p class="weather-error">${err.message || "Weather unavailable right now."}</p>`;
  }
}
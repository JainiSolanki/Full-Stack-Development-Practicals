const searchInput = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");
const weatherIcon = document.querySelector(".weather img");

// Hardcoded weather data
const CityNames = [
  { name: "Bharuch", temp: "22°C" },
  { name: "Vadodra", temp: "18°C" },
  { name: "Nadiad", temp: "28°C" },
  { name: "Surat", temp: "35°C" },
  { name: "Mumbai", temp: "40°C" },
  { name: "Delhi", temp: "15°C" },
  { name: "Bangalore", temp: "25°C" },
  { name: "Chennai", temp: "32°C" },
  { name: "Kolkata", temp: "30°C" },
  { name: "Hyderabad", temp: "27°C" },
  { name: "Pune", temp: "24°C" },
  { name: "Ahmedabad", temp: "29°C" },
];

async function checkWeather(city) {
  const cityData = CityNames.find(
    (cityName) => cityName.name.toLowerCase() === city.toLowerCase()
  );

  if (cityData) {
    document.querySelector(".city").innerHTML = cityData.name;
    document.querySelector(".temp").innerHTML = cityData.temp;
    document.querySelector(".weather-icon").src = "./assets/clouds.png";

    document.querySelector(".weather").style.display = "block";
    document.querySelector(".error").style.display = "none";
  } else {
    document.querySelector(".weather").style.display = "none";
    document.querySelector(".error").style.display = "block";
  }
}

searchBtn.addEventListener("click", () => {
  checkWeather(searchInput.value);
});

// Add Enter key functionality
searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    checkWeather(searchInput.value);
  }
});

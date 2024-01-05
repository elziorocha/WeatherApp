var weatherApi = "/weather";
const weatherForm = document.querySelector("form");
const search = document.querySelector("input");
const weatherIcon = document.querySelector(".weatherIcon i");
const weatherCondition = document.querySelector(".weatherCondition");
const tempElement = document.querySelector(".temperature span");
const locationElement = document.querySelector(".place");
const dateElement = document.querySelector(".date");
const currentDate = new Date();
const options = { month: "long" };
const monthName = currentDate.toLocaleString('pt-BR', options);
const monthName2 = monthName.charAt(0).toUpperCase() + monthName.slice(1)

dateElement.textContent = currentDate.getDate() + ' de ' + monthName2;

weatherForm.addEventListener("submit", (e) => {
  e.preventDefault();
  //   console.log(search.value);
  locationElement.textContent = "Carregando...";
  weatherIcon.className = "";
  tempElement.textContent = "";
  weatherCondition.textContent = "";

  showData(search.value);
});

if ("geolocation" in navigator) {
  locationElement.textContent = "Carregando...";
  navigator.geolocation.getCurrentPosition(
    function (position) {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      const apiUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;

      fetch(apiUrl)
        .then((response) => response.json())
        .then((data) => {
          if (data && data.address && data.address.city) {
            const city = data.address.city;

            showData(city);
          } else {
            console.error("Cidade não encontrada.");
          }
        })
        .catch((error) => {
          console.error("Erro ao sincronizar dados:", error);
        });
    },
    function (error) {
      console.error("Erro ao conseguir localização:", error.message);
    }
  );
} else {
  console.error("Geolocalização não é permitida no seu navegador.");
}

function traduzirDescricao(descricao) {
    const traducoes = {
      "clear sky": "céu limpo",
      "few clouds": "poucas nuvens",
      "scattered clouds": "nuvens dispersas",
      "broken clouds": "nuvens quebradas",
      "shower rain": "chuva isolada",
      "rain": "chuva",
      "thunderstorm": "tempestade",
      "snow": "neve",
      "overcast clouds": "nuvens carregadas",
      "fog": "névoa"
    };
    return traducoes[descricao.toLowerCase()] || descricao;
};

function showData(city) {
  getWeatherData(city, (result) => {
    console.log(result);
    if (result.cod == 200) {
      if (
        result.weather[0].description == "rain" ||
        result.weather[0].description == "fog"
      ) {
        weatherIcon.className = "wi wi-", + result.weather[0].description;
      } else {
        weatherIcon.className = "wi wi-day-cloudy";
      }
      locationElement.textContent = result?.name;
      tempElement.textContent =
        (result?.main?.temp - 273.5).toFixed(1) + String.fromCharCode(176);
      weatherCondition.textContent =
      traduzirDescricao(result?.weather[0]?.description)?.toUpperCase();

    } else {
      locationElement.textContent = "Cidade não encontrada.";
    }
  });
}

function getWeatherData(city, callback) {
  const locationApi = weatherApi + "?address=" + city;
  fetch(locationApi).then((response) => {
    response.json().then((response) => {
      callback(response);
    });
  });
}
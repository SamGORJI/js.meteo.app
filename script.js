const notificationElement = document.querySelector(".notification");
const iconElement = document.querySelector(".weather-icon");
const tempElement = document.querySelector(".temperature-value p");
const descElement = document.querySelector(".temperature-description p");
const locationElement = document.querySelector(".location p");

const weather = {};
weather.temperature = {
	unit: "celsius"
}

const K = 273;	



if ("geolocation" in navigator){
	navigator.geolocation.getCurrentPosition(setPosition, showError);
} else {
	notificationElement.style.display = "block";
	notificationElement.innerHTML = "<p>Browser doesn't support geolocation.</p>"
}

let changerDeVille = document.querySelector('#changer');
changerDeVille.addEventListener('click', () => {
  ville = prompt('Quelle ville souhaitez-vous voir ?');
  recevoirTemperature(ville);
});
 
function erreur(){
  villeChoisie = "Paris";
  recevoirTemperature(villeChoisie);
}

function recevoirTemperature(ville) {
	const url = 'https://api.openweathermap.org/data/2.5/weather?q=' + ville + '&appid=57795db36d12d770a9c5673c7407b4da&units=metric';
	
	  let requete = new XMLHttpRequest(); 
	  requete.open('GET', url); 
	  requete.responseType = 'json'; 
	  requete.send(); 
	
	  requete.onload = function() {
		if (requete.readyState === XMLHttpRequest.DONE) {
		  if (requete.status === 200) {
			let reponse = requete.response; 
			let temperature = reponse.main.temp;
			let ville = reponse.name;
			document.querySelector('.temperature-value').textContent = temperature + "°C";
			document.querySelector('#ville').textContent = ville;
		  }
		  else {
			alert('Merci de selectionner une ville valide.');
		  }
		}
	  }
	}

function setPosition (position) {
	let latitude = position.coords.latitude;
	let longitude = position.coords.longitude;
	getWeather(latitude, longitude);
}

function showError (error) {
	notificationElement.style.display = "block";
	notificationElement.innerHTML = `<p>${error.message}</p>`;
}


function getWeather(latitude, longitude) {
	const api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&APPID=5d02e70991a1daa5f8144ab196d1e9ac`;
	fetch(api)
		.then(function(response){
			let data = response.json();
			return data;
		})
		.then(function (data) {
			weather.temperature.value = Math.floor(data.main.temp - K);
			weather.description = data.weather[0].description;
			weather.iconId = data.weather[0].icon;
			weather.city = data.name;
			weather.country = data.sys.country;
		})
		.then(function () {
		displayWeather();
		});
}


function displayWeather () {
	iconElement.innerHTML = `<img src="icons-weather/${weather.iconId}.svg" alt="${weather.description}"/>`;
	tempElement.innerHTML = `${weather.temperature.value} ° <span>C</span>`;
	descElement.innerHTML = weather.description;
	locationElement.innerHTML = `${weather.city}, ${weather.country}`;
}


function celsiusToF(temperature) {
	return temperature * 9/5 +32;
}


tempElement.addEventListener("click", () => {
	if (weather.temperature.unit === undefined) return;
	if (weather.temperature.unit === "celsius"){
		let fahrenheit = celsiusToF(weather.temperature.value);
		fahrenheit = Math.floor(fahrenheit);
		tempElement.innerHTML = `${fahrenheit}° <span>F</span>`;
		weather.temperature.unit = "fahrenheit";
	} else {
		tempElement.innerHTML = `${weather.temperature.value}° <span>C</span>`;
		weather.temperature.unit = "celsius";
	}
});













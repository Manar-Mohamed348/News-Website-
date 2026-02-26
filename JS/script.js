var main = document.querySelector(".container header nav ul li#index");
var matches = document.querySelector(".container header nav ul li#Matches");
var standings = document.querySelector(".container header nav ul li#Standings");
var topScorers = document.querySelector(".container header nav ul li#TopScorers");

var politicsNews = document.querySelectorAll(".politics .news div");
var economyNews = document.querySelectorAll(".economy .news div");

var amount = document.getElementById("amount");
var converted = document.getElementById("Converted");
var currencySelectFrom = document.getElementById("currency-select-from");
var currencySelectTo = document.getElementById("currency-select-to");
var button = document.querySelector(".aside .currency button");

var API_KEY2 = "pub_f4b0aba9576a422ea57b3f1a2ff7fa89";
var API_KEY3 = "aa84a3b0d4a862497f2fadce42d89f30";
var API_KEY4 = "d627809b149970c8f1acd519";

var politicsNewsURL = `https://newsdata.io/api/1/latest?apikey=${API_KEY2}&q=politics&language=ar`;
var economyNewsURL = `https://newsdata.io/api/1/latest?apikey=${API_KEY2}&q=business&language=ar`;
var exchangeRateURL = `https://v6.exchangerate-api.com/v6/${API_KEY4}/latest/USD`;

navigator.geolocation.getCurrentPosition(pos => {
    var lat = pos.coords.latitude;
    var lon = pos.coords.longitude;
    var weatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY3}&units=metric&lang=ar`;
    $.ajax({
        url: weatherURL,
        dataType: 'json',
        type: 'GET',
        success: function (response) {
            console.log(response);
            var iconUrl = `https://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png`;
            $(".temp img").attr("src", iconUrl);
            $(".temp p").text(response.main.temp + " °C");
            $(".temp .description").text(response.weather[0].description);
            $(".temp .city").text(response.name);
        },
        error: function (errs) {
            console.log(errs);
        },
    });
});

main.addEventListener("click", () => {
    window.location.href = "../HTML/index.html";
});
matches.addEventListener("click", () => {
    window.location.href = "../HTML/Matches.html";
});
standings.addEventListener("click", () => {
    window.location.href = "../HTML/Standings.html";
});
topScorers.addEventListener("click", () => {
    window.location.href = "../HTML/TopScorers.html";
});

function setupNewsCard(element, imageUrl, title) {
    element.innerHTML = '';
    const imageDiv = document.createElement('div');
    imageDiv.className = 'news-image';
    if (imageUrl) {
        imageDiv.style.backgroundImage = `url('${imageUrl}')`;
    }

    const titleDiv = document.createElement('div');
    titleDiv.className = 'news-title';
    titleDiv.textContent = title || 'No title available';

    element.appendChild(imageDiv);
    element.appendChild(titleDiv);
}

// Politics News
$.ajax({
    url: politicsNewsURL,
    dataType: 'json',
    type: 'GET',
    success: function (response) {
        console.log("Politics News response",response);
        if (response && response.results) {
            for (var i = 0; i < 3; i++) {
                if (politicsNews[i] && response.results[i]) {
                    setupNewsCard(
                        politicsNews[i],
                        response.results[i].image_url,
                        response.results[i].title
                    );
                }
            }
        }
    },
    error: function (errs) {
        console.log(errs);
    },
});

// Economy News
$.ajax({
    url: economyNewsURL,
    dataType: 'json',
    type: 'GET',
    success: function (response) {
        console.log("economy News response",response);
        if (response && response.results) {
            for (var i = 0; i < 3; i++) {
                if (economyNews[i] && response.results[i]) {
                    setupNewsCard(
                        economyNews[i],
                        response.results[i].image_url,
                        response.results[i].title
                    );
                }
            }
        }
    },
    error: function (errs) {
        console.log(errs);
    },
});

button.addEventListener("click", () => {
    $.ajax({
        url: exchangeRateURL,
        dataType: 'json',
        type: 'GET',
        success: function (response) {
            var moneyAmount = parseFloat(amount.value);
            var from = currencySelectFrom.value;
            var to = currencySelectTo.value;
            console.log(response);
            if (response && response.conversion_rates) {
                var rate = response.conversion_rates[to] / response.conversion_rates[from];
                console.log("Exchange Rate:", rate);
                if (rate) {
                    var convertedMoney = moneyAmount * rate;
                    converted.value = convertedMoney.toFixed(4);
                } else {
                    console.error("Currency not found in exchange rates");
                    alert("Currency not supported");
                }
            }
        }
        ,
        error: function (errs) {
            console.log(errs);
        }
    });
});
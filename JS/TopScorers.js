// جدول الهدافين
$.ajax({
  url: "https://football-backend-production-8b1f.up.railway.app/laliga-topscorers",
  dataType: "json",
  type: "GET",
  success: function (data) {
    fetchTopScorers(data);
  },
  error: function (err) {
    console.error("Error fetching top scorers:", err);
  },
});

function fetchTopScorers(data) {
  for (var i = 0; i < data.length; i++) {
    var row = `
      <tr>
      <td>${data[i].penalties}</td>
      <td>${data[i].assists}</td>
      <td>${data[i].goals}</td>
      <td>${data[i].team}</td>
      <td>${data[i].name}</td>
      <td>${data[i].rank}</td>
      </tr>
    `;

    $("#topScores tbody").append(row);
  }
}

// جدول أقوى هجوم
$.ajax({
  url: "https://football-backend-production-8b1f.up.railway.app/laliga-attack",
  dataType: "json",
  type: "GET",
  success: function (data) {
    fetchBestAttack(data.bestAttack);
  },
  error: function (err) {
    console.log(err);
  },
});

function fetchBestAttack(data) {
  for (var i = 0; i < data.length; i++) {
    var row = `
           <tr>
           <td>${data[i].goals}</td>
           <td>${data[i].team}</td>
           <td>${data[i].rank}</td>
           </tr>
           `;

    $("#best-attack tbody").append(row);
  }
}

// اقوي دفاع
$.ajax({
  url: `https://football-backend-production-8b1f.up.railway.app/laliga-defense`,
  dataType: "json",
  type: "GET",
  success: function (data) {
    fetchBestDefense(data.bestDefense);
  },
  error: function (err) {
    console.log(err);
  },
});

function fetchBestDefense(data) {
  for (var i = 0; i < data.length; i++) {
    var row = `
    <tr>
    <td>${data[i].conceded}</td>
    <td> ${data[i].team}</td>
    <td>${data[i].rank}</td>
    </tr>
             `;

    $("#best-defense tbody").append(row);
  }
}

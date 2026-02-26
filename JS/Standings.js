// الإعدادات الأساسية
const apiKey = 'ba6e8e54882e45a4a0b79ff708baab10';
const proxy = "https://corsproxy.io/?";
const apiURL = 'https://api.football-data.org/v4/competitions/PD/standings';

function loadData() {
    $.ajax({
        headers: { 'X-Auth-Token': apiKey },
        url: proxy + apiURL, // تم توحيد الرابط هنا
        dataType: 'json',
        type: 'GET',
        success: function (data) {
            if (data.standings && data.standings[0]) {
                // نمرر البيانات للدالة المسؤولة عن الرسم
                drawTable(data.standings[0].table);
            }
        },
        error: function (err) { 
            console.error("خطأ في جلب البيانات:", err);
            document.getElementById('wait-msg').innerText = "عذراً، حدث خطأ أثناء تحميل البيانات.";
        }
    });
}

function drawTable(data) {
    const tableBody = document.getElementById('data-rows');
    let html = ''; 

    data.forEach(item => {
        // تحديد لون فرق الأهداف (أحمر للسالب، أخضر للموجب)
        const diffColor = item.goalDifference < 0 ? '#e11d48' : '#10b981';
        
        html += `
            <tr>
                <td>${item.position}</td>
                <td>
                    <div class="team-box">
                        <img src="${item.crest}" class="logo-img" onerror="this.src='https://via.placeholder.com/28'">
                        <span>${item.team.shortName || item.team.name}</span>
                    </div>
                </td>
                <td>${item.playedGames}</td>
                <td>${item.won}</td>
                <td>${item.draw}</td>
                <td>${item.lost}</td>
                <td>${item.goalsFor}</td>
                <td>${item.goalsAgainst}</td>
                <td style="color: ${diffColor}; font-weight: bold;">${item.goalDifference}</td>
                <td class="pts-style">${item.points}</td>
            </tr>
        `;
    });

    // تحديث المحتوى وإظهار الجدول
    tableBody.innerHTML = html;
    document.getElementById('wait-msg').style.display = 'none';
    document.getElementById('myTable').style.display = 'table';
}


    loadData();


// تحديث تلقائي كل دقيقة
setInterval(loadData, 60000);

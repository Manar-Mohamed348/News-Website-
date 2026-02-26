
        const apiKey = "516b553d2ede47d9ac759e3520ee7e7b";
        // The endpoint for La Liga matches
        // Add the proxy URL before your API URL
        const league = 'PD';
        const proxy = "https://corsproxy.io/?";
        const apiUrl = `https://api.football-data.org/v4/competitions/${league}/`;


        function diffTime(matchDate, type) {
            matchDate = new Date(matchDate);
            const now = new Date();
            const diff = Math.abs(matchDate - now);
            const diffHours = Math.floor(diff / (1000 * 60 * 60));
            const diffMinutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

            if (type === 'past') {
                if (diffHours === 0 && diffMinutes < 5) return "Just Finished";
                return diffHours > 24 ? `Ended ${Math.floor(diffHours / 24)}d ago` : `Ended ${diffHours}h ${diffMinutes}m ago`;
            }
            return diffHours > 24 ? `Starts in ${Math.floor(diffHours / 24)}d` : `Starts in ${diffHours}h ${diffMinutes}m`;

        }

        function displayMatches(matchesObj) {
            const $container = $('#matches-display');
            $container.empty();

            const now = new Date();

            const past = matchesObj
                .filter(m => m.status === 'FINISHED')
                .sort((a, b) => new Date(b.utcDate) - new Date(a.utcDate))
                .slice(1,3)
                .reverse();

            // 2. Get Live matches
            const live = matchesObj.filter(m => ['IN_PLAY', 'PAUSED'].includes(m.status));

            // 3. Get upcoming matches (next 6)
            const future = matchesObj
                .filter(m => ['TIMED', 'SCHEDULED'].includes(m.status))
                .sort((a, b) => new Date(a.utcDate) - new Date(b.utcDate))
                .slice(0, 6);

            const allMatches = [...past, ...live, ...future];


            allMatches.forEach(match => {
                const status = match.status;
                let badgeHTML, centerHTML;

                if (status === 'FINISHED') {
                    badgeHTML = `<span class="badge finished-badge">أنتهت</span>`;
                    centerHTML = `
                    <div class="score done-score">${match.score.fullTime.home} - ${match.score.fullTime.away}</div>
                    <div class="time-meta">${diffTime(match.utcDate, 'past')}</div>`;
                }
                else if (['IN_PLAY', 'PAUSED'].includes(status)) {
                    badgeHTML = `<span class="badge live-badge">● LIVE</span>`;
                    centerHTML = `
                    <div class="score live-score">${match.score.fullTime.home} - ${match.score.fullTime.away}</div>
                    <div class="time-meta" style="color:var(--live)">Match in Progress</div>`;
                }
                else {
                    badgeHTML = ``;
                    centerHTML = `
                    <div class="scheduled-time">${new Date(match.utcDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                    <div class="time-meta">${diffTime(match.utcDate, 'future')}</div>`;
                }

                const card = `
                <div class="match-card">
                    <div class="team">
                        <img src="${match.homeTeam.crest}"  alt="logo">
                        <span class="team-name">${match.homeTeam.shortName}</span>
                    </div>
                    <div class="info-panel">
                        ${badgeHTML}
                        ${centerHTML}
                    </div>
                    <div class="team">
                        <img src="${match.awayTeam.crest}"  alt="logo">
                        <span class="team-name">${match.awayTeam.shortName}</span>
                    </div>
                </div>`;
                $container.append(card);

            });



        }
        function displayStandings(table) {
            const $container = $('#standings-display');
            let html = `
            <table class="standings-table">
                <thead>
                    <tr><th>#</th><th>الفريق</th><th class="pts">النقاط</th></tr>
                </thead>
                <tbody>`;

            table.slice(0, 10).forEach(row => {
                html += `
                <tr>
                    <td class="pos">${row.position}</td>
                    <td>${row.team.shortName}</td>
                    <td class="pts"><b>${row.points}</b></td>
                </tr>`;
            });
            html += `</tbody></table>`;
            $container.html(html);
        }
        

        function loadMatches(){

            $.ajax({
                headers: { 'X-Auth-Token': apiKey },
                url: proxy + apiUrl + `matches`,  // Combine them
                dataType: 'json',
                type: 'GET',
                success: function (data) {
                    if (data.matches) displayMatches(data.matches);
                },  
                error: function (err) {
                    console.error("Match Fetch Error:", err);
                    $('#matches-display').html('<p style="color:blue; font-size:25px;">Failed to load matches.</p>');
                }
            });
        }
        function loadStandings(){
            $.ajax({
                headers: { 'X-Auth-Token': apiKey },
                url: proxy + apiUrl + `standings`,  // Combine them
                dataType: 'json',
                type: 'GET',
                success: function (data) {
                    if (data.standings) displayStandings(data.standings[0].table);
                },
                error: function (err) { 
                    console.error("Standings Fetch Error:", err); 
                }
            });
        }

loadMatches();
loadStandings();
setInterval(loadMatches,120000);
setInterval(loadStandings,600000);


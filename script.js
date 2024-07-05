const results = [];
const tournaments = {};
const athletes = [];
const adminPassword = 'securepassword'; // Das Passwort für den Admin-Bereich

function showAddTournamentForm() {
    document.getElementById('addTournamentForm').style.display = 'block';
}

function showAddAthleteForm() {
    document.getElementById('addAthleteForm').style.display = 'block';
}

function addTournament() {
    const tournamentName = document.getElementById('newTournamentName').value;
    if (tournamentName) {
        tournaments[tournamentName] = {};
        document.getElementById('tournament').innerHTML += `<option value="${tournamentName}">${tournamentName}</option>`;
        document.getElementById('newTournamentName').value = '';
        document.getElementById('addTournamentForm').style.display = 'none';
        saveData();
    }
}

function addAthlete() {
    const athlete = {
        name: document.getElementById('newAthleteName').value,
        ageClass: document.getElementById('newAthleteAgeClass').value,
        discipline: document.getElementById('newAthleteDiscipline').value,
        number: document.getElementById('newAthleteNumber').value,
        club: document.getElementById('newAthleteClub').value,
    };
    if (athlete.name && athlete.ageClass && athlete.discipline && athlete.number && athlete.club) {
        athletes.push(athlete);
        if (!tournaments[document.getElementById('tournament').value][athlete.ageClass]) {
            tournaments[document.getElementById('tournament').value][athlete.ageClass] = {};
        }
        if (!tournaments[document.getElementById('tournament').value][athlete.ageClass][athlete.discipline]) {
            tournaments[document.getElementById('tournament').value][athlete.ageClass][athlete.discipline] = [];
        }
        tournaments[document.getElementById('tournament').value][athlete.ageClass][athlete.discipline].push(athlete);
        document.getElementById('newAthleteName').value = '';
        document.getElementById('newAthleteAgeClass').value = '';
        document.getElementById('newAthleteDiscipline').value = '';
        document.getElementById('newAthleteNumber').value = '';
        document.getElementById('newAthleteClub').value = '';
        document.getElementById('addAthleteForm').style.display = 'none';
        saveData();
    }
}

function calculateAndSaveScore() {
    const athleteName = document.getElementById('athlete').value;
    const tournament = document.getElementById('tournament').value;
    const ageClass = document.getElementById('ageClass').value;
    const discipline = document.getElementById('discipline').value;
    const scores = [];
    
    for (let i = 1; i <= 7; i++) {
        let score = parseFloat(document.getElementById('judge' + i).value);
        if (!isNaN(score)) {
            scores.push(score);
        }
    }

    if (scores.length !== 7) {
        alert("Bitte geben Sie alle 7 Wertungen ein.");
        return;
    }

    let maxScore = Math.max(...scores);
    let minScore = Math.min(...scores);
    let totalScore = scores.reduce((a, b) => a + b, 0);
    let totalScoreWithoutStreich = totalScore - maxScore - minScore;
    let finalScore = totalScoreWithoutStreich / 5;

    const athlete = athletes.find(a => a.name === athleteName);

    document.getElementById('result').innerText = `
        Durchschnittliche Wertung: ${finalScore.toFixed(2)}
        Gesamtsumme (alle): ${totalScore}
        Streichwertungen: ${maxScore}, ${minScore}
        Gesamtsumme (5): ${totalScoreWithoutStreich}
    `;

    results.push({
        tournament, 
        ageClass, 
        discipline, 
        athleteName, 
        number: athlete.number, 
        club: athlete.club, 
        totalScore, 
        maxScore, 
        minScore, 
        totalScoreWithoutStreich, 
        finalScore
    });

    saveData();
    displayResults();
    resetForm();
}

function displayResults() {
    const resultsTable = document.getElementById('resultsTable').getElementsByTagName('tbody')[0];
    resultsTable.innerHTML = "";

    results.sort((a, b) => b.finalScore - a.finalScore);

    results.forEach((result, index) => {
        let row = resultsTable.insertRow();
        let cell1 = row.insertCell(0);
        let cell2 = row.insertCell(1);
        let cell3 = row.insertCell(2);
        let cell4 = row.insertCell(3);
        let cell5 = row.insertCell(4);
        let cell6 = row.insertCell(5);
        let cell7 = row.insertCell(6);
        let cell8 = row.insertCell(7);
        let cell9 = row.insertCell(8);

        cell1.innerHTML = index + 1;
        cell2.innerHTML = result.totalScoreWithoutStreich;
        cell3.innerHTML = result.totalScore;
        cell4.innerHTML = `${result.maxScore}, ${result.minScore}`;
        cell5.innerHTML = result.ageClass;
        cell6.innerHTML = result.discipline;
        cell7.innerHTML = result.number;
        cell8.innerHTML = result.club;
        cell9.innerHTML = result.athleteName;
    });
}

function resetForm() {
    for (let i = 1; i <= 7; i++) {
        document.getElementById('judge' + i).value = '';
    }
}

function loadAgeClasses() {
    const tournament = document.getElementById('tournament').value;
    const ageClassSelect = document.getElementById('ageClass');
    ageClassSelect.innerHTML = '';

    if (tournaments[tournament]) {
        Object.keys(tournaments[tournament]).forEach(ageClass => {
            ageClassSelect.innerHTML += `<option value="${ageClass}">${ageClass}</option>`;
        });
    }
}

function loadDisciplines() {
    const tournament = document.getElementById('tournament').value;
    const ageClass = document.getElementById('ageClass').value;
    const disciplineSelect = document.getElementById('discipline');
    disciplineSelect.innerHTML = '';

    if (tournaments[tournament] && tournaments[tournament][ageClass]) {
        Object.keys(tournaments[tournament][ageClass]).forEach(discipline => {
            disciplineSelect.innerHTML += `<option value="${discipline}">${discipline}</option>`;
        });
    }
}

function loadAthletes() {
    const tournament = document.getElementById('tournament').value;
    const ageClass = document.getElementById('ageClass').value;
    const discipline = document.getElementById('discipline').value;
    const athleteSelect = document.getElementById('athlete');
    athleteSelect.innerHTML = '';

    if (tournaments[tournament] && tournaments[tournament][ageClass] && tournaments[tournament][ageClass][discipline]) {
        tournaments[tournament][ageClass][discipline].forEach(athlete => {
            athleteSelect.innerHTML += `<option value="${athlete.name}">${athlete.name}</option>`;
        });
    }
}

function saveData() {
    localStorage.setItem('wettkampfResults', JSON.stringify(results));
    localStorage.setItem('wettkampfTournaments', JSON.stringify(tournaments));
    localStorage.setItem('wettkampfAthletes', JSON.stringify(athletes));
}

function loadData() {
    const storedResults = localStorage.getItem('wettkampfResults');
    const storedTournaments = localStorage.getItem('wettkampfTournaments');
    const storedAthletes = localStorage.getItem('wettkampfAthletes');
    
    if (storedResults) {
        results.push(...JSON.parse(storedResults));
    }

    if (storedTournaments) {
        Object.assign(tournaments, JSON.parse(storedTournaments));
        Object.keys(tournaments).forEach(tournament => {
            document.getElementById('tournament').innerHTML += `<option value="${tournament}">${tournament}</option>`;
        });
    }

    if (storedAthletes) {
        athletes.push(...JSON.parse(storedAthletes));
    }

    displayResults();
}

function adminLogin() {
    const password = document.getElementById('adminPassword').value;
    
    if (password === adminPassword) {
        localStorage.setItem('isAdmin', 'true');
        window.location.href = 'admin.html';
    } else {
        alert("Falsches Passwort");
    }
}

function logout() {
    localStorage.removeItem('isAdmin');
    window.location.href = 'index.html';
}

function checkAdminAccess() {
    const isAdmin = localStorage.getItem('isAdmin');
    const adminLink = document.getElementById('adminLink');
    const logoutLink = document.getElementById('logoutLink');
    
    if (isAdmin) {
        adminLink.style.display = 'block';
        logoutLink.style.display = 'block';
    } else {
        window.location.href = 'login.html';
    }
}

function toggleMenu() {
    const menu = document.getElementById('menu');
    if (menu.style.display === 'flex') {
        menu.style.display = 'none';
    } else {
        menu.style.display = 'flex';
    }
}

function exportDataToPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.text("Wettkampf Ergebnisse", 20, 20);

    const headers = [["Platzierung", "Punktzahl (ohne Streichwertung)", "Punktzahl (inkl. Streichwertung)", "Streichwertungen", "Altersklasse", "Disziplin", "Startnummer", "Verein", "Name"]];
    const data = results.map((result, index) => [
        index + 1,
        result.totalScoreWithoutStreich,
        result.totalScore,
        `${result.maxScore}, ${result.minScore}`,
        result.ageClass,
        result.discipline,
        result.number,
        result.club,
        result.athleteName,
    ]);

    doc.autoTable({
        head: headers,
        body: data,
    });

    doc.save("Wettkampf_Ergebnisse.pdf");
}

function prepareImport() {
    const uploadButton = document.getElementById('uploadButton');
    uploadButton.style.display = 'block';
}

function importDataFromExcel(event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        jsonData.forEach((item) => {
            if (!tournaments[item.Turnier]) {
                tournaments[item.Turnier] = {};
            }
            if (!tournaments[item.Turnier][item.Altersklasse]) {
                tournaments[item.Turnier][item.Altersklasse] = {};
            }
            if (!tournaments[item.Turnier][item.Altersklasse][item.Disziplin]) {
                tournaments[item.Turnier][item.Altersklasse][item.Disziplin] = [];
            }
            const athlete = {
                name: item.Name,
                number: item.Startnummer,
                club: item.Verein,
                ageClass: item.Altersklasse,
                discipline: item.Disziplin,
            };
            tournaments[item.Turnier][item.Altersklasse][item.Disziplin].push(athlete);
            athletes.push(athlete);
        });

        saveData();
        displayResults();
        showNotification("Import durchgeführt.");
    };

    reader.readAsArrayBuffer(file);
}

function importData() {
    const fileInput = document.getElementById('fileInput');
    if (fileInput.files.length > 0) {
        importDataFromExcel({ target: fileInput });
    }
}

function showNotification(message) {
    const notification = document.getElementById('importNotification');
    notification.innerHTML = `${message} <span class="close" onclick="closeNotification()">X</span>`;
    notification.style.display = 'block';
}

function closeNotification() {
    const notification = document.getElementById('importNotification');
    notification.style.display = 'none';
}

window.onload = function() {
    const isAdmin = localStorage.getItem('isAdmin');
    const adminLink = document.getElementById('adminLink');
    const logoutLink = document.getElementById('logoutLink');
    
    if (isAdmin) {
        adminLink.style.display = 'block';
        logoutLink.style.display = 'block';
    }
    
    loadData();
};

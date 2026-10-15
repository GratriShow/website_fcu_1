const titres = [];
const dates = [];
const genres = [];
const images = [];

const CLE_STOCKAGE = 'catalogue-films';

const form = document.querySelector('form');
const titreInput = document.querySelector('#titre');
const dateInput = document.querySelector('#date');
const genreSelect = document.querySelector('#genre');
const imageInput = document.querySelector('#image');
const rechercheInput = document.querySelector('#recherche');
const erreurElement = document.querySelector('#erreur');
const container = document.querySelector('.films');


function sauvegarderFilms() {
    try {
        localStorage.setItem(CLE_STOCKAGE, JSON.stringify({
            titres: titres,
            dates: dates,
            genres: genres,
            images: images
        }));
    } catch (erreur) {
        console.error('Impossible de sauvegarder les films :', erreur);
    }
}

function chargerFilms() {
    try {
        const donnees = localStorage.getItem(CLE_STOCKAGE);
        if (!donnees) {
            return;
        }

        const sauvegarde = JSON.parse(donnees);

        for (let i = 0; i < sauvegarde.titres.length; i++) {
            titres.push(sauvegarde.titres[i]);
            dates.push(sauvegarde.dates[i]);
            genres.push(sauvegarde.genres[i]);
            images.push(sauvegarde.images[i]);
        }
    } catch (erreur) {
        console.error('Impossible de lire les films sauvegardés :', erreur);
    }
}

function echapper(texte) {
    return String(texte)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function valider(titre, date, genre, image) {
    if (titre === '') {
        return 'Le titre est obligatoire.';
    } else if (!date) {
        return 'La date de sortie est obligatoire.';
    } else if (!genre) {
        return 'Choisis un genre.';
    } else if (!image) {
        return "L'URL de l'image est obligatoire.";
    }

    for (let i = 0; i < titres.length; i++) {
        if (titres[i].toLowerCase() === titre.toLowerCase()) {
            return 'Ce film est déjà dans le catalogue.';
        }
    }

    return '';
}

function ajouterFilm(event) {
    event.preventDefault();

    const titre = titreInput.value.trim();
    const date = dateInput.value;
    const genre = genreSelect.value;
    const image = imageInput.value.trim();

    const message = valider(titre, date, genre, image);

    if (message !== '') {
        erreurElement.textContent = message;
        return;
    }

    erreurElement.textContent = '';

    titres.push(titre);
    dates.push(date);
    genres.push(genre);
    images.push(image);

    sauvegarderFilms();
    afficherFilms();
    afficherStats();

    form.reset();
}

function afficherFilms() {
    const recherche = rechercheInput.value.trim().toLowerCase();
    const anneeCourante = new Date().getFullYear();
    let html = '';

    for (let i = 0; i < titres.length; i++) {
        if (!titres[i].toLowerCase().includes(recherche)) {
            continue;
        }

        const annee = Number(dates[i].slice(0, 4));
        const badgeNouveau = annee >= anneeCourante - 1
            ? '<span class="badge-nouveau">Nouveau</span>'
            : '';

        const titreSafe = echapper(titres[i]);

        const morceaux = dates[i].split('-');
        const dateFr = `${morceaux[2]}/${morceaux[1]}/${morceaux[0]}`;

        const numero = String(i + 1).padStart(3, '0');

        html += `
            <article class="film">
                <div class="film-affiche">
                    <img src="${echapper(images[i])}" alt="Affiche du film ${titreSafe}">
                    ${badgeNouveau}
                </div>
                <p class="film-numero">N° ${numero}</p>
                <h3 class="film-titre">${titreSafe}</h3>
                <div class="film-infos">
                    <span>${echapper(dateFr)}</span>
                    <span>${echapper(genres[i])}</span>
                </div>
                <button type="button" class="film-supprimer" data-index="${i}" aria-label="Supprimer ${titreSafe}">Retirer</button>
            </article>
        `;
    }

    container.innerHTML = html !== ''
        ? html
        : '<p class="vide">Aucun film à afficher.</p>';
}


function supprimerFilm(index) {
    if (!confirm(`Supprimer « ${titres[index]} » du catalogue ?`)) {
        return;
    }

    titres.splice(index, 1);
    dates.splice(index, 1);
    genres.splice(index, 1);
    images.splice(index, 1);

    sauvegarderFilms();
    afficherFilms();
    afficherStats();
}


function afficherStats() {
    document.querySelector('#stat-total').textContent = titres.length;

    const nomsGenres = [];
    const compteurs = [];

    for (let i = 0; i < genres.length; i++) {
        const position = nomsGenres.indexOf(genres[i]);

        if (position === -1) {
            nomsGenres.push(genres[i]);
            compteurs.push(1);
        } else {
            compteurs[position]++;
        }
    }

    document.querySelector('#stat-genres').textContent = nomsGenres.length;

    let indexTop = 0;
    for (let i = 1; i < compteurs.length; i++) {
        if (compteurs[i] > compteurs[indexTop]) {
            indexTop = i;
        }
    }

    document.querySelector('#stat-top-genre').textContent =
        nomsGenres.length > 0 ? nomsGenres[indexTop] : '–';

    let indexRecent = -1;
    for (let i = 0; i < dates.length; i++) {
        if (indexRecent === -1 || dates[i] > dates[indexRecent]) {
            indexRecent = i;
        }
    }

    document.querySelector('#stat-recent').textContent =
        indexRecent !== -1 ? titres[indexRecent] : '–';
}


form.addEventListener('submit', ajouterFilm);
rechercheInput.addEventListener('input', afficherFilms);

container.addEventListener('click', event => {
    const bouton = event.target.closest('.film-supprimer');

    if (bouton) {
        supprimerFilm(Number(bouton.dataset.index));
    }
});


chargerFilms();
afficherFilms();
afficherStats();
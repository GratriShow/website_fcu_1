const form = document.querySelector('form');

const titreInput = document.querySelector('#titre');
const dateInput = document.querySelector('#date');
const genreSelect = document.querySelector('#genre');
const imageInput = document.querySelector('#image');
const rechercheInput = document.querySelector('#recherche');

const CLE_STOCKAGE = 'catalogue-films';

function chargerFilms() {
    try {
        const donnees = localStorage.getItem(CLE_STOCKAGE);
        return donnees ? JSON.parse(donnees) : [];
    } catch (erreur) {
        console.error('Impossible de lire les films sauvegardés :', erreur);
        return [];
    }
}

function sauvegarderFilms() {
    try {
        localStorage.setItem(CLE_STOCKAGE, JSON.stringify(films));
    } catch (erreur) {
        console.error('Impossible de sauvegarder les films :', erreur);
    }
}

let films = chargerFilms();

function ajouterFilm(event) {
    event.preventDefault();

    const titre = titreInput.value;
    const date = dateInput.value;
    const genre = genreSelect.value;
    const image = imageInput.value;

    const film = {
        titre: titre,
        date: date,
        genre: genre,
        image: image
    };

    films.push(film);
    sauvegarderFilms();

    afficherFilms(films);

    form.reset();
}

function afficherFilms(listeFilms) {
    const container = document.querySelector('.films');
    container.innerHTML = '';

    listeFilms.forEach(film => {
        const filmElement = document.createElement('article');
        filmElement.classList.add('film');

        const imageElement = document.createElement('img');
        imageElement.src = film.image;
        imageElement.alt = `Affiche du film ${film.titre}`;

        const titreElement = document.createElement('h3');
        titreElement.classList.add('film-titre');
        titreElement.textContent = film.titre;

        const infosElement = document.createElement('div');
        infosElement.classList.add('film-infos');

        const dateElement = document.createElement('p');
        dateElement.textContent = `Date de sortie : ${film.date}`;

        const genreElement = document.createElement('p');
        genreElement.textContent = `Genre : ${film.genre}`;

        infosElement.appendChild(dateElement);
        infosElement.appendChild(genreElement);

        const supprimerBouton = document.createElement('button');
        supprimerBouton.type = 'button';
        supprimerBouton.classList.add('film-supprimer');
        supprimerBouton.textContent = '×';
        supprimerBouton.setAttribute('aria-label', `Supprimer ${film.titre}`);
        supprimerBouton.addEventListener('click', () => supprimerFilm(film));

        filmElement.appendChild(imageElement);
        filmElement.appendChild(titreElement);
        filmElement.appendChild(infosElement);
        filmElement.appendChild(supprimerBouton);

        container.appendChild(filmElement);
    });
}

function supprimerFilm(film) {
    if (!confirm(`Supprimer « ${film.titre} » du catalogue ?`)) {
        return;
    }

    films = films.filter(f => f !== film);
    sauvegarderFilms();

    filtrerFilms();
}

function filtrerFilms() {
    const recherche = rechercheInput.value.toLowerCase();

    const resultats = films.filter(film =>
        film.titre.toLowerCase().includes(recherche)
    );

    afficherFilms(resultats);
}

form.addEventListener('submit', ajouterFilm);
rechercheInput.addEventListener('input', filtrerFilms);

afficherFilms(films);
const form = document.querySelector('form');

const titreInput = document.querySelector('#titre');
const dateInput = document.querySelector('#date');
const genreSelect = document.querySelector('#genre');
const imageInput = document.querySelector('#image');

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

    afficherFilm(film);

    form.reset();
}

function afficherFilm(film) {

    const filmElement = document.createElement('article');
    filmElement.classList.add('film');

    const imageElement = document.createElement('img');
    imageElement.src = film.image;
    imageElement.alt = `Affiche du film ${film.titre}`;

    const infosElement = document.createElement('div');
    infosElement.classList.add('film-infos');

    const titreElement = document.createElement('h3');
    titreElement.textContent = film.titre;

    const dateElement = document.createElement('p');
    dateElement.textContent = `Date de sortie : ${film.date}`;

    const genreElement = document.createElement('p');
    genreElement.textContent = `Genre : ${film.genre}`;

    infosElement.appendChild(titreElement);
    infosElement.appendChild(dateElement);
    infosElement.appendChild(genreElement);

    filmElement.appendChild(imageElement);
    filmElement.appendChild(infosElement);

    document.querySelector('.films').appendChild(filmElement);
}

form.addEventListener('submit', ajouterFilm);
class Movie {
    constructor(title, yearLaunch, gender, director, synopsis, rating, duration, language, posterURL) {
        this.title = title;
        this.yearLaunch = yearLaunch;
        this.gender = gender;
        this.director = director;
        this.synopsis = synopsis;
        this.rating = rating;
        this.duration = duration;
        this.language = language;
        this.posterURL = posterURL;
    }
}

/*
// Ejemplo de instancia de la clase Pelicula
const ejemploPelicula = new Pelicula(
    'Ejemplo de Película',
    2022,
    'Drama',
    'Director Ejemplo',
    'Una breve sinopsis de la película.',
    4.5,
    120,
    'Español',
    'https://ejemplo.com/poster.jpg'
);
*/

module.exports = Movie;

console.log(ejemploPelicula);
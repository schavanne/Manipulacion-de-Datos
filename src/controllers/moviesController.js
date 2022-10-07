const moment = require('moment'); 
const db = require('../database/models');
const sequelize = db.sequelize;
const {validationResult} = require('express-validator');

//Otra forma de llamar a los modelos
const Movies = db.Movie;

const moviesController = {
    'list': (req, res) => {
        db.Movie.findAll()
            .then(movies => {
                res.render('moviesList.ejs', {movies})
            })
    },
    'detail': (req, res) => {
        db.Movie.findByPk(req.params.id)
            .then(movie => {
                res.render('moviesDetail.ejs', {movie});
            });
    },
    'new': (req, res) => {
        db.Movie.findAll({
            order : [
                ['release_date', 'DESC']
            ],
            limit: 5
        })
            .then(movies => {
                res.render('newestMovies', {movies});
            });
    },
    'recomended': (req, res) => {
        db.Movie.findAll({
            where: {
                rating: {[db.Sequelize.Op.gte] : 8}
            },
            order: [
                ['rating', 'DESC']
            ]
        })
            .then(movies => {
                res.render('recommendedMovies.ejs', {movies});
            });
    }, //Aqui debemos modificar y completar lo necesario para trabajar con el CRUD
    add: function (req, res) {
        // TODO 
        db.Genre.findAll({
            order : ['name']
        })
            .then(genres => res.render('moviesAdd', {
                genres
            }))
            .catch(error => console.log(error))
    },
    create: function (req, res) {
        // TODO
        let errors = validationResult(req);
        errors = errors.mapped();

        if(Object.entries(errors).length === 0){
            const {title, release_date, rating, awards, length, genre_id} = req.body;
            db.Movie.create({
                ...req.body,
                title : title.trim(),
            })
                .then(movie => {
                    console.log(movie)
                    return res.redirect('/movies/detail/' + movie.id)
                })
                .catch(error => console.log(error))
        }else{
            
            db.Genre.findAll({
                order : ['name']
            })
                .then(genres => res.render('moviesAdd', {
                    genres, errors, old : req.body
                }))
                .catch(error => console.log(error))
        }
        
    },
    edit: function(req, res) {
        // TODO
        let genres = db.Genre.findAll({
            order : ['name']
        })
        let movie = db.Movie.findByPk(req.params.id)
        console.log(genres);
        Promise.all([genres,movie])
            .then(([genres,movie]) => {
                res.render('moviesEdit', {
                    genres,
                    Movie : movie,
                    moment : moment
                });
            })
            .catch(error => console.log(error))
    },
    update: function (req,res) {
        // TODO
        let errors = validationResult(req);
        errors = errors.mapped();

        if(Object.entries(errors).length === 0){
        db.Movie.update(
            {
                ...req.body,
                title : req.body.title.trim()
            },
            {
                where : {id: req.params.id}
            }
        )
            .then(response => {
                console.log(response);
                return res.redirect('/movies/detail/' + req.params.id)
            })
            .catch(error => console.log(error))
        }else{
            let genres = db.Genre.findAll({
                order : ['name']
            })
            let movie = db.Movie.findByPk(req.params.id)
            console.log(genres);
            Promise.all([genres,movie])
                .then(([genres,movie]) => {
                    res.render('moviesEdit', {
                        genres,
                        Movie : movie,
                        moment : moment,
                        errors,
                        
                    });
                })
                .catch(error => console.log(error))
            }
    },
    delete: function (req, res) {
        // TODO
        db.Movie.findByPk(req.params.id)
        .then(movie => res.render('moviesDelete', {
            Movie: movie
        }))
        .catch(error => console.log(error))
    },
    destroy: function (req, res) {
        // TODO
        db.Movie.destroy({
            where : {
                id : req.params.id
            }
        })
        .then(result => {
            console.log(result)
            return res.redirect('/movies')
        })
        .catch(error => console.log(error))
    },

};

module.exports = moviesController;
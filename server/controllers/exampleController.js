const mongoose = require('mongoose');
//objeto do schema e model para inserir itens da database
const Movie = require('../models/exampleModel');
//Features reusaveis
const ApiFeatures = require('../utils/ApiFeatures');
//Middleware para router ('/highest-rated') que retorna os filmes com maior ratings
//Ele só modifica o query antes do getAllMovies

const CustomError = require('../utils/CustomError');

//Função que quando dada uma função de um controller, pega o erro da função, sem o uso de try catch dentro
//para usar o handling de erros globais
const asyncErrorHandler = require('../utils/asyncErrorHandler');

exports.getHighestRated = (req, res, next) => {
    req.query.limit = '5';
    req.query.sort = '-ratings';
    next();
}

exports.getAllMovies = asyncErrorHandler(async (request, response, next) => {
    //pegar todos da database
    //ou especificos dado um valor   

    //Classe que contem features essenciais
    //Filtra os parametros
    const features = new ApiFeatures(Movie.find(), request.query)
        .filter()
        .sort()
        .limitFields();
    await features.paginate();

    const movies = await features.query;

    response.status(200).json({
        status: 'success',
        length: movies.length,
        data: {
            movies
        }
    });
});

exports.getMovieByID = asyncErrorHandler (async (request, response, next) => {
    //pegar um filme por id
    const movie = await Movie.findById(request.params.id);
    if(!movie) {
        const error = new CustomError('Movie with id: ' + request.params.id + ' not found.', 404);
        return next(error);
    }

    response.status(200).json({
        status: 'success',
        data: {
            movie
        }
    });
});

exports.createMovie = asyncErrorHandler(async (request, response, next) => {
    //inserir na database
    const movie = await Movie.create(request.body) //request.body tem os novos arquivos

    response.status(201).json({
        status: 'success',
        data: {
            movie
        }
    });
});

exports.updateMovieByID = asyncErrorHandler (async (request, response, next) => {
    //atualizar filme por id
    const updatedMovie = await Movie.findByIdAndUpdate(request.params.id, request.body, {new: true, runValidators: true}); 
    //request.body tem o novo arquivo
    //runValidators roda as validações caso um campo seja obrigatório

    response.status(200).json({               
        status: 'success',                    
        data: {
            updatedMovie
        }
    });
});

exports.deleteMovieByID = asyncErrorHandler (async (request, response, next) => {
    await Movie.findByIdAndDelete(request.params.id);

    response.status(204).json({
        status: 'success',
        data: null
    });
});

exports.getMovieStats = asyncErrorHandler (async (request, response, next) => {
    //Aggregate é uma função que faz analise de dados a partir de uma database.
    //$match, $group, $sort são agrupamentos que juntam dados em grupos (objetos)
    //$match: Cria um objeto que contém apenas objetos da DB que satisfazem o seu filtro
    //$group: Agrupa os dados com opções de tratamento, como exemplo pegar todo os campos em comum e fazer uma média
    //$sort: Organiza em ordem o agrupamento (1 asc, -1 dsc)
    const stats = await Movie.aggregate([
        //{ $match: {releaseDate: {$lte: new Date()}}},
        { $match: {ratings: {$gte: 1}}},
        { $group: {
            _id: '$releaseDate',
            avgRating: { $avg: '$ratings' },
            avgPrice: { $avg: '$price'},
            minPrice: { $min: '$price'},
            maxPrice: { $max: '$price'},
            priceTotal: { $sum: '$price'},
            movieCount: { $sum: 1}
        }}, //mod, pow, and, not, or, avg, min, max, sum
        { $sort: { minPrice: 1}},
        //{ $match: {maxPrice: {$gte: 10}}}
    ]);
    //Neste código a lógica funciona assim:
    //{ $match: {ratings: {$gte: 1}}} | Pega apena os objetos que satisfazem o filtro
    //{ $group: | Agrupa todos objetos em um só ou em vários objetos*
    //*_id: null, OU _id: 'ratings' | Se _id for null, então ele vai criar apenas um objeto que agrupa
    //todo os valores da database e faz o tratamento de dados a seguir, caso o _id for um campo da DB,
    //ele ira criar um objeto e agrupar cada objeto que tem aquele campo em comum, então se _id: '$ratings',
    //ele vai criar um objeto, fazer o tratamento de dados com todos com aquele campo em comum e criar um
    //objeto novo quando aquele campo não for em comum.

    response.status(200).json({
        status: 'success',
        count: stats.length,
        data: {
            stats
        }
    });
});

exports.getMovieByGenre = asyncErrorHandler (async (request, response, next) => {
    //$project: quando um campo da DB for 0, não aparece no resultado final, se for 1, ele aparece
    //$push: pega um campo da DB que aparece no group e adiciona para uma array
    //$unwind: se um campo for uma array, ele separa os objetos da DB pelo os itens individuais da DB
    const genre = request.params.genre;
    const movies = await Movie.aggregate([
        { $unwind: '$genres' },
        { $group: {
            _id: '$genres',
            movieCount: { $sum: 1 },
            movies: {$push: '$name'},
        }},
        {$addFields: {genre: '$_id'}},
        {$project: {_id: 0}},
        {$sort: {movieCount: -1}},
        {$match: {genre: genre}}
        //{$limit: 1} | Limite de objetos agrupados
    ]);

    response.status(200).json({
        status: 'success',
        data: {
            movies
        }
    });
});

// const fs = require('fs');
//LOAD DATA
// let moviesJSON = JSON.parse(fs.readFileSync('./data/movies.json', 'utf-8'));
// exports.getAllMovies = (request, response) => {
//     response.status(200).json({
//         status: 'success',
//         requestedAt: request.requestedAt,
//         count: moviesJSON.length,
//         data: {
//             movies : moviesJSON
//         }
//     }); 
// }

// exports.getMovieByID = (request, response) => {
//     //converter :id para int
//     const id = request.params.id * 1;
//     //achar no json onde tem um objeto com o mesmo id e retonar ele
//     let movieOBJ = moviesJSON.find((obj) => obj.id === id);

//     if (!movieOBJ){
//         response.status(404).send('Movie not found.');
//     } else {
//         response.status(200).json({
//             status: 'success',
//             data: {
//                 movie : movieOBJ
//             }
//         });
//     }
// }

// exports.addMovieToJSON = (request, response) => {
//     //Cria ID novo para a nova entrada na database
//     const newID = moviesJSON.length + 1;
//     //Isso adiciona o parametro de ID gerado ao objeto enviado pelo post
//     const newMovie = Object.assign({id: newID}, request.body);
//     //adiciona o objeto do post ao json local
//     moviesJSON.push(newMovie);

//     fs.writeFile('./data/movies.json', JSON.stringify(moviesJSON), (error) => {
//         if (!error){
//             response.status(201).json({
//                 status: 'success',
//                 data: {
//                     movies : moviesJSON
//                 }
//             });
//         } else {
//             response.status(404).send(error);
//         }
//     });
// }

// exports.updateMovieByID = (request, response) => {
//     let id = request.params.id * 1;
//     //acha o objeto com o mesmo ID fornecido do patch e atribui o objeto da database com este ID a uma variavel
//     let movieOBJUpdate = moviesJSON.find(obj => obj.id === id);
//     //acha o index do JSON que tem este objeto achado
//     let index = moviesJSON.indexOf(movieOBJUpdate);
    
//     if (movieOBJUpdate){
//         //isto faz com que a informação do patch modifique a do objeto existente.
//         //Exemplo: 
//         //PATCH: name: "CELI"
//         //movieOBJUpdate:
//         //               id: 3,
//         //               name: "HERSTAL" -> name: "CELI",
//         //               ano: "2004"
//         //Dado o nome da Key e o Value novo, ele automaticamente o muda.
//         //Funciona com multiplos Key e Values
//         Object.assign(movieOBJUpdate, request.body);
        
//         //pego o index do objeto, ele atribui a o json local com o objeto novo
//         moviesJSON[index] = movieOBJUpdate;

//         fs.writeFile('./data/movies.json', JSON.stringify(moviesJSON), (error) => {
//             if (!error){
//                 response.status(200).json({
//                     status: 'success',
//                     data: {
//                         movies : movieOBJUpdate
//                     }
//                 });
//             } else {
//                 response.status(404).send(error);
//             }
//         });
//     } else {
//         response.status(404).json({
//             status:"fail",
//             message:"No movie found with id: "+id+"."
//         });
//     }
// }

// exports.deleteMovieByID = (request, response) => {
//     const id = request.params.id * 1;   
//     const movieOBJdelete = moviesJSON.find(obj => obj.id === id);
//     const index = moviesJSON.indexOf(movieOBJdelete);

//     //Remove a primeira e só uma instancia do json local
//     moviesJSON.splice(index, 1);

//     if (movieOBJdelete){
//         fs.writeFile('./data/movies.json', JSON.stringify(moviesJSON), (error) => {
//             if (!error){
//                 response.status(204).json({
//                     status: 'success',
//                     data: {
//                         movie : null
//                     }
//                 });
//             } else {
//                 response.status(404).send(error);
//             }
//         });
//     } else {
//         response.status(404).json({
//             status:"fail",
//             message:"No movie found with id: "+id+"."
//         });
//     }
// }
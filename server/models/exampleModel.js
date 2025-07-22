const mongoose = require('mongoose');
const fs = require('fs');
const validator = require('validator');

//schema e model
//schema - template de item para ser inserido na database
const movieSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "O filme precisa de um nome"], //use este modelo para um item obrigatório
        unique: true, //use isto para um item ser unico na database
        maxlength: [100, "O filme precisa ter menos de 40 caracteres"], //tamanho max da string
        minlength: [3, "O filme precisa ter mais de 3 caracteres"], //tamanho min da string
        trim: true
        //só aceita letras, objeto da lib validator.js
        //validate:  [validator.isAlpha, "O filme precisa ter apenas letras"] 
    },
    description: {
        type: String,
        required: [true, "O filme precisa de uma descrição"],
        trim: true
    },
    duration: { 
        type: Number,
        required: [true, "O filme precisa de uma duração"],
    },
    ratings: {
        type: Number,
        required: [true, "O filme precisa de uma avaliação"],
        //min: [0, "A avaliação precisa ser maior que 0"],
        //max: [10, "A avaliação precisa ser menor que 10"],
        validate: {
            //se a função de validação retornar false, ele irá mostrar a mensagem e dar erro na BD
            //(value) é o valor do campo sendo validado
            validator: function(value) {
                return value >= 0 && value <= 10;
            },
            message: "A avaliação {VALUE} precisa ser maior que 0 e menor que 10"
        }
    },
    totalRating: {
        type: Number,
    },
    releaseYear: {
        type: Number,
        required: [true, "O filme precisa de um ano"]
    },
    releaseDate: {
        type: Date
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    genres: {
        type: [String], //tipo dentro de [] indica que os values são dentro de uma array
        required: [true, "O filme precisa de um genero"],
        enum: { //validação de itens que podem ir dentro de uma array
            values: ["Action", "Adventure", "Comedy", "Drama", "Fantasy", "Horror", "Romance", "Thriller", "Sci-Fi"],
            message: "This genre is not supported"
        }
            
    },
    directors: {
        type: [String],
        required: [true, "O filme precisa de um diretor"]
    },
    coverImage: {
        type: String,
        required: [true, "O filme precisa de uma imagem"]
    },
    actors :{
        type: [String],
        required: [true, "O filme precisa de uma elenco"]
    },
    price: {
        type: Number,
        required: [true, "O filme precisa de um preco"]
    },
    createdBy: {
        type: String
    }
}, {
    //*** Faz parte do código de baixo
    toJSON: { virtuals: true},
    toObject: { virtuals: true}
});

//Cria um campo no objeto da DB quando um get, etc. na database é usado.***
movieSchema.virtual('durationInHours').get(function(){
    return this.duration / 60; //this+.campoDB aponta para um campo na DB / return muda este campo
});

//Triggers (middleware) do próprio Mongo quando um objeto vai ser salvo na DB
//pre save, trigger antes de salvar na DB
movieSchema.pre('save', function(next){
    this.createdBy = 'Gustavo';
    next();
});

//Triggers (middleware) do próprio Mongo quando um objeto vai ser salvo na DB
//post, save trigger depois de salvar na DB | (function(doc) <- recebe o documento criado)
movieSchema.post('save', function(doc, next){
    const content = `O filme ${doc.name} criado por ${doc.createdBy} foi salvo com sucesso\n`;
    fs.writeFileSync('./log/logs.txt', content, {flag: 'a'}, (err) => {console.log(err)});
    next();
});

//Triggers (middleware) do próprio Mongo quando um objeto vai ser achado na DB
//pre, find trigger que executa quando o "find()/findOne(), etc." do mongo é usado, executando antes do resultado
movieSchema.pre(/^find/, function(next){
    this.find({releaseDate: {$lte: Date.now()}}); //muda o find() usado aplicando um filtro a mais,
    next();                                       //no caso quando find() for usado, este filtro é aplicado
});

//Triggers (middleware) do próprio Mongo quando um aggregate vai ser usado na DB
//pre, aggregate trigger que executa antes de um aggregate, neste caso, aplica um filtro extra de data
movieSchema.pre('aggregate', function(next){
    this.pipeline().unshift({ $match: {releaseDate: {$lte: new Date()}}});
    next();
});

//model do schema
const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;
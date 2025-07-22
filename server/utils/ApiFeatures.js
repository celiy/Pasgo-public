class ApiFeatures {
    constructor(query, queryString) {
        this.query = query;
        if (Object.keys(queryString).length === 0) {
            this.isQueryValid = false;
            this.queryString = {};
        } else {
            this.isQueryValid = true;
            this.queryString = queryString;
        }
    }

    filter() {
        if (this.isQueryValid) {
            //Quando passando argumentos como "duration=130", outros argumentos como o da lista
            //excludeFields podem ser passados, então eles serão deletados.
            const excludeFields = ['sort', 'page', 'limit', 'fields'];
            let queryObj = { ...this.queryString };
            excludeFields.forEach(field => delete queryObj[field]); 
            //queryObj = Objeto que contém itens do query formatados que são aceitos pelo mongoose

            // Se a query tiver o argumento de campo[gte|gt|lte|lt]=valor, isso irá formatar para ser aceito pelo mongoose -> 
            // Se a query tiver o argumento de campo@id=valor, isso irá formatar para ser aceito pelo mongoose -> campo.id
            let queryStr = JSON.stringify(queryObj);
            queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
            queryStr = queryStr.replace(/\b(@)\b/g, `.`);
            queryObj = JSON.parse(queryStr);

            // key = Campo da database (name, celular, etc)
            // value = Valor do campo da database (João, 1234567890, etc)
            Object.keys(queryObj).forEach(key => {
                const value = queryObj[key];
                const isValidDate = !isNaN(Date.parse(value)) && isNaN(Number(value));
                const isValidNumer = !isNaN(value) && !isNaN(parseFloat(value));

                if (typeof value === 'string') {
                    if (!['gte', 'gt', 'lte', 'lt'].includes(key)) {
                        if (isValidDate) {
                            queryObj[key] = new Date(value);
                        } else if (isValidNumer) {
                            queryObj[key] = parseFloat(value);
                        } else {
                            queryObj[key] = {
                                $regex: value,
                                $options: 'i'  // 'i' torna a busca case insensitive
                            };
                        }
                    }
                } else if (typeof value === 'object') {
                    Object.keys(value).forEach(operator => {
                        const operatorValue = value[operator];

                        if (typeof operatorValue === 'string') {
                            const isOperatorValidDate = !isNaN(Date.parse(operatorValue)) && isNaN(Number(operatorValue));
                            const isOperatorValidNumer = !isNaN(operatorValue) && !isNaN(parseFloat(operatorValue));

                            //Converte um campo para date se ele for uma data valida
                            if (isOperatorValidDate) {
                                value[operator] = new Date(operatorValue);
                            }

                            if (isOperatorValidNumer) {
                                value[operator] = parseFloat(operatorValue);
                            }
                        }
                    });

                    queryObj[key] = value;
                }
            });

            this.query = this.query.find(queryObj);
        }
        return this;
    }

    sort() {
        //Se um argumento da query for sort, ele irá dar sort
        //ex: sort=price //Irá dar sort nos objetos pelo campo price
        if(this.queryString.sort) {
            const sortBy = this.queryString.sort.split(',').join(' ');
            this.query = this.query.sort(sortBy);
        }
            
        return this;
    }

    limitFields() {
        //Limita a resposta da database para economizar banda larga
        //Se o usuario inserir ?fields=name,price Então os objetos da database que serão
        //retornados irão apenas incluir estes campos.
        if (this.queryString.fields) {
            const fields = this.queryString.fields.split(',').join(' ');
            this.query = this.query.select(fields);
        } else { //caso não tenha limitFields
            this.query = this.query.select('-__v');
        }
        return this;
    }

    async paginate() {
        //Paginação: paginas 1, 2, 3 com limites de itens (ex: 10 itens por pagina)
        const page = parseInt(this.queryString.page, 10) || 1; //Pagina requisitada ou padrão pagina 1
        const limit = parseInt(this.queryString.limit, 10) || 10; //Limite requisitado ou padrão 3
        const skip = (page - 1) * limit;

        this.query = this.query.skip(skip).limit(limit);

        //checa se a pagina requisitada tem documentos ou não
        if (this.queryString.page) {
            const count = await this.query.model.countDocuments();
            if (skip >= count) {
                throw new Error('Esta página não existe!');
            }
        }

        return this;
    }
}

module.exports = ApiFeatures;
const mongoose = require('mongoose');
//objeto do schema e model para inserir itens da database
const Servico = require('./../models/servicosModel');
const Ordem = require('./../models/ordemServicoModel');
const Venda = require('./../models/vendasModel');
const User = require('./../models/userModel');
const ApiFeatures = require('./../utils/ApiFeatures');
const path = require('path');
const multer = require('multer');
const sharp = require('sharp');
const fs = require('fs');
const crypto = require('crypto');

const CustomError = require('./../utils/CustomError');

//Função que quando dada uma função de um controller, pega o erro da função, sem o uso de try catch dentro
//para usar o handling de erros globais
const asyncErrorHandler = require('./../utils/asyncErrorHandler');

// Configuração do Multer
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    // Verificar se é uma imagem
    if (!file.mimetype.startsWith('image/')) {
        return cb(new CustomError('Por favor, envie apenas imagens.', 400), false);
    }

    // Verificar tamanho antes do upload (5MB)
    if (file.size > 5 * 1024 * 1024) {
        return cb(new CustomError(`A imagem ${file.originalname} é muito grande. Máximo permitido: 5MB`, 400), false);
    }

    cb(null, true);
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
        files: 5
    }
});

// Middleware para processar e comprimir imagens
const processImages = async (req, res, next) => {
    if (!req.files) return next();

    try {
        req.processedImages = [];

        for (const file of req.files) {
            const filename = `${req.user.id}-${Date.now()}-${Math.round(Math.random() * 1E9)}.jpg`;
            const userDir = path.join(__dirname, '..', 'data', 'ordens-servicos', req.user.id);

            if (!fs.existsSync(userDir)) {
                fs.mkdirSync(userDir, { recursive: true });
            }

            const filepath = path.join(userDir, filename);

            // Processar e comprimir a imagem
            await sharp(file.buffer)
                .jpeg({ quality: 60 }) // Comprime para JPEG com 80% de qualidade
                .toFile(filepath);

            req.processedImages.push(filename);
        }

        next();
    } catch (error) {
        return next(new CustomError('Erro ao processar imagens', 400));
    }
};

// Middleware para upload de imagens
exports.uploadOrdemImages = (req, res, next) => {
    upload.array('imagens', 6)(req, res, (err) => {
        if (err) {
            if (err?.message === "Too many files") return next(new CustomError('Erro! O máximo de imagens permitidas é 5.', 400));
            if (err?.message === "File too large") return next(new CustomError('Erro! O tamanho máximo de cada imagem é 5MB.', 400));
            if (err?.message === "File type not supported") return next(new CustomError('Erro! O tipo de arquivo não é suportado. Apenas imagens são permitidas.', 400));
        }
        
        next();
    });
};

exports.processOrdemImages = processImages;

exports.getServicos = asyncErrorHandler(async (request, response, next) => {
    if (request.user.servicos > 0) {
        const features = new ApiFeatures(Servico.find({ criadoPor: request.user._id }), request.query)
            .filter()
            .sort()
            .limitFields();
        await features.paginate();

        const servicos = await features.query;

        response.status(200).json({
            status: 'success',
            count: request.user.servicos,
            data: {
                servicos
            }
        });
    } else {
        response.status(200).json({
            status: 'success',
            count: 0,
            data: [{}]
        });
    }
});

exports.createServico = asyncErrorHandler(async (request, response, next) => {
    request.body.criadoPor = request.user._id;
    const servico = await Servico.create(request.body)

    request.user.servicos = request.user.servicos + 1;
    await User.findByIdAndUpdate(request.user._id, request.user, { new: true, runValidators: true });

    response.status(201).json({
        status: 'success',
        data: {
            servico
        }
    });
});

exports.updateServico = asyncErrorHandler(async (request, response, next) => {
    const updatedServico = await Servico.findOneAndUpdate(
        { _id: request.body.id, criadoPor: request.user._id },
        request.body, { new: true, runValidators: true }
    );

    response.status(200).json({
        status: 'success',
        data: {
            updatedServico
        }
    });
});

exports.deleteServico = asyncErrorHandler(async (request, response, next) => {
    const confirmar = await Servico.find({ criadoPor: request.user._id, _id: request.params.id });
    if (Array.isArray(confirmar) && confirmar.length > 0 && typeof confirmar[0] === 'object') {
        await Servico.findOneAndDelete({ criadoPor: request.user._id, _id: request.params.id });

        request.user.servicos = request.user.servicos - 1;
        await User.findByIdAndUpdate(request.user._id, request.user, { new: true, runValidators: true });
    }

    response.status(204).json({
        status: 'success',
        data: null
    });
});

//////////
//ORDENS//
//////////

// Função auxiliar para processar imagens de uma ordem
const processarImagensOrdem = async (ordem, userId) => {
    if (!ordem.imagens || ordem.imagens.length === 0) return ordem;

    const ordemObj = ordem.toObject();
    ordemObj.imagensUrls = [];

    for (const imagem of ordem.imagens) {
        const filepath = path.join(__dirname, '..', 'data', 'ordens-servicos', userId, imagem);
        if (fs.existsSync(filepath)) {
            // Criar URL relativa para a imagem
            ordemObj.imagensUrls.push(`/data/ordens-servicos/${userId}/${imagem}`);
        }
    }

    return ordemObj;
};

exports.getOrdemServicos = asyncErrorHandler(async (request, response, next) => {
    if (request.user.ordens > 0) {
        const features = new ApiFeatures(Ordem.find({ criadoPor: request.user._id }), request.query)
            .filter()
            .sort()
            .limitFields();
        await features.paginate();

        const ordens = await features.query;

        response.status(200).json({
            status: 'success',
            count: request.user.ordens,
            data: {
                ordens
            }
        });
    } else {
        response.status(200).json({
            status: 'success',
            count: 0,
            data: [{}]
        });
    }
});

exports.createOrdemServico = asyncErrorHandler(async (request, response, next) => {
    const orderData = {
        ...JSON.parse(request.body.dados),
        criadoPor: request.user._id,
        dataEmissao: new Date()
    };

    // Usar os nomes dos arquivos processados
    if (request.processedImages && request.processedImages.length > 0) {
        orderData.imagens = request.processedImages;
    }

    const ordens = await Ordem.create(orderData);

    request.user.ordens = request.user.ordens + 1;
    await User.findByIdAndUpdate(request.user._id, request.user, { new: true, runValidators: true });

    response.status(201).json({
        status: 'success',
        data: {
            ordens
        }
    });
});

exports.updateOrdemServico = asyncErrorHandler(async (request, response, next) => {
    const dados = JSON.parse(request.body.dados);
    const ordemAtual = await Ordem.findOne({ _id: dados.id, criadoPor: request.user._id });

    if (!ordemAtual) {
        return next(new CustomError('Ordem de serviço não encontrada.', 404));
    }

    // Inicializa o array de imagens com as imagens existentes que devem ser mantidas
    let imagensFinais = dados.imagensExistentes || [];
    delete dados.imagensExistentes; // Remove do objeto para não duplicar no banco

    // Adiciona as novas imagens processadas, se houver
    if (request.files && request.files.length > 0) {
        imagensFinais = [...imagensFinais, ...request.processedImages];
    }

    // Atualiza o array de imagens no objeto dados
    dados.imagens = imagensFinais;

    // Deleta imagens que não estão mais na lista
    if (ordemAtual.imagens && ordemAtual.imagens.length > 0) {
        const imagensMantidasSet = new Set(imagensFinais);
        
        for (const imagemAntiga of ordemAtual.imagens) {
            if (!imagensMantidasSet.has(imagemAntiga)) {
                try {
                    const filepath = path.join(__dirname, '..', 'data', 'ordens-servicos', request.user.id, imagemAntiga);
                    
                    if (fs.existsSync(filepath)) {
                        fs.unlinkSync(filepath);
                    }
                } catch (error) {
                    console.log(`Erro ao deletar imagem ${imagemAntiga}: ${error}`);
                }
            }
        }
    }

    const updatedOrdem = await Ordem.findOneAndUpdate(
        { _id: dados.id, criadoPor: request.user._id },
        dados,
        { new: true, runValidators: true }
    );

    response.status(200).json({
        status: 'success',
        data: {
            updatedOrdem
        }
    });
});

exports.deleteOrdemServico = asyncErrorHandler(async (request, response, next) => {
    const confirmar = await Ordem.find({ criadoPor: request.user._id, _id: request.params.id });

    if (Array.isArray(confirmar) && confirmar.length > 0 && typeof confirmar[0] === 'object') {
        try {
            if (confirmar[0].imagens && confirmar[0].imagens.length > 0) {
                for (const imagem of confirmar[0].imagens) {
                    const filepath = path.join(__dirname, '..', 'data', 'ordens-servicos', request.user.id, imagem);

                    if (fs.existsSync(filepath)) {
                        fs.unlinkSync(filepath);
                    }
                }
            }
        } catch (error) {
            console.log(`Erro ao deletar imagens da ordem de serviço ${request.params.id}: ${error}`);
        }

        await Ordem.findOneAndDelete({ criadoPor: request.user._id, _id: request.params.id });

        request.user.ordens = request.user.ordens - 1;
        await User.findByIdAndUpdate(request.user._id, request.user, { new: true, runValidators: true });
    }

    response.status(204).json({
        status: 'success',
        data: null
    });
});

exports.getOrdemImages = asyncErrorHandler(async (request, response, next) => {
    const ordem = await Ordem.findOne({ 
        _id: request.params.id, 
        criadoPor: request.user._id 
    });

    if (!ordem) {
        return next(new CustomError('Ordem de serviço não encontrada.', 404));
    }

    if (!ordem.imagens || ordem.imagens.length === 0) {
        return response.status(200).json({
            status: 'success',
            data: {
                imagens: []
            }
        });
    }

    const imagens = [];
    for (const imagem of ordem.imagens) {
        const filepath = path.join(__dirname, '..', 'data', 'ordens-servicos', request.user.id, imagem);
        
        if (fs.existsSync(filepath)) {
            // Lê o arquivo como Buffer
            const imageBuffer = fs.readFileSync(filepath);
            // Converte para base64
            const base64Image = imageBuffer.toString('base64');
            imagens.push({
                nome: imagem,
                data: base64Image
            });
        }
    }

    response.status(200).json({
        status: 'success',
        data: {
            imagens
        }
    });
});

// Endpoint para buscar uma imagem específica
// exports.getOrdemImage = asyncErrorHandler(async (request, response, next) => {
//     const ordem = await Ordem.findOne({ 
//         _id: request.params.id, 
//         criadoPor: request.user._id,
//         imagens: request.params.imagem // Verifica se a imagem pertence a esta ordem
//     });

//     if (!ordem) {
//         return next(new CustomError('Imagem não encontrada.', 404));
//     }

//     const filepath = path.join(__dirname, '..', 'data', 'ordens-servicos', request.user.id, request.params.imagem);
    
//     if (!fs.existsSync(filepath)) {
//         return next(new CustomError('Imagem não encontrada no servidor.', 404));
//     }

//     // Envia o arquivo diretamente
//     response.sendFile(filepath);
// });
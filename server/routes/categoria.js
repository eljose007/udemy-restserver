const express = require('express');

let { verificarToken, verificarAdmin_Role } = require('../middlewares/autenticacion');

let app = express();

let Categoria = require('../models/categoria');

//muestra todas las categorias
app.get('/categoria', verificarToken, (req, res) => {
    
    Categoria.find({})
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, categorias) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }
    
            if (!categorias) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }
    
            res.json({
                ok: true,
                categorias
            });
        });
});

//muestra una categoria por id
app.get('/categoria/:id', verificarToken, (req, res) => {

    let id = req.params.id;
    Categoria.findById(id, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });
    })
});

//Crear nueva categorias
app.post('/categoria', verificarToken, (req, res) => {
    //regresa la nueva categoria
    //req.usuario_id
    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    categoria.save( (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });
    }); 

});

//muestra todas las categorias
app.put('/categoria/:id', verificarToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;

    let descCategoria = {
        descripcion: body.descripcion
    }

    Categoria.findByIdAndUpdate( id, descCategoria, { new: true, runValidators: true }, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok:true,
            categoria: categoriaDB
        })
    })
});

//muestra todas las categorias
app.delete('/categoria/:id', [verificarToken, verificarAdmin_Role], (req, res) => {
    
    let id = req.params.id;

    Categoria.findByIdAndRemove( id, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El id no existe'
                }
            })
        }

        res.json({
            ok: true,
            message: 'Categoria borrada'
        })
    })
});


module.exports = app;
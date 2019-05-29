const express = require('express');

const { verificarToken } = require('../middlewares/autenticacion');

let app = express();
let Producto = require('../models/producto');
let Categoria = require('../models/categoria');

//obtener productos
app.get('/productos', verificarToken, (req, res) => {
    //trae todos los productos
    //populate: usuario categoria
    //paginado
    Producto.find({})
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }
    
            if (!productos) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }

            res.json({
                ok: true,
                productos
            })
        })



});

//obtener 1 producto por id
app.get('/productos/:id', verificarToken, (req, res) => {
    //populate: usuario categoria

    let id = req.params.id;

    Producto.findById(id, (err,producto) => {
        if (err) {
            res.status(500).json({
                ok: false,
                err,
            });
        }

        if (!producto) {
            res.status(400).json({
                ok: false,
                err,
            })
        }

        res.json({
            ok: true,
            producto
        })
    })

});

//crea 1 nuevo producto
app.post('/productos', verificarToken, (req, res) => {
    //grabar el usuario
    //grabar una categoria del listado

    let body = req.body;
    let usuario = req.usuario._id;

    Categoria.findById(body.categoria, (err, categoriaDB) => {
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

        let producto = new Producto({
            nombre: body.nombre,
            precioUni: body.precio,
            descripcion: body.descripcion,
            disponible: true,
            categoria: categoriaDB,
            usuario,
        })

        producto.save( (err, productoBD) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }
    
            if (!productoBD) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }
            
            res.json({
                ok: true,
                producto: productoBD
            });
        })      
    })

    





});

//actualiza 1 producto
app.put('/productos/:id', (req, res) => {
    //grabar el usuario
    //grabar una categoria del listado

    let id = req.params.id;

    let body = req.body;

    let producto = {
        nombre: body.nombre,
        precio: body.precio,
        disponible: body.disponible
    }

    Producto.findByIdAndUpdate(id, producto, { new: true, runValidators: true }, (err, productoBD) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!productoBD) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        
        res.json({
            ok: true,
            producto: productoBD
        });
    })

});

//borrar 1 producto
app.delete('/productos/:id', (req, res) => {
    //grabar el usuario
    //grabar una categoria del listado
    let id = req.params.id;
    Producto.findByIdAndUpdate(id, {disponible: false}, (err, productoBD) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!productoBD) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        
        res.json({
            ok: true,
            producto: productoBD
        });
    })
});

module.exports = app;
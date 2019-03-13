const express = require("express");
const bcrypt = require("bcrypt");
const _ = require("underscore");
const Usuario = require("../models/usuario");
const {
  verificarToken,
  verificarAdmin_Role
} = require("../middlewares/autenticacion");

const app = express();

app.get("/usuario", verificarToken, function(req, res) {
  let desde = req.query.desde || 0;
  desde = Number(desde);

  let limite = !isNaN(req.query.limite) ? Number(req.query.limite) : 2;

  Usuario.find({ estado: true })
    .skip(desde)
    .limit(limite)
    .exec((err, usuarios) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err
        });
      }

      Usuario.countDocuments({ estado: true }, (err, count) => {
        if (err) {
          return res.status(400).json({
            ok: false,
            err
          });
        }

        res.json({
          ok: true,
          count,
          usuarios
        });
      });
    });
});

app.post("/usuario", [verificarToken, verificarAdmin_Role], function(req, res) {
  let body = req.body;

  let usuario = new Usuario({
    nombre: body.nombre,
    email: body.email,
    password: bcrypt.hashSync(body.password, 10),
    role: body.role
  });

  usuario.save((err, usuarioDB) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err
      });
    }

    //usuarioDB.password = null;

    res.json({
      ok: true,
      usuario: usuarioDB
    });
  });

  /* if ( body.nombre === undefined ) {
        res.status(400).json({
            ok: false,
            mensaje: 'El nombre es necesario'
        })
    } else {
        res.json({
            body
        })

    } */
});

app.put("/usuario/:id", [verificarToken, verificarAdmin_Role], function(
  req,
  res
) {
  let id = req.params.id;
  let body = _.pick(req.body, ["nombre", "email", "img", "role", "estado"]);

  Usuario.findByIdAndUpdate(
    id,
    body,
    { new: true, runValidators: true },
    (err, usuarioBD) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err
        });
      }

      res.json({
        ok: true,
        usuario: usuarioBD
      });
    }
  );

  //res.json({id})
});

app.delete("/usuario/:id", [verificarToken, verificarAdmin_Role], function(
  req,
  res
) {
  let id = req.params.id;

  /* Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {

        if (err){
            return res.status(400).json({
                ok: false,
                err
            })
        };

        if (!usuarioBorrado){
            return res.status(400).json({
                ok: false,
                err: {
                    message: "Usuario no encontrado"
                }
            })
        }

        res.json({
            ok: true,
            usuario: usuarioBorrado
        });

    }); */

  Usuario.findByIdAndUpdate(
    id,
    { estado: false },
    { new: true, runValidators: true },
    (err, usuarioBD) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err
        });
      }

      res.json({
        ok: true,
        usuario: usuarioBD
      });
    }
  );
});

module.exports = app;

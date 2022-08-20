require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require("cors");
const Cliente = require('./models/cliente');

const {
  MONGODB_USER,
  MONGODB_PASSWORD,
  MONGODB_CLUSTER,
  MONGODB_ADDRESS,
  MONGODB_DATABASE
} = process.env

mongoose.connect(`mongodb+srv://${MONGODB_USER}:${MONGODB_PASSWORD}@${MONGODB_CLUSTER}.${MONGODB_ADDRESS}.mongodb.net/${MONGODB_DATABASE}?retryWrites=true&w=majority`)
.then(()=>{
  console.log("Conexão Ok")
}).catch((e)=>{
  console.log("Conexão NOK")
  console.log(e)
});
// aqui estamos especificando um middleware
app.use(bodyParser.json());
// esse tambem é um middleware
app.use(cors())

//POST http://localhost:3000/api/clientes
app.post('/api/clientes', (req, res, next) => {
  const cliente = new Cliente({
    nome:req.body.nome,
    fone:req.body.fone,
    email:req.body.email,
  })
  cliente.save().then((clienteInserido) =>{
    console.log(cliente);
    res.status(201).json({
      mensagem: 'Cliente inserido',
    id: clienteInserido._id});
  });
});

app.get('/api/clientes', (req, res, next) => {
  Cliente.find().then((documents) =>{
    res.json({
      mensagem: "Tudo OK",
      clientes: documents
    })
  })
});

//DELETE http://localhost:3000/api/clientes/123456
app.delete('/api/clientes/:id', (req, res) =>{
  Cliente.deleteOne({_id: req.params.id}).then(resultado => {
    console.log(resultado)
    res.status(200).json({mensagem: "Cliente removido"})
  })
  res.end()
})

module.exports = app;

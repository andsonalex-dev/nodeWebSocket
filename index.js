const express = require("express");
const app = express();
const fs = require('fs');
const https = require('https');
//alterar o caminho
const privateKey = fs.readFileSync(__dirname+'/ssl/server.key', 'utf-8');
const certificate = fs.readFileSync(__dirname+'/ssl/server.crt', 'utf-8');
const credenciais = {key: privateKey, cert: certificate};
const httpserver = https.createServer(credenciais, app); //express js vai rodar com base no servidor nativo do node
const io = require("socket.io")(httpserver);
const path = require('path')
const Buffer = require('buffer').Buffer;

app.set("view engine", "ejs");
//Statics
app.use(express.static('public')); 

app.get("/", (req, res) => {
    res.render("index");
})

httpserver.listen(8080, () =>{
    console.log("app rodando na porta 8080");
})
//abrindo a conexão com o cliente websocket
io.on("connection" ,(socket) =>{
    socket.on("Boasvindas", (data) =>{
        console.log(data);
    })

    socket.on("uploadImg", (data) =>{
        now = new Date;
        nameArquivo = now.getMonth()+now.getDay()+Math.random()+".jpg";
        if(decode_base64(data.base64.toString(), nameArquivo)){
            io.emit("Sucesso");
        }

    })
    
});
/**
 * @param  {string} base64str
 * @param  {string} filename
 */
 function decode_base64(base64str, filename) {
    let buf = Buffer.from(base64str, 'base64');  
    fs.writeFile(path.join(__dirname, '/public/tmp/', filename), buf, function(error) {
      if (error) {
        throw error;
      } else {
        console.log('File created from base64 string!');
        return true;
      }
    });
 }



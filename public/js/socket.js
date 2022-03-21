var socket = io("https://localhost:8080"); //objeto passado pelo script conectando o front com o back
//enviando eventos
socket.emit("Boasvindas", {nome: "Andson de Oliveira"}); //passando os dados via json



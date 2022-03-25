var socket = io("https://localhost:8080"); //objeto passado pelo script conectando o front com o back
//enviando eventos
socket.emit("Boasvindas", {nome: "Andson de Oliveira"}); //passando os dados via json

/*
*Recebe o nome da imagem e abre a modal com a imagem digitalizada
*Neste momento poderá ser a validação da digitalização, onde o usuário
*poderá girar, cortar, aceitar ou cancelar a imagem
*após isso o sistema poderá salvar no storage com o 
*nome e os indexadores corretos fazendo a conexão com o banco
*/
socket.on("imagem", (data) => {
    document.getElementById("image").src = "tmp/"+data; 
    $('#exampleModalCenter').modal('show');
});
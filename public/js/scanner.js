qtdQualidade = $("#txtCHQ").val();
qtdEnd = $('#txtCE').val();
qtdIDCpf = $('#txtIDCPF').val();
qtdTermAds = $('#txtCHDef').val();
qtdPaginas = qtdQualidade+qtdEnd+qtdIDCpf+qtdTermAds;


(function() {
    var ws = null;
    var connected = false;
    var serverUrl = 'ws://localhost:30001';

    var open = function() {
       try{
        var url = serverUrl; //url do websocket brscanner
        ws = new WebSocket(url);
       }catch (ex){
         alert(ex);
       } 
        ws.onopen = onOpen;
        ws.onclose = onClose;
        ws.onmessage = onMessage;
        ws.onerror = onError;
    };

    var close = function() {
        if (ws) {
            console.log('CLOSING ...');
            ws.close();
        }
    };
    var onOpen = function() {
        console.log('OPENED: ' + serverUrl);
        ws.send('{RequestType:"ListarScanner"}');
    };

    var onClose = function() {
        console.log('CLOSED: ' + serverUrl);
        ws = null;
        close();
    };

    var onMessage = function(event) {
        var data = event.data;
        var conf = JSON.parse(data);
        if(conf.ResponseType == 'ListarScanner'){
            WebSocketClient.listarScanners(conf.data);
        }
        if(conf.ResponseType == 'digitalizar'){
            //console.log(conf);
            if(conf.data.imagem ==  null){
                //alert("Erro: "+ conf.data.status +" = " +conf.data.msg);
                //console.log(conf.data.msg);
            }else{
                var base64 = conf.data.imagem;
                base64 = base64.split(",");
                base64 = base64[1];
                //enviando pro node
                socket.emit("uploadImg", {base64});
            }
           
        }
        //console.log(data);
    };

    var onError = function(event) {
        alert(event.type);
    };
    WebSocketClient = {
        init: function() {
            //close();
            open();
            //enviando comando pra listar scanner         
        },        
        listarScanners: function(data){
            var opcoes = data;
            var selectBox = document.getElementById("listarScanner");
            opcoes.forEach((scanners) => {
                option = new Option(scanners, scanners);
                selectBox.options[selectBox.options.length] = option;
            })
        },
        digitalizaBtn: function(scanner){       
            var config = '{RequestType:"digitalizar", ConfigScanner : {"descScanner": "'+ scanner +'", "Threshold": 3, "AutoFeed": 2, "ShowTwainUI": 0, "ShowProgressIndicatorUI": 2, "UseDuplex": 2, "UseDocumentFeeder": 2}}';
            ws.send(config);
        },
    };
})();

var WebSocketClient;

$(function() {
    WebSocketClient.init();
});

//ao clicar no botão digitalizar
$('#digitalizar').on('click', function(e){
    verificarDigitalizacao();
});

/*Validar se tem apenas números*/
$('#txtCHQ').on('keyup', function(event) {
    var valorMaximo = 3;
    var valorMinimo = 1;
  
    if (event.target.value > valorMaximo || event.target.value < valorMinimo)
      return event.target.value = valorMaximo;   
});

$('#txtCE').on('keyup', function(event) {
    var valorMaximo = 1;
    var valorMinimo = 1;
  
    if (event.target.value > valorMaximo || event.target.value < valorMinimo)
      return event.target.value = valorMaximo;   
});
$('#txtIDCPF').on('keyup', function(event) {
    var valorMaximo = 2;
    var valorMinimo = 1;
  
    if (event.target.value > valorMaximo || event.target.value < valorMinimo)
      return event.target.value = valorMaximo;   
});
$('#txtCHDef').on('keyup', function(event) {
    var valorMaximo = 5;
    var valorMinimo = 1;
  
    if (event.target.value > valorMaximo || event.target.value < valorMinimo)
      return event.target.value = valorMaximo;   
});

$('#exibirModal').on('click', function(e){
    $('#exampleModalCenter').modal('show');
});

function verificarDigitalizacao(){   
    //inicia o websocket de acordo com a scanner selecionada.
    scanner = $("#listarScanner option:selected").val();
    WebSocketClient.digitalizaBtn(scanner);
    atualizaDigitalizacao(0, qtdPaginas);
}

function atualizaDigitalizacao(controle, qtdTotal){
    if(controle < qtdTotal){

    }
    if(controle == qtdTotal){

    }

}
// import 'cropperjs/dist/cropper.css';

const image = document.getElementById('image');
const cropper = new Cropper(image, {
  aspectRatio: 16 / 9,
  crop(event) {
    console.log(event.detail.x);
    console.log(event.detail.y);
    console.log(event.detail.width);
    console.log(event.detail.height);
    console.log(event.detail.rotate);
    console.log(event.detail.scaleX);
    console.log(event.detail.scaleY);
  },
});
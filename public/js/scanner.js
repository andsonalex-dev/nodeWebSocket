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
            var base64 = conf.data.imagem;
            base64 = base64.split(",");
            base64 = base64[1];
            //enviando pro node
            socket.emit("uploadImg", {base64});
        }
        console.log(data);
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
            var config = '{RequestType:"digitalizar", ConfigScanner : { "typeScanner" : "usb", "descScanner": "'+ scanner +'", "DPI":1184, "Threshold": 3, "AutoFeed": 1, "ShowTwainUI": 1, "ShowProgressIndicatorUI": 1, "UseDuplex": 1, "UseDocumentFeeder": 1}}';
            ws.send(config);
        },
    };
})();

var WebSocketClient;

$(function() {
    WebSocketClient.init();
  });
  $('#digitalizar').click(function(e){
    scanner = $("#listarScanner option:selected").val();
    WebSocketClient.digitalizaBtn(scanner);
});
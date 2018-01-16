
var app = {
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
        document.addEventListener("resume",function(){  
          console.log("Actividad DEVUELTA");
          abrir();
        }, false);
        document.addEventListener("pause",function(){  
          console.log("Actividad pausada");
        }, false);
        document.addEventListener("stop",function(){
          console.log("Actividad terminada");
        }, false);
    },

    onDeviceReady: function() {
        this.receivedEvent('deviceready');
        if (typeof window.localStorage == 'object')
        {
            // localStorage is supported
            console.log('**LocalStorage is supported');
        }
        else
        {
            // localStorage is not supported
            console.log('**LocalStorage is NOT supported');
        }
        if(hayConexion()){
            abrir();
        }else{
            $("#contenedor").html('<br><br><br><br><center><img src="img/logo.png" width="200" height="200"><br><label style="color:#0080FF;">No se ha podido establecer la conexión</label><br> <h6 style="color:#58ACFA;">Por favor verifique que está conectado a internet</h6><br><button class="btn btn-primary" onclick="app.onDeviceReady();">Reintentar</button></center>');
        }
        FCMPlugin.getToken(
            function(token){
              console.log('Token: '+token);
              
            },
            function(err){
              console.log('error retrieving token: ' + err);
            }
          );

          FCMPlugin.onNotification(
            function(data){
               console.log('DATOS: '+JSON.stringify(data));
               //alert(data.message);
                
            },
            function(msg){
              console.log('onNotification callback successfully registered: ' + msg);
            },
            function(err){
              console.log('Error registering onNotification callback: ' + err);
            }
          );
    },

     receivedEvent: function(id) {
        console.log('Received Event: ' + id);
    }
};

app.initialize();

function abrir() {
  //var url = 'http://lociamcorp.com/demo2/';
  var url = 'http://siisarh.com/calculadora/';
  //var url = 'http://katzesystems.com/bot/?id_sender=1280698628725108';
   //var url = 'http://pijamasurf.com/';
   //var url = 'http://siienet.utn.edu.mx/paginas/alumnos/horarioalumnos.php';
   var target = '_blank';
   var options = "location=no,zoom=no,clearsessioncache=no,clearcache=no"
   var ref = cordova.InAppBrowser.open(url, target, options);

   ref.addEventListener('loadstart', loadstartCallback);
   ref.addEventListener('loadstop', loadstopCallback);
   ref.addEventListener('loadloaderror', loaderrorCallback);
   ref.addEventListener('exit', exitCallback);

   function loadstartCallback(event) {
      console.log('Loading started: '  + event.url);
      if(event.url.indexOf("pdf=yes") > -1)
      {
        console.log("Cargando pdf en el sistema");
        window.open(event.url,"_system","location=no,zoom=no,clearsessioncache=no,clearcache=no");
      }
   }

   function loadstopCallback(event) {
      console.log('Loading finished: ' + event.url);
      //swal('','página cargada.');
   }

   function loaderrorCallback(error) {
      console.log('Loading error: ' + error.message);
      $("#contenedor").html('<br><br><br><br><center><img src="img/logo.png" width="200" height="200"><br><label style="color:#0080FF;">No se ha podido establecer la conexión</label><br> <h6 style="color:#58ACFA;">Por favor verifique que está conectado a internet</h6><br><button class="btn btn-primary" onclick="abrir();">Reintentar</button></center>');
   }

   function exitCallback() {
      console.log('Browser is closed...');
      window.location="index.html";
   }
}

function hayConexion() {
    var networkState = navigator.connection.type;

    var states = {};
    states[Connection.UNKNOWN]  = 'Unknown connection';
    states[Connection.ETHERNET] = 'Ethernet connection';
    states[Connection.WIFI]     = 'WiFi connection';
    states[Connection.CELL_2G]  = 'Cell 2G connection';
    states[Connection.CELL_3G]  = 'Cell 3G connection';
    states[Connection.CELL_4G]  = 'Cell 4G connection';
    states[Connection.CELL]     = 'Cell generic connection';
    states[Connection.NONE]     = 'No network connection';

    if(states[networkState]=='No network connection' || states[networkState]=='Unknown connection'){
        swal('','No se encontró una conexión a internet','error');
        return false;
    }else{
        return true;
    }
}
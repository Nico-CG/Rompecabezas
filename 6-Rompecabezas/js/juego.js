var Juego = {

  // Creo un arreglo con los objetos que contienen la informacion de las piezas
  // y luego los agrego al arreglo grilla.
  construirPiezas: function(){
    var indice = 0;
    for (var i = 0; i < this.cantidadDePiezasPorLado; i++) {
      for (var j = 0; j < this.cantidadDePiezasPorLado; j++) {
        this.piezas[indice] =  {
          xActual : this.anchoPiezas * j,
          yActual : this.anchoPiezas * i,
          xOriginal : this.anchoPiezas * j,
          yOriginal : this.anchoPiezas * i
        };
        this.grilla[i][j] = this.piezas[indice];
        indice++;
      }
    }
  },

  // Creo la grilla del rompecabezas.
  crearGrilla: function(){
    for(var i = 0; i < this.cantidadDePiezasPorLado; i++){
      this.grilla[i] = [];
      for (var j = 0; j < this.cantidadDePiezasPorLado; j++) {
        this.grilla[i][j] = "";
      }
    }
  },

  // Creo el canvas y el contexto.
  configurarCanvas: function(){
    this.canvas = document.getElementById("canvas");
    this.contexto = canvas.getContext("2d");
  },

  //se carga la imagen del rompecabezas
  cargarImagen: function (e) {
    //se calcula el ancho y el alto de las piezas de acuerdo al tamaño del canvas (600).
    this.anchoPiezas = Math.floor(600 / this.cantidadDePiezasPorLado);
    this.altoPiezas = Math.floor(600 / this.cantidadDePiezasPorLado);
    //se calcula el ancho y alto del rompecabezas de acuerdo al ancho y alto de cada pieza y la cantidad de piezas por lado
    this.anchoDeRompecabezas = this.anchoPiezas * this.cantidadDePiezasPorLado;
    this.altoDeRompecabezas = this.altoPiezas * this.cantidadDePiezasPorLado;
    //la pieza blanca es la que corresponde a la ultima pieza del rompecabezas;
    this.piezaBlanca = 600-this.anchoPiezas;
    this.configurarCanvas();
  },

  //funcion que carga la imagen
  iniciarImagen: function (callback) {
    this.imagen = new Image();
    var self = this;
    //se espera a que se termine de cargar la imagen antes de ejecutar la siguiente funcion
    this.imagen.addEventListener('load', function () {
      self.cargarImagen.call(self);
      callback();
    }, false);
    this.imagen.src = "images/300.jpg";
  },

  // Dibujo la pieza blanca en la posición en la que se encuentra el recorte de la ultima pieza.
  dibujarPiezaBlanca: function(i,j){
    if (this.grilla[i][j].xActual == this.piezaBlanca && this.grilla[i][j].yActual == this.piezaBlanca) {
      this.contexto.beginPath();
      this.contexto.rect(this.grilla[i][j].xOriginal, this.grilla[i][j].yOriginal, this.anchoPiezas, this.altoPiezas);
      this.contexto.fillStyle ="white";
      this.contexto.fill();
    }
  },

  // Dibujo el rompecabezas haciendo el recorte de la imagen a partir de su
  // xActual, y posicionando la pieza en su xOriginal.
  dibujarRompecabezas: function(){
    for(var i = 0; i < this.cantidadDePiezasPorLado; i++){
      for (var j = 0; j < this.cantidadDePiezasPorLado; j++) {
        this.contexto.drawImage(this.imagen, this.grilla[i][j].xActual, this.grilla[i][j].yActual, this.anchoPiezas, this.altoPiezas, this.grilla[i][j].xOriginal, this.grilla[i][j].yOriginal, this.anchoPiezas, this.altoPiezas);
        this.dibujarPiezaBlanca(i,j);
      }
    }
  },

  // Intercambio el recorte que se hace de la imagen en determinada posicion.
  intercambiarPosiciones: function(filaPos1, columnaPos1, filaPos2, columnaPos2){

    var posGrilla1EnX = this.grilla[filaPos1][columnaPos1].xActual;
    var posGrilla1EnY = this.grilla[filaPos1][columnaPos1].yActual;
    var posGrilla2EnX = this.grilla[filaPos2][columnaPos2].xActual;
    var posGrilla2EnY = this.grilla[filaPos2][columnaPos2].yActual;

    this.grilla[filaPos1][columnaPos1].xActual = posGrilla2EnX;
    this.grilla[filaPos1][columnaPos1].yActual = posGrilla2EnY;
    this.grilla[filaPos2][columnaPos2].xActual = posGrilla1EnX;
    this.grilla[filaPos2][columnaPos2].yActual = posGrilla1EnY;

    this.dibujarRompecabezas();

    //actualizo el contador de movimientos
    if (!this.seEstaMezclando) {
      this.contadorDeMovimientos--;
      document.getElementById("contadorDeMovimientos").innerHTML = this.contadorDeMovimientos;
    }
  },

  // Actualiza la posición de la pieza vacía
  actualizarPosicionVacia: function(nuevaFila,nuevaColumna){
    this.filaVacia = nuevaFila;
    this.columnaVacia = nuevaColumna;
  },


  // Para chequear si la posicón está dentro de la grilla.
  posicionValida: function(fila, columna){
    return((fila < this.cantidadDePiezasPorLado && fila >= 0  && columna < this.cantidadDePiezasPorLado && columna >= 0 ));
  },

  /* Movimiento de fichas, en este caso la que se mueve
  es la blanca intercambiando su posición con otro elemento.
  Las direcciones están dadas por números que representa:
  arriba, abajo, izquierda, derecha */
  moverEnDireccion: function(direccion){

    var nuevaFilaPiezaVacia;
    var nuevaColumnaPiezaVacia;

    // Intercambia pieza blanca con la pieza que está arriba suyo
    if(direccion == 40){
      nuevaFilaPiezaVacia = this.filaVacia-1;
      nuevaColumnaPiezaVacia = this.columnaVacia;
    }
    // Intercambia pieza blanca con la pieza que está abajo suyo
    else if (direccion == 38) {
      nuevaFilaPiezaVacia = this.filaVacia+1;
      nuevaColumnaPiezaVacia = this.columnaVacia;

    }
    // Intercambia pieza blanca con la pieza que está a su izq
    else if (direccion == 39) {
      nuevaFilaPiezaVacia = this.filaVacia;
      nuevaColumnaPiezaVacia = this.columnaVacia-1;
    }
    // Intercambia pieza blanca con la pieza que está a su der
    else if (direccion == 37) {
      nuevaFilaPiezaVacia = this.filaVacia;
      nuevaColumnaPiezaVacia = this.columnaVacia+1;
    }
    // Se chequea si la nueva posición es válida, si lo es, se intercambia.
    if (this.posicionValida(nuevaFilaPiezaVacia, nuevaColumnaPiezaVacia)){
      this.intercambiarPosiciones(this.filaVacia, this.columnaVacia,
      nuevaFilaPiezaVacia, nuevaColumnaPiezaVacia);
      this.actualizarPosicionVacia(nuevaFilaPiezaVacia, nuevaColumnaPiezaVacia);
    }

  },

  /* Función que mezcla las piezas del tablero una cantidad de veces dada.
  Se calcula una posición aleatoria y se mueve en esa dirección. De esta forma
  se mezclará todo el tablero. */

  mezclarPiezas: function(veces){
    this.seEstaMezclando = true;
    if(veces<=0){return;}
    var direcciones = [40, 38, 39, 37];
    var direccion = direcciones[Math.floor(Math.random()*direcciones.length)];
    this.moverEnDireccion(direccion);
    setTimeout(function(){
      this.mezclarPiezas(veces-1);
      if (veces == 1) {
        this.seEstaMezclando = false;
      }
    }.bind(this),50);

  },

  // Esta función va a chequear si el Rompecabezas está en la posición ganadora.
  // Cada vez que el recorte de la imagen de la pieza (xActual) sea igual a su posicion original(xOriginal)
  // se suma uno a la variable "gana", y cuando ésta llega a la misma cantidad que piezas del
  // rompecabezas, se devuelve true.
  chequearSiGano: function(){
    gana = 0;
    for (var i = 0; i < this.grilla.length; i++){
      for (var j = 0; j < this.grilla[i].length; j++) {
        if(this.grilla[i][j].xActual == this.grilla[i][j].xOriginal && this.grilla[i][j].yActual == this.grilla[i][j].yOriginal){
          gana++;
        }
      }
    }
    return(gana == this.cantidadDePiezasPorLado*this.cantidadDePiezasPorLado);

  },

  chequearSiPerdio: function(){
    return(this.contadorDeMovimientos == 0);
  },

  //Carteles que se muestrar al ganar o perder.
  mostrarCartelGanador: function(){
    swal("¡Felicitaciones!", "Conseguiste superar el desafío", "success");
  },

  mostrarCartelPerdedor: function(){
    swal("Perdiste :(", "Volve a intentarlo", "error");
  },

  // Al hacer click en el boton de confirmar, se vuelven a mezclar las piezas.
  /*cerrarCartelGanador: function(){
    $('.confirm').one('click', function(){
      this.seleccionarNivel(this.cantMovimientos);
    }.bind(this));
  },

  cerrarCartelPerdedor: function(){
    $('.confirm').one('click', function(){
      this.seleccionarNivel(this.cantMovimientos);
    }.bind(this));
  },*/

  // Chequeo si gano o perdio y ejecuto las funciones correspondientes.
  chequearYMostrar: function(){
    var gano = this.chequearSiGano();
    var perdio = this.chequearSiPerdio();
    if(gano){
      setTimeout(function(){
        this.mostrarCartelGanador();
        //this.cerrarCartelGanador();
      }.bind(this),100);
    }
    else if (perdio) {
      setTimeout(function(){
        this.mostrarCartelPerdedor();
        //this.cerrarCartelPerdedor();
      }.bind(this),100);
    }
  },

  /* capturarTeclas: Esta función captura las teclas presionadas por el usuario. Javascript
  permite detectar eventos, por ejemplo, cuando una tecla es presionada y en
  base a eso hacer algo. No es necesario que entiendas como funciona esto ahora,
  en el futuro ya lo vas a aprender. Por ahora, sólo hay que entender que cuando
  se toca una tecla se hace algo en respuesta, en este caso, un movimiento */
  capturarTeclas: function (){
    document.body.onkeydown = (function(evento) {

      // se van a detectar las teclas mientras haya movimientos disponibles, no se este mezclando y no haya ganado.
      if((evento.which == 40 || evento.which == 38 || evento.which == 39 || evento.which == 37) && (this.contadorDeMovimientos > 0) && (!this.seEstaMezclando) && (!this.chequearSiGano())) {

        this.moverEnDireccion(evento.which);
        this.chequearYMostrar();
        evento.preventDefault();
      }
    }.bind(this))
  },

  // Pregunto si la pieza adyacente a la pieza clickeada es la pieza blanca.
  blancaEsAdyacente: function(i,j){
    if(this.posicionValida(i,j)){
      return(this.grilla[i][j].yActual == this.piezaBlanca && this.grilla[i][j].xActual == this.piezaBlanca);
    }
  },

  // Capturo los clicks del mouse dentro del elemento #canvas, mientras tenga movimientos
  // diponibles y no se este mezclando el rompecabezas.
  capturarMouse: function(){
    $('#canvas').on('click', function(evento){
      if ((this.contadorDeMovimientos > 0) && (!this.seEstaMezclando)){
        var canvasLeft = this.canvas.offsetLeft;
            canvasTop = this.canvas.offsetTop;
            x = evento.pageX - canvasLeft;
            y = evento.pageY - canvasTop;

        for(var i = 0; i < this.cantidadDePiezasPorLado; i++){
          for (var j = 0; j < this.cantidadDePiezasPorLado; j++) {

            // recorro la grilla y pregunto si la posicion del mouse esta dentro del
            // rango de una de las piezas.
            if (y > this.grilla[i][j].yOriginal && y < this.grilla[i][j].yOriginal+this.altoPiezas && x > this.grilla[i][j].xOriginal && x < this.grilla[i][j].xOriginal+this.anchoPiezas ) {

                if (this.blancaEsAdyacente(i+1,j)) {
                  this.moverEnDireccion(40);
                }

                else if ((this.blancaEsAdyacente(i-1,j))) {
                  this.moverEnDireccion(38);
                }

                else if ((this.blancaEsAdyacente(i,j+1))) {
                  this.moverEnDireccion(39);
                }

                else if ((this.blancaEsAdyacente(i,j-1))) {
                  this.moverEnDireccion(37);
                }
            }
          }
        }

        this.chequearYMostrar();
      }
    }.bind(this));
  },


  //una vez elegida la dificultad, se inicia el juego
  iniciar: function (cantMovimientos) {
    this.movimientosTotales = cantMovimientos;
    this.contadorDeMovimientos = cantMovimientos;
    this.piezas = [];
    this.grilla = [];
    document.getElementById("contadorDeMovimientos").innerHTML = this.contadorDeMovimientos;
    this.cantidadDePiezasPorLado = document.getElementById("cantidadPiezasPorLado").value;
    //se guarda el contexto en una variable para que no se pierda cuando se ejecute la funcion iniciarImagen (que va a tener otro contexto interno)
    var self = this;
    this.crearGrilla();
    //se instancian los atributos que indican la posicion de las fila y columna vacias de acuerdo a la cantidad de piezas por lado para que sea la ultima del tablero
    this.filaVacia = this.cantidadDePiezasPorLado - 1;
    this.columnaVacia = this.cantidadDePiezasPorLado - 1;
    //se espera a que este iniciada la imagen antes de construir las piezas y empezar a mezclarlas
    this.iniciarImagen(function () {
      self.construirPiezas();
      self.dibujarRompecabezas();
      //la cantidad de veces que se mezcla es en funcion a la cantidad de piezas por lado que tenemos, para que sea lo mas razonable posible.
      var cantidadDeMezclas = Math.max(Math.pow(self.cantidadDePiezasPorLado, 3), 100);
      self.seEstaMezclando = false;
      self.mezclarPiezas(cantidadDeMezclas);
    });
    this.capturarTeclas();
    this.capturarMouse();
  },

  // Se ejecuta iniciar() y se determina la cantidad de movimientos disponibles
  // segun la dificultad elegida y la cantidad de piezas por lado.
  seleccionarNivel: function(){
      this.cantidadDePiezasPorLado = document.getElementById("cantidadPiezasPorLado").value;
      if($("#facil").is(':checked')) {
        this.iniciar(this.cantidadDePiezasPorLado*this.cantidadDePiezasPorLado*6);
        this.cantMovimientos = this.cantidadDePiezasPorLado*this.cantidadDePiezasPorLado*6;
      }
      else if ($("#intermedio").is(':checked')){
        this.iniciar(this.cantidadDePiezasPorLado*this.cantidadDePiezasPorLado*4);
        this.cantMovimientos = this.cantidadDePiezasPorLado*this.cantidadDePiezasPorLado*4;
      }
      else if ($("#dificil").is(':checked')){
        this.iniciar(this.cantidadDePiezasPorLado*this.cantidadDePiezasPorLado*2);
        this.cantMovimientos = this.cantidadDePiezasPorLado*this.cantidadDePiezasPorLado*2;
      }
  }
};

// se inicia el juego al hacer click sobre la dificultad
$(function(){
  $(':radio').on('click', function(){
    this.seleccionarNivel();
  }.bind(Juego));
});

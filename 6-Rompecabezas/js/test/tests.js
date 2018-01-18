var expect = chai.expect;

describe('Creación', function() {
    'use strict';

describe('Juego', function() {
    it('El Objeto Juego está definido', function(done) {
      if (!window.Juego){
        done(err);
      }
      else{
        done();
      }
    });
});

describe('Tamaño de la grilla', function() {
    it('La grilla tiene el tamaño correcto', function() {
      //se crea la grilla con un valor de cantidad de piezas por lado
      Juego.cantidadDePiezasPorLado = 5;
      Juego.grilla = [];
      Juego.crearGrilla();
      //se evalua si el tamaño de la grilla creada es correcto
      expect(Juego.grilla.length).to.equal(Juego.cantidadDePiezasPorLado);
      expect(Juego.grilla[0].length).to.equal(Juego.cantidadDePiezasPorLado);
    });
  });
});

describe('Posicion valida', function(){
  it('Chequea la posicion correctamente', function(){
    Juego.cantidadDePiezasPorLado = 3;
    expect(Juego.posicionValida(2,2)).to.be.true;
    expect(Juego.posicionValida(0,0)).to.be.true;
    expect(Juego.posicionValida(-1,-1)).to.be.false;
    expect(Juego.posicionValida(3,3)).to.be.false;
  });
});

describe('Chequear si ganó', function(){
  it('Chequea si gano correctamente', function(){
    Juego.cantidadDePiezasPorLado = 3;
    Juego.anchoPiezas = 600 / Juego.cantidadDePiezasPorLado;
    Juego.grilla = [];
    Juego.crearGrilla();
    Juego.piezas = [];
    Juego.construirPiezas();
    Juego.grilla[0][0].xActual = 2;
    Juego.grilla[0][0].xOriginal = 1;
    expect(Juego.chequearSiGano()).to.be.false;
    Juego.grilla[0][0].xActual = 1;
    Juego.grilla[0][0].xOriginal = 1;
    expect(Juego.chequearSiGano()).to.be.true;
    Juego.grilla[0][0].yActual = 1;
    Juego.grilla[0][0].yOriginal = 2;
    expect(Juego.chequearSiGano()).to.be.false;
  });
});

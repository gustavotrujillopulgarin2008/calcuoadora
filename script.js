// devuelve quien tiene la sesion abierta
function ver_sesion() {
  return localStorage.getItem('cmc_sesion');
}

// guarda el nombre del usuario con sesion
function guardar_sesion(nombre) {
  localStorage.setItem('cmc_sesion', nombre);
}

// borra la sesion y vuelve al login
function hacerLogout() {
  localStorage.removeItem('cmc_sesion');
  window.location.href = 'index.html';
}

// si no hay sesion manda al login
function controlar_sesion() {
  if (ver_sesion() === null) {
    window.location.href = 'index.html';
  }
}

// revisa en que pagina estoy y la protege si hace falta
function arranque() {
  var pagina = window.location.pathname;
  if (pagina.indexOf('menu.html') !== -1) {
    controlar_sesion();
  }
  if (pagina.indexOf('muro.html') !== -1) {
    controlar_sesion();
  }
  if (pagina.indexOf('viga.html') !== -1) {
    controlar_sesion();
  }
  if (pagina.indexOf('columna.html') !== -1) {
    controlar_sesion();
  }
  if (pagina.indexOf('contrapiso.html') !== -1) {
    controlar_sesion();
  }
  if (pagina.indexOf('techo.html') !== -1) {
    controlar_sesion();
  }
  if (pagina.indexOf('pisos.html') !== -1) {
    controlar_sesion();
  }
  if (pagina.indexOf('pintura.html') !== -1) {
    controlar_sesion();
  }
  if (pagina.indexOf('resultado-') !== -1) {
    controlar_sesion();
  }
}

// revisa el usuario y contraseña en el servidor y entra al menu
function hacerLogin() {
  var user = document.getElementById('f-user').value.trim();
  var pass = document.getElementById('f-pass').value;

  fetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user: user, pass: pass })
  })
    .then(function (r) { return r.json(); })
    .then(function (d) {
      if (!d.ok) {
        document.getElementById('form-err').textContent = d.mensaje;
        return;
      }
      guardar_sesion(user);
      window.location.href = 'menu.html';
    })
    .catch(function () {
      document.getElementById('form-err').textContent = 'No se pudo conectar con el servidor. ¿Está encendido?';
    });
}

// crea una cuenta nueva (se guarda en usuarios.json) y entra al menu
function hacerRegistro() {
  var user = document.getElementById('f-user').value.trim();
  var pass = document.getElementById('f-pass').value;
  var pass2 = document.getElementById('f-pass2').value;

  if (user === '' || pass === '') {
    document.getElementById('form-err').textContent = 'Completa todos los campos.';
    return;
  }
  if (pass !== pass2) {
    document.getElementById('form-err').textContent = 'Las contraseñas no coinciden.';
    return;
  }

  fetch('/api/registro', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user: user, pass: pass })
  })
    .then(function (r) { return r.json(); })
    .then(function (d) {
      if (!d.ok) {
        document.getElementById('form-err').textContent = d.mensaje;
        return;
      }
      guardar_sesion(user);
      window.location.href = 'menu.html';
    })
    .catch(function () {
      document.getElementById('form-err').textContent = 'No se pudo conectar con el servidor. ¿Está encendido?';
    });
}

// cambia la contraseña de un usuario en usuarios.json
function hacerRecuperar() {
  var user = document.getElementById('f-user').value.trim();
  var pass = document.getElementById('f-pass').value;
  var pass2 = document.getElementById('f-pass2').value;

  if (pass === '' || pass !== pass2) {
    document.getElementById('form-err').textContent = 'Las contraseñas no coinciden.';
    return;
  }

  fetch('/api/recuperar', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user: user, pass: pass })
  })
    .then(function (r) { return r.json(); })
    .then(function (d) {
      if (!d.ok) {
        document.getElementById('form-err').textContent = d.mensaje;
        return;
      }
      window.location.href = 'index.html';
    })
    .catch(function () {
      document.getElementById('form-err').textContent = 'No se pudo conectar con el servidor. ¿Está encendido?';
    });
}

// marca el boton de espesor elegido del muro
function elegirEspesor(boton, valor) {
  document.getElementById('c-espesor').value = valor;
  var bs = document.querySelectorAll('.toggle-row button');
  for (var i = 0; i < bs.length; i++) {
    bs[i].className = '';
  }
  boton.className = 'active';
}

// calcula los materiales del muro
function calcularMuro() {
  var dato1 = document.getElementById('c-largo').value;
  var dato2 = document.getElementById('c-alto').value;
  var largo = parseFloat(dato1);
  var alto = parseFloat(dato2);

  if (dato1 === '' || isNaN(largo) || largo <= 0) {
    alert('Completa todos los campos con valores numéricos válidos.');
    return;
  }
  if (dato2 === '' || isNaN(alto) || alto <= 0) {
    alert('Completa todos los campos con valores numéricos válidos.');
    return;
  }

  var espesor = document.getElementById('c-espesor').value;

  var tasa1 = 10.9;
  var tasa2 = 0.09;
  var tasa3 = 90;
  if (espesor === '30') {
    tasa1 = 15.2;
    tasa2 = 0.115;
    tasa3 = 120;
  }

  var resultado = largo * alto;

  var materiales = [];
  materiales.push(['Cemento', (resultado * tasa1).toFixed(2) + ' kg']);
  materiales.push(['Arena', (resultado * tasa2).toFixed(2) + ' m³']);
  materiales.push(['Ladrillos', Math.round(resultado * tasa3).toLocaleString('es-CO') + ' unidades']);

  var datos = {
    titulo: 'Muro de Ladrillo',
    tipo: 'muro',
    etiquetaPrincipal: 'Superficie del muro',
    valorPrincipal: resultado.toFixed(2) + ' m²',
    materiales: materiales,
    nota: ''
  };

  localStorage.setItem('resultado_actual', JSON.stringify(datos));
  window.location.href = 'resultado-muro.html';
}

// calcula los materiales de la viga
function calcularViga() {
  var dato1 = document.getElementById('c-largo').value;
  var largo = parseFloat(dato1);

  if (dato1 === '' || isNaN(largo) || largo <= 0) {
    alert('Completa todos los campos con valores numéricos válidos.');
    return;
  }

  var materiales = [];
  materiales.push(['Cemento', (largo * 9).toFixed(2) + ' kg']);
  materiales.push(['Arena', (largo * 0.02).toFixed(2) + ' m³']);
  materiales.push(['Piedra', (largo * 0.02).toFixed(2) + ' m³']);
  materiales.push(['Hierro del 8', (largo * 4).toFixed(2) + ' m']);
  materiales.push(['Hierro del 4', (largo * 3).toFixed(2) + ' m']);

  var datos = {
    titulo: 'Viga de Hormigón',
    tipo: 'viga',
    etiquetaPrincipal: 'Largo de la viga',
    valorPrincipal: largo.toFixed(2) + ' m',
    materiales: materiales,
    nota: ''
  };

  localStorage.setItem('resultado_actual', JSON.stringify(datos));
  window.location.href = 'resultado-viga.html';
}

// calcula los materiales de las columnas
function calcularColumna() {
  var dato1 = document.getElementById('c-largo').value;
  var largo = parseFloat(dato1);

  if (dato1 === '' || isNaN(largo) || largo <= 0) {
    alert('Completa todos los campos con valores numéricos válidos.');
    return;
  }

  var materiales = [];
  materiales.push(['Cemento', (largo * 7.5).toFixed(2) + ' kg']);
  materiales.push(['Arena', (largo * 0.016).toFixed(3) + ' m³']);
  materiales.push(['Piedra', (largo * 0.016).toFixed(3) + ' m³']);
  materiales.push(['Hierro del 10', (largo * 6).toFixed(2) + ' m']);
  materiales.push(['Hierro del 4', (largo * 3).toFixed(2) + ' m']);

  var datos = {
    titulo: 'Columnas de Hormigón',
    tipo: 'columna',
    etiquetaPrincipal: 'Largo de la columna',
    valorPrincipal: largo.toFixed(2) + ' m',
    materiales: materiales,
    nota: ''
  };

  localStorage.setItem('resultado_actual', JSON.stringify(datos));
  window.location.href = 'resultado-columna.html';
}

// calcula los materiales del contrapiso
function calcularContrapiso() {
  var dato1 = document.getElementById('c-espesor').value;
  var dato2 = document.getElementById('c-ancho').value;
  var dato3 = document.getElementById('c-largo').value;
  var espesor = parseFloat(dato1);
  var ancho = parseFloat(dato2);
  var largo = parseFloat(dato3);

  if (dato1 === '' || isNaN(espesor) || espesor <= 0) {
    alert('Completa todos los campos con valores numéricos válidos.');
    return;
  }
  if (dato2 === '' || isNaN(ancho) || ancho <= 0) {
    alert('Completa todos los campos con valores numéricos válidos.');
    return;
  }
  if (dato3 === '' || isNaN(largo) || largo <= 0) {
    alert('Completa todos los campos con valores numéricos válidos.');
    return;
  }

  var resultado = (espesor / 100) * ancho * largo;

  var materiales = [];
  materiales.push(['Cemento', (resultado * 105).toFixed(2) + ' kg']);
  materiales.push(['Arena', (resultado * 0.45).toFixed(2) + ' m³']);
  materiales.push(['Piedra', (resultado * 0.9).toFixed(2) + ' m³']);

  var datos = {
    titulo: 'Contrapisos',
    tipo: 'contrapiso',
    etiquetaPrincipal: 'Volumen del contrapiso',
    valorPrincipal: resultado.toFixed(2) + ' m³',
    materiales: materiales,
    nota: ''
  };

  localStorage.setItem('resultado_actual', JSON.stringify(datos));
  window.location.href = 'resultado-contrapiso.html';
}

// calcula los materiales del techo
function calcularTecho() {
  var dato1 = document.getElementById('c-espesor').value;
  var dato2 = document.getElementById('c-ancho').value;
  var dato3 = document.getElementById('c-largo').value;
  var n1 = parseFloat(dato1);
  var n2 = parseFloat(dato2);
  var n3 = parseFloat(dato3);

  if (dato1 === '' || isNaN(n1) || n1 <= 0) {
    alert('Completa todos los campos con valores numéricos válidos.');
    return;
  }
  if (dato2 === '' || isNaN(n2) || n2 <= 0) {
    alert('Completa todos los campos con valores numéricos válidos.');
    return;
  }
  if (dato3 === '' || isNaN(n3) || n3 <= 0) {
    alert('Completa todos los campos con valores numéricos válidos.');
    return;
  }

  var resultado = n2 * n3;

  var materiales = [];
  materiales.push(['Cemento', (resultado * 33).toFixed(2) + ' kg']);
  materiales.push(['Arena', (resultado * 0.072).toFixed(2) + ' m³']);
  materiales.push(['Piedra', (resultado * 0.072).toFixed(2) + ' m³']);
  materiales.push(['Hierro del 8', (resultado * 7).toFixed(2) + ' m']);
  materiales.push(['Hierro del 6', (resultado * 4).toFixed(2) + ' m']);

  var datos = {
    titulo: 'Techo',
    tipo: 'techo',
    etiquetaPrincipal: 'Superficie del techo',
    valorPrincipal: resultado.toFixed(2) + ' m²',
    materiales: materiales,
    nota: ''
  };

  localStorage.setItem('resultado_actual', JSON.stringify(datos));
  window.location.href = 'resultado-techo.html';
}

// calcula los materiales de los pisos
function calcularPisos() {
  var dato1 = document.getElementById('c-ancho').value;
  var dato2 = document.getElementById('c-largo').value;
  var ancho = parseFloat(dato1);
  var largo = parseFloat(dato2);

  if (dato1 === '' || isNaN(ancho) || ancho <= 0) {
    alert('Completa todos los campos con valores numéricos válidos.');
    return;
  }
  if (dato2 === '' || isNaN(largo) || largo <= 0) {
    alert('Completa todos los campos con valores numéricos válidos.');
    return;
  }

  var base = ancho * largo;
  var resultado = base * 1.1;

  var materiales = [];
  materiales.push(['Cerámicos / Porcelanato', resultado.toFixed(2) + ' m²']);
  materiales.push(['Pegamento / Adhesivo', (resultado * 5).toFixed(2) + ' kg']);
  materiales.push(['Pastina para Juntas', (resultado * 0.5).toFixed(2) + ' kg']);

  var datos = {
    titulo: 'Pisos',
    tipo: 'pisos',
    etiquetaPrincipal: 'Área total a cubrir (con 10% extra)',
    valorPrincipal: resultado.toFixed(2) + ' m²',
    materiales: materiales,
    nota: 'Se adicionó un 10% extra por recortes automáticamente.'
  };

  localStorage.setItem('resultado_actual', JSON.stringify(datos));
  window.location.href = 'resultado-pisos.html';
}

// calcula la pintura necesaria
function calcularPintura() {
  var dato1 = document.getElementById('c-superficie').value;
  var superficie = parseFloat(dato1);

  if (dato1 === '' || isNaN(superficie) || superficie <= 0) {
    alert('Completa todos los campos con valores numéricos válidos.');
    return;
  }

  var resultado = superficie / 6;

  var datos = {
    titulo: 'Pintura',
    tipo: 'pintura',
    etiquetaPrincipal: 'Litros de pintura necesarios',
    valorPrincipal: resultado.toFixed(2) + ' litros',
    materiales: [],
    nota: 'La pintura rinde 6 m² por litro de pintura.'
  };

  localStorage.setItem('resultado_actual', JSON.stringify(datos));
  window.location.href = 'resultado-pintura.html';
}

// llena la pagina del resultado del muro
function cargarResultadoMuro() {
  controlar_sesion();
  var t = localStorage.getItem('resultado_actual');
  if (t === null) {
    window.location.href = 'menu.html';
    return;
  }
  var d = JSON.parse(t);
  if (d.tipo !== 'muro') {
    window.location.href = 'menu.html';
    return;
  }
  document.getElementById('res-titulo').textContent = 'Resultado - ' + d.titulo;
  document.getElementById('res-label').textContent = d.etiquetaPrincipal;
  document.getElementById('res-valor').textContent = d.valorPrincipal;
  var c = document.getElementById('res-materiales');
  if (d.materiales.length > 0) {
    var h = '<h3>Materiales necesarios:</h3>';
    for (var i = 0; i < d.materiales.length; i++) {
      h = h + '<div class="mat-row">';
      h = h + '<span>' + d.materiales[i][0] + '</span>';
      h = h + '<span class="amt">' + d.materiales[i][1] + '</span>';
      h = h + '</div>';
    }
    c.innerHTML = h;
  }
}

// llena la pagina del resultado de la viga
function cargarResultadoViga() {
  controlar_sesion();
  var texto = localStorage.getItem('resultado_actual');
  if (texto === null) {
    window.location.href = 'menu.html';
    return;
  }
  var datos = JSON.parse(texto);
  if (datos.tipo !== 'viga') {
    window.location.href = 'menu.html';
    return;
  }
  document.getElementById('res-titulo').textContent = 'Resultado - ' + datos.titulo;
  document.getElementById('res-label').textContent = datos.etiquetaPrincipal;
  document.getElementById('res-valor').textContent = datos.valorPrincipal;
  var caja = document.getElementById('res-materiales');
  if (datos.materiales.length > 0) {
    var html = '<h3>Materiales necesarios:</h3>';
    for (var i = 0; i < datos.materiales.length; i++) {
      html = html + '<div class="mat-row">';
      html = html + '<span>' + datos.materiales[i][0] + '</span>';
      html = html + '<span class="amt">' + datos.materiales[i][1] + '</span>';
      html = html + '</div>';
    }
    caja.innerHTML = html;
  }
}

// llena la pagina del resultado de columnas
function cargarResultadoColumna() {
  controlar_sesion();
  var txt = localStorage.getItem('resultado_actual');
  if (txt === null) {
    window.location.href = 'menu.html';
    return;
  }
  var d = JSON.parse(txt);
  if (d.tipo !== 'columna') {
    window.location.href = 'menu.html';
    return;
  }
  document.getElementById('res-titulo').textContent = 'Resultado - ' + d.titulo;
  document.getElementById('res-label').textContent = d.etiquetaPrincipal;
  document.getElementById('res-valor').textContent = d.valorPrincipal;
  var caja = document.getElementById('res-materiales');
  if (d.materiales.length > 0) {
    var salida = '<h3>Materiales necesarios:</h3>';
    for (var i = 0; i < d.materiales.length; i++) {
      salida = salida + '<div class="mat-row">';
      salida = salida + '<span>' + d.materiales[i][0] + '</span>';
      salida = salida + '<span class="amt">' + d.materiales[i][1] + '</span>';
      salida = salida + '</div>';
    }
    caja.innerHTML = salida;
  }
}

// llena la pagina del resultado del contrapiso
function cargarResultadoContrapiso() {
  controlar_sesion();
  var texto = localStorage.getItem('resultado_actual');
  if (texto === null) {
    window.location.href = 'menu.html';
    return;
  }
  var datos = JSON.parse(texto);
  if (datos.tipo !== 'contrapiso') {
    window.location.href = 'menu.html';
    return;
  }
  document.getElementById('res-titulo').textContent = 'Resultado - ' + datos.titulo;
  document.getElementById('res-label').textContent = datos.etiquetaPrincipal;
  document.getElementById('res-valor').textContent = datos.valorPrincipal;
  var caja = document.getElementById('res-materiales');
  if (datos.materiales.length > 0) {
    var html = '<h3>Materiales necesarios:</h3>';
    for (var i = 0; i < datos.materiales.length; i++) {
      html = html + '<div class="mat-row">';
      html = html + '<span>' + datos.materiales[i][0] + '</span>';
      html = html + '<span class="amt">' + datos.materiales[i][1] + '</span>';
      html = html + '</div>';
    }
    caja.innerHTML = html;
  }
}

// llena la pagina del resultado del techo
function cargarResultadoTecho() {
  controlar_sesion();
  var t = localStorage.getItem('resultado_actual');
  if (t === null) {
    window.location.href = 'menu.html';
    return;
  }
  var d = JSON.parse(t);
  if (d.tipo !== 'techo') {
    window.location.href = 'menu.html';
    return;
  }
  document.getElementById('res-titulo').textContent = 'Resultado - ' + d.titulo;
  document.getElementById('res-label').textContent = d.etiquetaPrincipal;
  document.getElementById('res-valor').textContent = d.valorPrincipal;
  var c = document.getElementById('res-materiales');
  if (d.materiales.length > 0) {
    var h = '<h3>Materiales necesarios:</h3>';
    for (var i = 0; i < d.materiales.length; i++) {
      h = h + '<div class="mat-row">';
      h = h + '<span>' + d.materiales[i][0] + '</span>';
      h = h + '<span class="amt">' + d.materiales[i][1] + '</span>';
      h = h + '</div>';
    }
    c.innerHTML = h;
  }
}

// llena la pagina del resultado de pisos
function cargarResultadoPisos() {
  controlar_sesion();
  var texto = localStorage.getItem('resultado_actual');
  if (texto === null) {
    window.location.href = 'menu.html';
    return;
  }
  var datos = JSON.parse(texto);
  if (datos.tipo !== 'pisos') {
    window.location.href = 'menu.html';
    return;
  }
  document.getElementById('res-titulo').textContent = 'Resultado - ' + datos.titulo;
  document.getElementById('res-label').textContent = datos.etiquetaPrincipal;
  document.getElementById('res-valor').textContent = datos.valorPrincipal;
  var cajaMat = document.getElementById('res-materiales');
  if (datos.materiales.length > 0) {
    var html = '<h3>Materiales necesarios:</h3>';
    for (var i = 0; i < datos.materiales.length; i++) {
      html = html + '<div class="mat-row">';
      html = html + '<span>' + datos.materiales[i][0] + '</span>';
      html = html + '<span class="amt">' + datos.materiales[i][1] + '</span>';
      html = html + '</div>';
    }
    cajaMat.innerHTML = html;
  }
  if (datos.nota !== '') {
    var notaDiv = document.getElementById('res-nota');
    notaDiv.textContent = 'ⓘ ' + datos.nota;
    notaDiv.style.display = 'flex';
  }
}

// llena la pagina del resultado de la pintura
function cargarResultadoPintura() {
  controlar_sesion();
  var t = localStorage.getItem('resultado_actual');
  if (t === null) {
    window.location.href = 'menu.html';
    return;
  }
  var d = JSON.parse(t);
  if (d.tipo !== 'pintura') {
    window.location.href = 'menu.html';
    return;
  }
  document.getElementById('res-titulo').textContent = 'Resultado - ' + d.titulo;
  document.getElementById('res-label').textContent = d.etiquetaPrincipal;
  document.getElementById('res-valor').textContent = d.valorPrincipal;
  var caja = document.getElementById('res-materiales');
  if (d.materiales.length > 0) {
    var salida = '<h3>Materiales necesarios:</h3>';
    for (var i = 0; i < d.materiales.length; i++) {
      salida = salida + '<div class="mat-row">';
      salida = salida + '<span>' + d.materiales[i][0] + '</span>';
      salida = salida + '<span class="amt">' + d.materiales[i][1] + '</span>';
      salida = salida + '</div>';
    }
    caja.innerHTML = salida;
  }
  if (d.nota !== '') {
    var nd = document.getElementById('res-nota');
    nd.textContent = 'ⓘ ' + d.nota;
    nd.style.display = 'flex';
  }
}

arranque();
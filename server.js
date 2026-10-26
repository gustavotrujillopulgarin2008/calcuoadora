const http = require('http');
const fs = require('fs');
const path = require('path');

const PUERTO = 3000;
const ARCHIVO = path.join(__dirname, 'usuarios.json');

const tipos = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css',
  '.js': 'application/javascript'
};

function leerUsuarios() {
  if (!fs.existsSync(ARCHIVO)) return [];
  return JSON.parse(fs.readFileSync(ARCHIVO, 'utf8'));
}

function guardarUsuarios(lista) {
  fs.writeFileSync(ARCHIVO, JSON.stringify(lista, null, 2));
}

function responder(res, codigo, obj) {
  res.writeHead(codigo, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(obj));
}

const servidor = http.createServer((req, res) => {

  // ----- rutas de la API (registro, login, recuperar) -----
  if (req.method === 'POST' && req.url.startsWith('/api/')) {
    let cuerpo = '';
    req.on('data', d => cuerpo += d);
    req.on('end', () => {
      let datos;
      try {
        datos = JSON.parse(cuerpo);
      } catch (e) {
        return responder(res, 400, { ok: false, mensaje: 'Datos inválidos.' });
      }

      const lista = leerUsuarios();
      const pos = lista.findIndex(u => u.user === datos.user);

      if (req.url === '/api/registro') {
        if (pos !== -1) {
          return responder(res, 200, { ok: false, mensaje: 'Ese nombre de usuario ya existe.' });
        }
        lista.push({ user: datos.user, pass: datos.pass });
        guardarUsuarios(lista);
        return responder(res, 200, { ok: true });
      }

      if (req.url === '/api/login') {
        if (pos === -1 || lista[pos].pass !== datos.pass) {
          return responder(res, 200, { ok: false, mensaje: 'Usuario o contraseña incorrectos.' });
        }
        return responder(res, 200, { ok: true });
      }

      if (req.url === '/api/recuperar') {
        if (pos === -1) {
          return responder(res, 200, { ok: false, mensaje: 'No existe una cuenta con ese usuario.' });
        }
        lista[pos].pass = datos.pass;
        guardarUsuarios(lista);
        return responder(res, 200, { ok: true });
      }

      responder(res, 404, { ok: false, mensaje: 'Ruta no encontrada.' });
    });
    return;
  }

  // ----- archivos de la pagina (html, css, js) -----
  const ruta = req.url === '/' ? '/index.html' : req.url.split('?')[0];
  const archivo = path.join(__dirname, path.normalize(ruta));
  const nombre = path.basename(archivo);

  if (!archivo.startsWith(__dirname) || nombre === 'usuarios.json' || nombre === 'server.js') {
    res.writeHead(404);
    return res.end('No encontrado');
  }

  fs.readFile(archivo, (err, contenido) => {
    if (err) {
      res.writeHead(404);
      return res.end('No encontrado');
    }
    res.writeHead(200, { 'Content-Type': tipos[path.extname(archivo)] || 'text/plain' });
    res.end(contenido);
  });
});

servidor.listen(PUERTO, () => {
  console.log('Servidor listo en http://localhost:' + PUERTO);
});
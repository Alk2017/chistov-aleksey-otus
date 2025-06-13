#!/usr/bin/env node

/**
 * Module dependencies.
 */

var app = require('./app');
var debug = require('debug')('bce:server');
var http = require('http');
const WebSocket = require('ws');

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}


// Создаем WebSocket-сервер на порту 8080
const wsserver = new WebSocket.Server({ port: 3010 });

console.log('WebSocket сервер запущен на ws://localhost:3010');

sockets = []

// Обработка подключения клиента
wsserver.on('connection', (socket) => {
  console.log('Клиент подключен');
  sockets.push(socket);

  socket.on('upgrade', function upgrade(request, socket, head) {
    socket.on('error', onSocketError);

    console.log(request.headers);
  });

  // Отправляем приветственное сообщение клиенту
  socket.send('Добро пожаловать на WebSocket сервер!');

  // любая логика нотификацию

  // Обработка входящих сообщений от клиента
  socket.on('message', (message) => {
    console.log(`Получено сообщение: ${message}`);
    // Отправляем ответ клиенту
    socket.send(`Эхо: ${message}`);
    sockets.filter(client => client !== socket).forEach(client => {
      client.send(message.toString());
    });
  });

  // Обработка отключения клиента
  socket.on('close', () => {
    sockets = sockets.filter(client => client !== socket);
    console.log('Клиент отключился');
  });

  // Обработка ошибок
  socket.on('error', (error) => {
    console.error('Ошибка WebSocket:', error);
  });
});

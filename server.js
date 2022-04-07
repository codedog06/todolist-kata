const http = require('http');
const { v4: uuid4 } = require('uuid');
const errHandle = require('./errorHandle');
const todos = [];

const requestListener = (request, response) => {
 const headers = {
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'PATCH, POST, GET,OPTIONS,DELETE',
  'Content-Type': 'application/json'
 }

 let body = '';
 request.on('data', chunk => {
  // console.log(chunk);
  body += chunk;
 });

 if (request.url == '/todos' && request.method == 'GET') {
  response.writeHead(200, headers);
  response.write(JSON.stringify({
   'status': 'scuess',
   'data': todos,
  }));
  response.end();
 } else if (request.url == '/todos' && request.method == 'POST') {
  // request.on('end', ()=>{}) 需要body的資料
  request.on('end', () => { // 確保body有資料
   // try catch 檢查是否為物件格式, 但有可能是物件格式但key不是title 如: {'qq': title}
   try {
    const title = JSON.parse(body).title;
    if (title !== undefined) {
     const todo = {
      "title": title,
      "id": uuid4()
     };
     todos.push(todo);
     response.writeHead(200, headers);
     response.write(JSON.stringify({
      'status': 'scuess',
      'data': todos,
     }));
     response.end();
    } else {
     errHandle(response);
    }

   } catch (error) {
    errHandle(response);
   }
  });
 } else if (request.url == '/todos' && request.method == 'DELETE') {
  // 不需要request.on('end', ()=>{})
  // 不需要知道body的資料
  // DELETE只需要知道網址同 request Action
  todos.length = 0;
  response.writeHead(200, headers);
  response.write(JSON.stringify({
   'status': 'scuess',
   'data': todos,
  }));
  response.end();
 } else if (request.url.startsWith('/todos/') && request.method == 'DELETE') {
  const id = request.url.split('/').pop();
  const index = todos.findIndex(el => el.id == id);
  if (index !== -1) {
   todos.splice(index, 1);
   response.writeHead(200, headers);
   response.write(JSON.stringify({
    'status': 'scuess',
    'data': todos
   }));
   response.end();
  } else {
   errHandle(response);
  }
 } else if (request.url.startsWith('/todos/') && request.method == 'PATCH') {
  request.on('end', () => {
   try {
    const todo = JSON.parse(body).title;
    const id = request.url.split('/').pop();
    const index = todos.findIndex(el => el.id == id);
    // 檢查title是否有值, todo ID是否存在 -1代表不存在
    if (todo !== undefined && id !== -1) {
     todos[index].title = todo;
     response.writeHead(200, headers);
     response.write(JSON.stringify({
      'status': 'scuess',
      'data': todos,
     }));
     response.end();
    } else {
     errHandle(response);
    }
    response.end();
   } catch {
    errHandle(response);
   }
  });
 } else if (request.method == 'OPTIONS') {
  response.writeHead(200, headers);
  response.end();
 } else {
  response.writeHead(404, headers);
  response.write(JSON.stringify({
   'status': 'false',
   'message': 'error',
  }));
  response.end();
 }

}
const server = http.createServer(requestListener);
server.listen(process.env.PORT || 3005);
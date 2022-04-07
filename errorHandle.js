function errorHandle(response) {
 const headers = {
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'PATCH, POST, GET, OPTIONS, DELETE',
  'Content-Type': 'application/json'
 }
 response.writeHead(400, headers);
 response.write(JSON.stringify({
  'status': 'false',
  'message': 'error message 213123',
 }));
 response.end();
}

module.exports = errorHandle;
import * as http from 'node:http';

export const userRequestListener: http.RequestListener = (req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World\n');
}

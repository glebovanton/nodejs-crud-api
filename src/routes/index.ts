import * as http from 'node:http';
import { getAllUsers, getUserById } from '../controllers/users';

export const userRequestListener: http.RequestListener = (req, res) => {
  const { method, url }: http.IncomingMessage = req;
  const urlParts: (string | undefined)[] = url?.split('/').filter(Boolean) || [];
  const [ basePath, path, userId ]: (string | undefined)[] = urlParts;

  if (basePath === 'api') {
    if (path === 'users') {
      switch (method) {
        case 'GET':
          if (userId){
            getUserById(req, res);
          } else {
            getAllUsers(req, res);
          }
          break;
        case 'POST':
          res.statusCode = 200;
          res.setHeader('Content-Type', 'text/plain');
          res.end(`Hello World! ${userId}`);
          break;
        case 'PUT':
          res.statusCode = 200;
          res.setHeader('Content-Type', 'text/plain');
          res.end(`Hello World! ${userId}`);
          break;
        case 'DELETE':
          res.statusCode = 200;
          res.setHeader('Content-Type', 'text/plain');
          res.end(`Hello World! ${userId}`);
          break;
        default:
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ message: 'Endpoint not found' }));
          break;
      }
    }

  }

}

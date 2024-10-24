import * as http from 'node:http';
import { createUser, deleteUser, getAllUsers, getUserById, updateUser } from '../controllers/users';
import { UserMessage } from '../types';

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
          createUser(req, res);
          break;
        case 'PUT':
          updateUser(req, res);
          break;
        case 'DELETE':
          deleteUser(req, res);
          break;
        default:
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ message: UserMessage.EndpointNotFound }));
          break;
      }

      return;
    }

    return;
  }

  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ message: UserMessage.EndpointNotFound }));
}

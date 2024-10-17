import * as http from 'node:http';
import { getUsersInDb, getUserByIdInDb } from '../db';

export const getAllUsers: http.RequestListener = (req: http.IncomingMessage, res: http.ServerResponse) => {
  try {
    const users = getUsersInDb();

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(users));
  } catch (error) {
    res.statusCode = 500;
    res.end(JSON.stringify({ message: 'Internal server error' }));
  }
}

export const getUserById: http.RequestListener = (req: http.IncomingMessage, res: http.ServerResponse) => {
  try {
    const { url }: http.IncomingMessage = req;
    const urlParts: (string | undefined)[] = url?.split('/').filter(Boolean) || [];
    const [ basePath, path, userId ]: (string | undefined)[] = urlParts;
    const user = getUserByIdInDb(userId);
    if (!user) {
      res.statusCode = 404;
      res.end(JSON.stringify({ message: 'User not found' }));
    } else {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(user));
    }
  } catch (error) {
    res.statusCode = 500;
    res.end(JSON.stringify({ message: 'Internal server error' }));
  }
}

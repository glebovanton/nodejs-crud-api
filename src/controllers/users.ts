import * as http from 'node:http';
import { StatusCode } from 'status-code-enum'
import { User, UserDTO, UserMessage } from '../types';
import { getUsersInDb, getUserByIdInDb, addUserInDb, updateUserInDb, deleteUserInDb } from '../db';
import { validateUserId, validateUserPayload } from '../helpers';

export const getAllUsers: http.RequestListener = (req: http.IncomingMessage, res: http.ServerResponse) => {
  try {
    const users: User[] = getUsersInDb();

    res.statusCode = StatusCode.SuccessOK;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(users));
  } catch (error) {
    res.statusCode = StatusCode.ServerErrorInternal;
    res.end(JSON.stringify({ message: UserMessage.InternalServerError }));
  }
}

export const getUserById: http.RequestListener = (req: http.IncomingMessage, res: http.ServerResponse) => {
  try {
    const { url }: http.IncomingMessage = req;
    const urlParts: (string | undefined)[] = url?.split('/').filter(Boolean) || [];
    const [ basePath, path, userId ]: (string | undefined)[] = urlParts;

    if (!validateUserId(userId)) {
      res.statusCode = StatusCode.ClientErrorBadRequest;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ message: UserMessage.UserInvalid }));
      return;
    }

    const user: User | undefined = getUserByIdInDb(userId);
    if (!user) {
      res.statusCode = StatusCode.ClientErrorNotFound;
      res.end(JSON.stringify({ message: UserMessage.UserNotFound }));
    } else {
      res.statusCode = StatusCode.SuccessOK;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(user));
    }
  } catch (error) {
    res.statusCode = StatusCode.ServerErrorInternal;
    res.end(JSON.stringify({ message: UserMessage.InternalServerError }));
  }
}

export const createUser: http.RequestListener = (req: http.IncomingMessage, res: http.ServerResponse) => {
  if (req.method === 'POST') {
    let body = '';

    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', () => {
      try {
        const user: UserDTO = JSON.parse(body);
        const { username, age, hobbies } = user;

        if (!validateUserPayload(user)) {
          res.statusCode = StatusCode.ClientErrorBadRequest;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ message: UserMessage.UserInvalid }));
        } else {
          const newUser = addUserInDb({ username, age, hobbies });

          res.statusCode = StatusCode.SuccessCreated;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(newUser));
        }
      } catch (error) {
        console.error(error);
        res.statusCode = StatusCode.ServerErrorInternal;
        res.end(JSON.stringify({ message: UserMessage.InternalServerError }));
      }
    });
  } else {
    res.statusCode = StatusCode.ClientErrorMethodNotAllowed;
    res.end(JSON.stringify({ message: 'Method Not Allowed' }));
  }
};

export const updateUser: http.RequestListener = (req: http.IncomingMessage, res: http.ServerResponse) => {
  let body = '';
  req.on('data', (chunk) => {
    body += chunk.toString();
  });
  req.on('end', () => {
    try {
      const { url }: http.IncomingMessage = req;
      const urlParts: (string | undefined)[] = url?.split('/').filter(Boolean) || [];
      const [ basePath, path, userId ]: (string | undefined)[] = urlParts;
      const user: UserDTO = JSON.parse(body);
      let updatedUser: User | undefined;

      if (!validateUserId(userId) || !validateUserPayload(user)) {
        res.statusCode = StatusCode.ClientErrorBadRequest;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ message: UserMessage.UserInvalid }));

        return;
      }

      if (userId) updatedUser = updateUserInDb(userId, user);

      if (!updatedUser) {
        res.statusCode = StatusCode.ClientErrorNotFound;
        res.end(JSON.stringify({ message: UserMessage.UserNotFound }));

        return;
      }

      res.statusCode = StatusCode.SuccessOK;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(updatedUser));
    } catch (error) {
      res.statusCode = StatusCode.ServerErrorInternal;
      res.end(JSON.stringify({ message: UserMessage.InternalServerError }));
    }
  });
}

export const deleteUser: http.RequestListener = (req: http.IncomingMessage, res: http.ServerResponse) => {
  try {
    const { url }: http.IncomingMessage = req;
    const urlParts: (string | undefined)[] = url?.split('/').filter(Boolean) || [];
    const [ b, p, userId ]: (string | undefined)[] = urlParts;

    if (!validateUserId(userId)) {
      res.statusCode = StatusCode.ClientErrorBadRequest;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ message: UserMessage.UserInvalid }));
    } else {
      if (userId) {
        const deletedUser = deleteUserInDb(userId);

        if (deletedUser) {
          res.statusCode = StatusCode.SuccessNoContent;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ message: UserMessage.UserDeleted }));
        } else {
          res.statusCode = StatusCode.ClientErrorNotFound;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ message: UserMessage.UserNotFound }));
        }
      }
    }
  } catch (error) {
    res.statusCode = StatusCode.ServerErrorInternal;
    res.end(JSON.stringify({ message: UserMessage.InternalServerError }));
  }
};

import * as http from 'node:http';
import { StatusCode } from 'status-code-enum'
import { User, UserDTO, UserMessage } from '../types';
import { getUsersInDb, getUserByIdInDb, addUserInDb, updateUserInDb, deleteUserInDb } from '../db';
import { validateUserId, validateUserPayload, sendResponse } from '../helpers';

export const getAllUsers: http.RequestListener = (req: http.IncomingMessage, res: http.ServerResponse) => {
  try {
    const users: User[] = getUsersInDb();

    sendResponse(res, StatusCode.SuccessOK, users);
  } catch (error) {
    sendResponse(res, StatusCode.ServerErrorInternal, { message: UserMessage.InternalServerError });
  }
}

export const getUserById: http.RequestListener = (req: http.IncomingMessage, res: http.ServerResponse) => {
  try {
    const { url }: http.IncomingMessage = req;
    const urlParts: (string | undefined)[] = url?.split('/').filter(Boolean) || [];
    const [ basePath, path, userId ]: (string | undefined)[] = urlParts;

    if (!validateUserId(userId)) {
      sendResponse(res, StatusCode.ClientErrorBadRequest, { message: UserMessage.UserInvalid });

      return;
    }

    const user: User | undefined = getUserByIdInDb(userId);
    if (!user) {
      sendResponse(res, StatusCode.ClientErrorNotFound, { message: UserMessage.UserNotFound });
    } else {
      sendResponse(res, StatusCode.SuccessOK, user);
    }
  } catch (error) {
    sendResponse(res, StatusCode.ServerErrorInternal, { message: UserMessage.InternalServerError });
  }
}

export const createUser: http.RequestListener = (req: http.IncomingMessage, res: http.ServerResponse) => {
  let body = '';

    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', () => {
      try {
        const user: UserDTO = JSON.parse(body);
        const { username, age, hobbies } = user;

        if (!validateUserPayload(user)) {
          sendResponse(res, StatusCode.ClientErrorBadRequest, { message: UserMessage.UserInvalid });
        } else {
          const newUser = addUserInDb({ username, age, hobbies });

          sendResponse(res, StatusCode.SuccessCreated, newUser);
        }
      } catch (error) {
        sendResponse(res, StatusCode.ServerErrorInternal, { message: UserMessage.InternalServerError });
      }
    });
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
        sendResponse(res, StatusCode.ClientErrorBadRequest, { message: UserMessage.UserInvalid });

        return;
      }

      if (userId) updatedUser = updateUserInDb(userId, user);

      if (!updatedUser) {
        sendResponse(res, StatusCode.ClientErrorNotFound, { message: UserMessage.UserNotFound });

        return;
      }

      sendResponse(res, StatusCode.SuccessOK, updatedUser)
    } catch (error) {
      sendResponse(res, StatusCode.ServerErrorInternal, { message: UserMessage.InternalServerError });
    }
  });
}

export const deleteUser: http.RequestListener = (req: http.IncomingMessage, res: http.ServerResponse) => {
  try {
    const { url }: http.IncomingMessage = req;
    const urlParts: (string | undefined)[] = url?.split('/').filter(Boolean) || [];
    const [ b, p, userId ]: (string | undefined)[] = urlParts;

    if (!validateUserId(userId)) {
      sendResponse(res, StatusCode.ClientErrorBadRequest, { message: UserMessage.UserInvalid });
    } else {
      if (userId) {
        const deletedUser = deleteUserInDb(userId);

        if (deletedUser) {
          sendResponse(res, StatusCode.SuccessNoContent, { message: UserMessage.UserDeleted });
        } else {
          sendResponse(res, StatusCode.ClientErrorNotFound, { message: UserMessage.UserNotFound });
        }
      }
    }
  } catch (error) {
    sendResponse(res, StatusCode.ServerErrorInternal, { message: UserMessage.InternalServerError });
  }
};

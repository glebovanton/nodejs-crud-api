import * as http from 'node:http';
import { validate as validateUUID } from 'uuid';
import { UserDTO, User } from '../types';

export const adminUserId = 'e8349978-ebdd-4a1f-975b-86188e8f5229';

export const sendResponse = (res: http.ServerResponse, statusCode: number, message: object) => {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(message));
}

export const validateUserId = (userId: string | undefined): boolean => {
  return !!userId && validateUUID(userId);
};

export const validateUserPayload = (user: UserDTO | User): boolean => {
  const { username, age, hobbies } = user;

  return !!user && !!username && !!age && Array.isArray(hobbies);
};

import { UserDTO, User } from '../types';
import { validate as validateUUID } from 'uuid';

export const validateUserId = (userId: string | undefined): boolean => {
  return !!userId && validateUUID(userId);
};

export const validateUserPayload = (user: UserDTO | User): boolean => {
  const { username, age, hobbies } = user;

  return !!user && !!username && !!age && Array.isArray(hobbies);
};

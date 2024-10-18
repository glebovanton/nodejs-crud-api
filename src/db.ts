import { v4 as uuidv4 } from 'uuid';
import { User, UserDTO } from './types';

let users: User[] = [{
  id: '0',
  username: 'Admin',
  age: 30,
  hobbies: ['JS', 'TS']
}];

export const addUserInDb = (user: UserDTO): User => {
  const newUser = { ...user, id: uuidv4() };
  users = [...users, { ...user, id: uuidv4() }];

  return newUser;
};

export const getUsersInDb = () => users || [];

export const getUserByIdInDb = (id: string | undefined): User | undefined => id ?
  users.find((user) => user.id === id) :
  undefined;

export const updateUserByIdInDb = (id: string, user: User) => {
  users = users.map((u) => (u.id === id ? { ...user, id } : u));
};

export const deleteUserByIdInDb = (id: string) => {
  users = users.filter((user) => user.id !== id);
};

export const clearUsersInDb = () => {
  users = [];
};

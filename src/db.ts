import { v4 as uuidv4 } from 'uuid';
import { User } from './types';

let users: User[] = [{
  id: '0',
  username: 'Admin',
  age: 30,
  hobbies: ['JS', 'TS']
}];

export const addUser = (user: User) => {
  users = [...users, { ...user, id: uuidv4() }];
};

export const getUsersInDb = () => users || [];

export const getUserByIdInDb = (id: string | undefined): User | undefined => id ?
  users.find((user) => user.id === id) :
  undefined;

export const updateUserById = (id: string, user: User) => {
  users = users.map((u) => (u.id === id ? { ...user, id } : u));
};

export const deleteUserById = (id: string) => {
  users = users.filter((user) => user.id !== id);
};

export const clearUsers = () => {
  users = [];
};

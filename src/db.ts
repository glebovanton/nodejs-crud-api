import { v4 as uuidv4 } from 'uuid';
import { User, UserDTO } from './types';
import { adminUserId } from './helpers';

let users: User[] = [{
  id: adminUserId,
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

export const updateUserInDb = (id: string, user: UserDTO): User | undefined => {
  const existingUser = users.find((u) => u.id === id);

  if (!existingUser) {
    return undefined;
  }

  users = users.map((u) => (u.id === id ? { ...user, id } : u));

  return { ...user, id };
};

export const deleteUserInDb = (id: string): User | undefined => {
  const userIndex = users.findIndex((user) => user.id === id);

  if (userIndex === -1) {
    return undefined;
  }

  const deletedUser = users[userIndex];

  users.splice(userIndex, 1);

  return deletedUser;
};

export const clearUsersInDb = () => {
  users = [];
};

export interface UserDTO {
  username: string;
  age: number;
  hobbies: string[];
}

export interface User extends UserDTO {
  id: string;
}

export enum UserMessage {
  UserNotFound = 'User not found',
  UserInvalid = 'User invalid',
  UserDeleted = 'User deleted',
  InternalServerError = 'Internal server error',
  EndpointNotFound = 'Endpoint not found',
}

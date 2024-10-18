export interface UserDTO {
  username: string;
  age: number;
  hobbies: string[];
}

export interface User extends UserDTO {
  id: string;
}

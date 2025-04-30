import { User } from "@/types/users";

const users: User[] = [
  {
    id: "66997KJJ8Jjjjkj", // uuid
    email: "test@test.test",
    passwordHash: "mlkjmlskdjqsmlkjqsmlkj", // pass: azerty1234!
  },
  {
    id: "87654321-1234-5678-90ab-cdef12345678", // uuid
    email: "user1@example.com",
    passwordHash: "hashedpassword1", // pass: examplePass1!
  },
  {
    id: "12345678-abcd-1234-efgh-1234567890ab", // uuid
    email: "user2@example.com",
    passwordHash: "hashedpassword2", // pass: anotherPass1!
  },
  {
    id: "abcdef12-3456-7890-abcd-ef1234567890", // uuid
    email: "user3@example.com",
    passwordHash: "hashedpassword3", // pass: securePass1!
  },
];

const getOne = async (id: string): Promise<User> => {
  const u = users.find((u) => u.id === id);
  if (!u) throw new Error("User not found");
  return u;
};

const getOneByEmail = async (email: string): Promise<User> => {
  const u = users.find((u) => u.email === email);
  if (!u) throw new Error("User not found");
  return u;
};

const getAll = async (): Promise<User[]> => users;

const update = async (user: User): Promise<User> => {
  const i = users.findIndex((u) => u.id === user.id);
  if (i >= 0) {
    users[i] = user;
    return user;
  }
  throw new Error("User not found");
};

const deleteOne = async (id: string): Promise<void> => {
  users.splice(
    users.findIndex((u) => u.id === id),
    1,
  );
};

const create = async (user: User): Promise<User> => {
  users.push(user);
  return user;
};

const userDb = {
  getOne,
  getOneByEmail,
  getAll,
  update,
  deleteOne,
  create,
};

export default userDb;

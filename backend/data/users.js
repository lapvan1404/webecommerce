import bcrypt from 'bcryptjs';

const users = [
  {
    name: 'Admin User',
    email: 'admin@email.com',
    phone: '+84900000001',
    password: bcrypt.hashSync('123456', 10),
    isAdmin: true,
  },
  {
    name: 'John Doe',
    email: 'john@email.com',
    phone: '+84900000002',
    password: bcrypt.hashSync('123456', 10),
    isAdmin: false,
  },
  {
    name: 'Jane Doe',
    email: 'jane@email.com',
    phone: '+84900000003',
    password: bcrypt.hashSync('123456', 10),
    isAdmin: false,
  },
];

export default users;

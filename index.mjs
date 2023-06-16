import fs from 'fs';
import jsonServer from 'json-server';
import { compareSync } from 'bcrypt-ts';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();
const db = JSON.parse(fs.readFileSync('./db.json', 'UTF-8'));
const expiresIn = '1h';
const PORT = 8000;

server.use(middlewares);
server.use(cors());
server.use(jsonServer.bodyParser);
// /^(?!\/auth).*$/
server.use(/^\/api(?!\/(signin | signup)).*$/, (req, res, next) => {
  if (
    req.headers.authorization === undefined ||
    req.headers.authorization.split(' ')[0] !== 'Bearer'
  ) {
    const status = 401;
    const message = 'Bad authorization header';
    res.status(status).json({ status, message });
    return;
  }

  try {
    const token = req.headers.authorization.split(' ')[1];

    const decoded = jwt.verify(token, SECRET_KEY);

    // do something with decoded e.g. check if role is allowed to access

    if (req.method === 'POST') {
      req.body.createdAt = new Date().toISOString();
    }

    next();
  } catch (err) {
    console.log(err);
    const status = 401;
    const message = 'Error: access_token is not valid';
    res.status(status).json({ status, message });
  }
});

server.post('/auth/signin', (req, res) => {
  const user = isAuthenticated(req.body);

  if (user === null) {
    const status = 401;
    const message = 'Incorrect identifier or password';
    res.status(status).json({ status, message });
    return;
  }

  res.status(200).json({
    user,
    accessToken: jwt.sign(user, process.env.SECRET_KEY, { expiresIn }),
  });
});

server.use('/api', router);

server.listen(PORT, () => {
  console.log(`JSON Server is running on http://localhost:${PORT}/api`);
});

function isAuthenticated({ identifier, password }) {
  const user = db.users.find(
    (user) => user.phoneNumber === identifier || user.username === identifier
  );

  if (user === undefined) return null;

  const { password: hash, ...withoutPassword } = user;

  return compareSync(password, hash) ? withoutPassword : null;
}

// Sources used:
// https://www.techiediaries.com/fake-api-jwt-json-server/
// https://github.com/typicode/json-server
// https://www.npmjs.com/package/jsonwebtoken
// https://www.npmjs.com/package/bcrypt-ts
// https://chrisdevcode.hashnode.dev/how-to-create-and-deploy-a-json-server
// https://jasonwatmore.com/fetch-add-bearer-token-authorization-header-to-http-request
// https://medium.com/codait/environment-variables-or-keeping-your-secrets-secret-in-a-node-js-app-99019dfff716
// https://github.com/motdotla/dotenv/issues/89

import sha1 from 'sha1';
import { v4 as uuidv4 } from 'uuid';
import dbClient from '../utils/db';
import redisClient from '../utils/redis';

const AuthController = {

  async getConnect(req, res) {
    const authHeader = req.headers.authorization;

    const extractBase64AuthorizationHeader = (authHeader) => {
      if (
        !authHeader || !authHeader.startsWith('Basic ') || typeof (authHeader) !== 'string'
      ) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      return authHeader.split(' ')[1];
    };

    const decodeBase64AuthorizationHeader = (encodedAuthHeader) => {
      const credentials = Buffer.from(encodedAuthHeader, 'base64').toString('utf-8');
      return credentials.split(':');
    };

    const base64Credentials = extractBase64AuthorizationHeader(authHeader);
    const [email, password] = decodeBase64AuthorizationHeader(base64Credentials);

    const user = await dbClient.findUser({ email, password: sha1(password) });
    if (!user) return res.status(401).json({ error: 'Unauthorized' });

    const token = uuidv4();
    const key = `auth_${token}`;

    await redisClient.setex(key, 60 * 60 * 24, user._id.toString());

    return res.status(200).json({ token });
  },
  async getDisconnect(req, res) {
    const token = req.headers['x-token'];
    if (
      !token || typeof (token) !== 'string'
    ) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const key = `auth_${token}`;
    const userId = await redisClient.get(key);
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    await redisClient.del(`auth_${token}`);
    return res.status(200).send();
  },
};

export default AuthController;

import sha1 from 'sha1';
import dbClient from '../utils/db';
import redisClient from '../utils/redis';

const UsersController = {

  async postNew(req, res) {
    const { email, password } = req.body;
    if (!email) return res.status(400).json({ error: 'Missing email' });
    if (!password) return res.status(400).json({ error: 'Missing password' });

    const user = await dbClient.findUser({ email });

    if (user) return res.status(400).json({ error: 'Already exist' });

    const result = await dbClient.insertUser({ email, password: sha1(password) });
    return res.status(201).json({ id: result, email });
  },
  async getMe(req, res) {
    const token = req.headers['x-token'];

    if (!token || typeof token !== 'string') {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const userId = await redisClient.get(`auth_${token}`);
    console.log('userId from Redis:', { _id: userId });
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const user = await dbClient.findUser({ _id: userId });
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    return res.status(200).json({ email: user.email, id: user._id });
  },
};

export default UsersController;

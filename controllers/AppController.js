import dbClient from '../utils/db';
import redisClient from '../utils/redis';

const AppController = {
  async getStatus(req, res) {
    const redisIsAlive = await redisClient.isAlive();
    const dbIsAlive = await dbClient.isAlive();

    const status = {
      redis: redisIsAlive,
      db: dbIsAlive,
    };

    return res.status(200).json(status);
  },

  async getStats(req, res) {
    const nbUsers = await dbClient.nbUsers();
    const nbFiles = await dbClient.nbFiles();

    const stats = {
      users: nbUsers,
      files: nbFiles,
    };

    return res.status(200).json(stats);
  },
};

export default AppController;

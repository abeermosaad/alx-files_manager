import { MongoClient } from 'mongodb';

class DBClient {
  constructor() {
    this.host = process.env.DB_HOST || 'localhost';
    this.port = process.env.DB_PORT || 27017;
    this.database = process.env.DB_DATABASE || 'files_manager';
    this.url = `mongodb://${this.host}:${this.port}`;
    this.client = new MongoClient(this.url);
    this.client.connect();
  }

  isAlive() {
    return this.client.isConnected();
  }

  async nbUsers() {
    const users = this.client.db(this.database);
    return users.collection('users').countDocuments();
  }

  async nbFiles() {
    const files = this.client.db(this.database);
    return files.collection('files').countDocuments();
  }
}

const dbClient = new DBClient();
export default dbClient;

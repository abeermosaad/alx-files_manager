import { MongoClient, ObjectId } from 'mongodb';

class DBClient {
  constructor() {
    this.host = process.env.DB_HOST || 'localhost';
    this.port = process.env.DB_PORT || 27017;
    this.database = process.env.DB_DATABASE || 'files_manager';
    this.url = `mongodb://${this.host}:${this.port}`;
    this.client = new MongoClient(this.url, { useUnifiedTopology: true });
    this.client.connect();
  }

  isAlive() {
    return this.client.isConnected();
  }

  async nbUsers() {
    const database = this.client.db(this.database);
    return database.collection('users').countDocuments();
  }

  async nbFiles() {
    const database = this.client.db(this.database);
    return database.collection('files').countDocuments();
  }

  async findUser(dic) {
    const dataBase = this.client.db(this.database);
    const query = { ...dic };
    if (dic._id) {
      query._id = new ObjectId(dic._id);
    }
    return dataBase.collection('users').findOne(query);
  }

  async insertUser(dic) {
    const dataBase = this.client.db(this.database);
    const result = await dataBase.collection('users').insertOne(dic);
    return result.insertedId;
  }
}

const dbClient = new DBClient();
export default dbClient;

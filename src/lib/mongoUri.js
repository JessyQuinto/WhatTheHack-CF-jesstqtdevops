import { MongoMemoryServer } from "mongodb-memory-server";

const mongoURI = process.env.MONGODB_URI;

if (!mongoURI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable"
  );
}

async function getMongoUri() {
  if (mongoURI === "test") {
    // use test in-memory database for testing
    if (!global.mongoMemoryServer) {
      global.mongoMemoryServer = await MongoMemoryServer.create()
    }
    const mongoMemoryServer = global.mongoMemoryServer;
    console.log(mongoMemoryServer.getUri())
    return mongoMemoryServer.getUri();
  } else {
    // use environment variable
    return mongoURI;
  }
}

export default getMongoUri;
import { MongoMemoryServer } from "mongodb-memory-server";

async function getMongoUri() {
  // Check for MONGODB_URI in environment variables (set by GitHub Actions)
  const mongoURI = process.env.MONGODB_URI;

  if (!mongoURI) {
    if (process.env.NODE_ENV === "development") {
      throw new Error(
        "Please define the MONGODB_URI environment variable"
      );
    } else if (process.env.NODE_ENV === "test") {
      // Use in-memory database for testing
      if (!global.mongoMemoryServer) {
        global.mongoMemoryServer = await MongoMemoryServer.create();
      }
      const mongoMemoryServer = global.mongoMemoryServer;
      console.log(mongoMemoryServer.getUri());
      return mongoMemoryServer.getUri();
    } else {
      throw new Error(
        "MONGODB_URI is not defined and not in test environment"
      );
    }
  }

  return mongoURI;
}

export default getMongoUri;
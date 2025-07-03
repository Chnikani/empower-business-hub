import express, { Express } from "express";
import { IStorage } from "./storage";
import { registerRoutes } from "./routes";

export class Api {
  app: Express;
  storage: IStorage;

  constructor(storage: IStorage) {
    this.app = express();
    this.app.use(express.json());
    this.storage = storage;
    registerRoutes(this);
  }

  start(port: number) {
    this.app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  }
}
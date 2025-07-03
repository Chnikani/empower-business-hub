import { Api } from "./api";
import { storage } from "./storage";

const api = new Api(storage);

export default api.app;
import { whatsappSocket } from "../../sockets/whatsappSocket";

declare global {
  namespace Express {
    export interface Request {
      wa: {
        [id: string]: whatsappSocket;
      }
    }
  }
}
import express, { Request, Response, NextFunction } from 'express'
import { whatsappSocket } from './sockets/whatsappSocket'
import bodyParser from 'body-parser'

import * as qrController from './controllers/qrController'
import * as messageController from './controllers/messageController'
import * as statusController from './controllers/statusController'

const app = express()

app.use(bodyParser.json())

const wa = new whatsappSocket()
wa.Initialize()
const exposeWhatsappSocket = (req: Request, res: Response, next: NextFunction) => {
  req.wa = wa
  next()
}

app.get('/qr', exposeWhatsappSocket ,qrController.getQR)
app.post('/message', exposeWhatsappSocket, messageController.sendTextMessage)
app.get('/status', exposeWhatsappSocket, statusController.getStatus)

export default app
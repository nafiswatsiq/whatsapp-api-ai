import express, { Request, Response, NextFunction } from 'express'
import { Initialize } from './sockets/whatsappSocket'
import bodyParser from 'body-parser'

import * as qrController from './controllers/qrController'
import * as messageController from './controllers/messageController'
import * as statusController from './controllers/statusController'

const app = express()

app.use(bodyParser.json())

Initialize()

app.get('/', (_req: Request, res: Response) => {
  return res.send('Hello There! I am WhatsApp Bot.')
})
app.get('/qr', qrController.getQR)
app.post('/message', messageController.sendTextMessage)
app.get('/status', statusController.getStatus)

export default app
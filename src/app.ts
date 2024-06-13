import express, { Request, Response, NextFunction } from 'express'
import { whatsappSocket } from './sockets/whatsappSocket'
import bodyParser from 'body-parser'

import * as qrController from './controllers/qrController'
import * as messageController from './controllers/messageController'
import * as statusController from './controllers/statusController'

const app = express()

app.use(bodyParser.json())

const wa = new whatsappSocket('default')
wa.Initialize()

const exposeWhatsappSocket = (req: Request, res: Response, next: NextFunction) => {
  req.wa = {}
  next()
}

app.get('/qr/:id', exposeWhatsappSocket, (req, res, next) => {
  const id = req.params.id
  req.wa[id] = new whatsappSocket(id)
  req.wa[id].Initialize()
  next()
}, qrController.getQR)

app.post('/message/:id', exposeWhatsappSocket, (req, res, next) => {
  const id = req.params.id
  req.wa[id] = new whatsappSocket(id)
  req.wa[id].Initialize()
  next()
}, messageController.sendTextMessage)

app.get('/status/:id', exposeWhatsappSocket, (req, res, next) => {
  const id = req.params.id
  req.wa[id] = new whatsappSocket(id)
  req.wa[id].Initialize()
  next()
}, statusController.getStatus)

export default app
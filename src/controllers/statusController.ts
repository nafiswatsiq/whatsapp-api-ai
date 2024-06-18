import { Request, Response } from 'express'
import { getStatus as Status } from '../sockets/whatsappSocket'

export const getStatus = async (req: Request, res: Response) => {
  const status = Status()
  if(status) {
    res.json({ 
      error: false,
      status
    })
  } else {
    res.status(500).json({ 
      error: true,
      message: 'Terjadi kesalahan saat mendapatkan status'
    })
  }
}
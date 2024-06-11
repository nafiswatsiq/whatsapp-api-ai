import { Request, Response } from 'express'

export const getStatus = async (req: Request, res: Response) => {
  const status = req.wa?.getStatus()
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
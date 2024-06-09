import { Request, Response } from 'express'
import QRCode from 'qrcode'

export const getQR = async (req: Request, res: Response) => {
  try {
    const status = req.wa?.getStatus()

    if(status?.needRestartSocket) {
      res.status(500).json({ 
        error: true,
        message: 'Socket perlu di restart' 
      })
      return
    }

    if(status?.isConnected) {
      res.status(400).json({ 
        error: true,
        message: 'Anda sudah terhubung',
        phoneNumber: req.wa?.phoneNumber
      })
      return
    }

    QRCode.toDataURL(req.wa!.qrcode, (err: Error | null | undefined, url: string) => {
      if(err) {
        console.error(err)
        res.status(500).json({ 
          error: true,
          message: 'Terjadi kesalahan saat mendapatkan QR Code' 
        })
        return
      }
      res.json({ 
        error: false,
        message: 'Silahkan scan QR Code untuk terhubung',
        url, 
        isConnected: status?.isConnected, 
        phoneNumber: status?.phoneNumber 
      })
    })

  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Maaf Terjadi kesalahan saat mendapatkan QR Code' })
  }
}
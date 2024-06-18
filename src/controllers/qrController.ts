import { delay } from '@whiskeysockets/baileys'
import { Request, Response } from 'express'
import QRCode from 'qrcode'
import { getStatus, Initialize, qrcode } from '../sockets/whatsappSocket'

export const getQR = async (req: Request, res: Response) => {
  const getQRCode = async () => {
    QRCode.toDataURL(qrcode, (err: Error | null | undefined, url: string) => {
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
      })
    })
  }
  try {
    const status = getStatus()

    if(status?.needRestart) {
      Initialize()
      
      setTimeout(() => {
        getQRCode()
      }, 5000)
      return
    }

    if(status?.isConnected) {
      res.status(400).json({ 
        error: true,
        status
      })
      return
    }

    getQRCode()

  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Maaf Terjadi kesalahan saat mendapatkan QR Code' })
  }
}
import { delay } from '@whiskeysockets/baileys'
import { Request, Response } from 'express'
import QRCode from 'qrcode'

export const getQR = async (req: Request, res: Response) => {
  const id = req.params.id
  const wa = req.wa[id]

  const getQRCode = async (): Promise<string | null> => {
    return new Promise((resolve, reject) => {
      QRCode.toDataURL(wa!.qrcode, (err: Error | null | undefined, url: string) => {
        if(err) {
          console.error(err)
          reject(null)
        }else{
          resolve(url)
        }
      })
    })
  }

  try {
    const qrUrl = await new Promise<string | null>((resolve, reject) => {
      const interval = setInterval(async () => {
        if (wa.qrcode) {
          clearInterval(interval)
          const url = await getQRCode()
          resolve(url)
        }
      }, 1000)

      setTimeout(() => {
        clearInterval(interval)
        reject(null)
      }, 30000)
    })

    if (qrUrl) {
      res.json({
        error: false,
        message: 'Silahkan scan QR Code untuk terhubung',
        url: qrUrl
      })
    } else {
      res.status(500).json({
        error: true,
        message: 'Terjadi kesalahan saat mendapatkan QR Code'
      })
    }

  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Maaf Terjadi kesalahan saat mendapatkan QR Code' })
  }
}
import { Request, Response } from 'express'
import QRCode from 'qrcode'

export const getQR = async (req: Request, res: Response) => {
  const id = req.params.id
  const wa = req.wa[id]

  try {
    await new Promise<void>((resolve, reject) => {
      const interval = setInterval(() => {
        if (wa.socketReady) {
          console.log('socket ready: ', wa.socketReady)
          clearInterval(interval)
          resolve()
        }
      }, 1000)
    
      setTimeout(() => {
        clearInterval(interval)
        reject(new Error('Timeout waiting for socket to be ready'))
      }, 30000)
    })

    const status = wa?.getStatus()

    if(status?.isConnected) {
      res.status(400).json({ 
        error: true,
        status
      })
      return
    }
    
    QRCode.toDataURL(wa!.qrcode, (err: Error | null | undefined, url: string) => {
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

  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Maaf Terjadi kesalahan saat mendapatkan QR Code' })
  }
}
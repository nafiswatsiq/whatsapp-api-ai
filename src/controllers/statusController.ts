import { Request, Response } from 'express'

export const getStatus = async (req: Request, res: Response) => {
  const id = req.params.id
  const wa = req.wa[id]

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
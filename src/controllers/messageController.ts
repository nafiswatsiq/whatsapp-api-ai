import { delay } from '@whiskeysockets/baileys'
import { Request, Response } from 'express'
import { body, validationResult } from 'express-validator'

export const sendTextMessage = async (req: Request, res: Response) => {
  const id = req.params.id
  const wa = req.wa[id]

  await body('phoneNumber')
    .notEmpty().withMessage('Nomor telepon tidak boleh kosong')
    .matches(/^[0-9]+$/, 'g').withMessage('Nomor telepon hanya boleh berisi angka')
    .isLength({ min: 10, max: 15 }).withMessage('Nomor telepon harus berisi 10-15 karakter')
    .trim()
    .run(req)

  await body('message')
    .isObject()
    .withMessage('Pesan harus berupa object')
    .run(req)

  await body('message.text')
    .notEmpty().withMessage('Pesan tidak boleh kosong')
    .run(req)

  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      error: true, 
      message: errors.array() 
    })
  }

  const phoneNumber = req.body.phoneNumber
  const message = req.body.message

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

  if (!status?.isConnected) {
    return res.status(400).json({ 
      error: true,
      message: 'Koneksi ke WhatsApp belum terhubung'
    })
  }

  try {
    wa!.sendTextMessage(phoneNumber, message)
  
    return res.status(200).json({ 
        error: false, 
        message: 'Pesan berhasil dikirim'
      })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Maaf Terjadi kesalahan saat mengirim pesan' })
  }
}
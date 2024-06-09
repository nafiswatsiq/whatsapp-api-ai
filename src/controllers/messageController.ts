import { Request, Response } from 'express'
import { body, validationResult } from 'express-validator'

export const sendTextMessage = async (req: Request, res: Response) => {
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
      status: 'failed',
      message: errors.array() 
    })
  }

  const phoneNumber = req.body.phoneNumber
  const message = req.body.message

  req.wa!.sendTextMessage(phoneNumber, message)

  return res.status(200).json({ 
      error: false, 
      status: 'success',
    })
}
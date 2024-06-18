import makeWASocket, { useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion, Browsers, delay, AuthenticationState, AnyMessageContent, downloadMediaMessage } from "@whiskeysockets/baileys";
import { Boom } from "@hapi/boom"
import path from 'path';
import * as fs from 'fs'
import { FormatToPhoneNumber, FormatToWhatsappJid } from "../utils/formatter";
import { dbConnect } from "../config/connection";
import logger from "../utils/logger"
import { messageService } from "../services/messageService";

const AUTH_FILE_LOCATION = '../../data/session'

export let qrcode: string = ""
export let sock: any
let phoneNumber: string = ""
let state: AuthenticationState | null = null
let saveCreds: any
let needRestartSocket: boolean = false

export async function Initialize() {
  sock = await createNewSocket()
  await dbConnect(process.env.MONGODB_URL)
}

async function createNewSocket() {
  const { version, isLatest } = await fetchLatestBaileysVersion()
  console.log(`using WA v${version.join('.')}, isLatest: ${isLatest}`)
  
  const { state: newState, saveCreds: newSaveCreds } = await useMultiFileAuthState(path.join(__dirname, `${AUTH_FILE_LOCATION}`))
  state = newState
  saveCreds = newSaveCreds

  var socket = makeWASocket({
    version,
    auth: state,
    printQRInTerminal: true,
    browser: Browsers.macOS('Desktop'),
    getMessage: async (key) => {
      return { conversation: { jid: key } } as any
    },
  })

  socket.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect, qr, isNewLogin } = update
    
    logger.info('connection update', connection, lastDisconnect, qr, isNewLogin)
    if (qr !== undefined) {
      qrcode = qr as string
    }
  
    if (connection === 'close') {
      const shouldReconnect = (lastDisconnect?.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut
      logger.info('connection closed due to ', lastDisconnect?.error, ', reconnecting ', shouldReconnect)
    
      if (shouldReconnect) {
        sock = await createNewSocket()
      } else {
        fs.rmSync(path.join(__dirname, `${AUTH_FILE_LOCATION}`), { force: true, recursive: true })
        needRestartSocket = true
        logger.info('connection closed due to ', lastDisconnect?.error, ', reconnecting ', shouldReconnect)
      }
    } else if (connection === 'open') {
      logger.info('opened connection')
      phoneNumber = FormatToPhoneNumber(state?.creds?.me?.id as string | null | undefined)
      qrcode = ""
    }
  })
  
  socket.ev.on('creds.update', saveCreds)

  socket.ev.on('messages.upsert', async (m) => {
    const message = m.messages[0]
    await messageService(message, phoneNumber)
  })

  socket.ev.on('groups.upsert', async (g) => {
    logger.info('got groups', g)
  })
  
  return socket
}

export async function sendTextMessage(phoneNumber: string | null | undefined, message: AnyMessageContent) {
  logger.info('send message to', phoneNumber, message)

  const jid = FormatToWhatsappJid(phoneNumber)

  await sock.presenceSubscribe(jid)
  await delay(500)
  await sock.sendPresenceUpdate('composing', jid)
  await delay(2000)
  await sock.sendPresenceUpdate('available', jid)
  await delay(100)
  await sock.sendMessage(jid, message)
}
export function getStatus() {
  if(needRestartSocket) {
    return {
      isConnected: false,
      phoneNumber: "",
      qrcode: "",
      needRestart: true
    }
  }
  if(qrcode === "") {
    return {
      isConnected: true,
      phoneNumber: phoneNumber,
      qrcode: "",
      needRestart: false
    }
  }
  return {
    isConnected: false,
    phoneNumber: "",
    qrcode: qrcode,
    needRestart: false
  }
}
import makeWASocket, { useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion, Browsers, delay, AuthenticationState, AnyMessageContent, downloadMediaMessage } from "@whiskeysockets/baileys";
import { Boom } from "@hapi/boom"
import path from 'path';
import * as fs from 'fs'
import { FormatStandardPhoneNumber, FormatToPhoneNumber, FormatToWhatsappJid } from "../utils/formatter";
import { dbConnect } from "../config/connection";
import { messageModel } from "../models/messageModel";
import logger from "../utils/logger"
import { messageService } from "../services/messageService";

const AUTH_FILE_LOCATION = '../../data/session'

export class whatsappSocket {
  qrcode: string = ""
  phoneNumber: string = ""
  sock: any
  state: AuthenticationState | null = null
  saveCreds: any
  needRestartSocket: boolean = false

  constructor() {
    // this.init()
  }

  async Initialize() {
    this.sock = await this.createNewSocket()
    await dbConnect(process.env.MONGODB_URL)
  }

  async createNewSocket() {
    const { version, isLatest } = await fetchLatestBaileysVersion()
    console.log(`using WA v${version.join('.')}, isLatest: ${isLatest}`)
    
    const { state, saveCreds } = await useMultiFileAuthState(path.join(__dirname, `${AUTH_FILE_LOCATION}`))
    this.state = state
    this.saveCreds = saveCreds

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
  
      console.log('connection update', connection, lastDisconnect, qr, isNewLogin)
      if (qr !== undefined) {
        this.qrcode = qr as string
      }

      if (connection === 'close') {
        const shouldReconnect = (lastDisconnect?.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut
        console.log('connection closed due to ', lastDisconnect?.error, ', reconnecting ', shouldReconnect)
  
        if (shouldReconnect) {
          this.sock = await this.createNewSocket()
        } else {
          fs.rmSync(path.join(__dirname, `${AUTH_FILE_LOCATION}`), { force: true, recursive: true })
          this.needRestartSocket = true
          console.log('connection closed due to ', lastDisconnect?.error, ', reconnecting ', shouldReconnect)
        }
      } else if (connection === 'open') {
        console.log('opened connection')
        this.phoneNumber = FormatToPhoneNumber(this.state?.creds?.me?.id as string | null | undefined)
        this.qrcode = ""
      }
    })
  
    socket.ev.on('creds.update', saveCreds)

    socket.ev.on('messages.upsert', async (m) => {
      const message = m.messages[0]
      await messageService(message, this.phoneNumber)
    })

    socket.ev.on('groups.upsert', async (g) => {
      console.log('got groups', g)
    })
    
    return socket
  }

  async sendTextMessage(phoneNumber: string | null | undefined, message: AnyMessageContent) {
    console.log('send message to', phoneNumber, message)

    const jid = FormatToWhatsappJid(phoneNumber)

    await this.sock.presenceSubscribe(jid)
    await delay(500)
    await this.sock.sendPresenceUpdate('composing', jid)
    await delay(2000)
    await this.sock.sendPresenceUpdate('available', jid)
    await delay(100)
    await this.sock.sendMessage(jid, message)
  }

  getStatus() {
    if(this.needRestartSocket) {
      return {
        isConnected: false,
        phoneNumber: "",
        qrcode: "",
        needRestart: true
      }
    }
    if(this.qrcode === "") {
      return {
        isConnected: true,
        phoneNumber: this.phoneNumber,
        qrcode: "",
        needRestart: false
      }
    }
    return {
      isConnected: false,
      phoneNumber: "",
      qrcode: this.qrcode,
      needRestart: false
    }
  }
}
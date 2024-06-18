
# Whatsapp Simple Api with AI integration

This project is a Whatsapp API with AI Google (Gemini) integration. It is built on top of the [whiskeysockets/baileys](https://github.com/WhiskeySockets/Baileys) project, which provides the underlying functionality for interacting with the Whatsapp API.

The API allows you to perform various actions, such as answering questions with AI, getting a QR image for authentication, checking the connection status, and sending text messages to specific phone numbers.

Based on [whiskeysockets/baileys](https://github.com/WhiskeySockets/Baileys) project.

## Installation

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run dev
```
    
## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`PORT`
`NODE_ENV`
`MONGODB_URL`
`GOOGLE_API_KEY`
`PROMPT_KEY`


## API Reference

#### Get QR image

```http
  GET /qr
```

#### Check Status Connected

```http
  GET /status
```

#### Send Text Message

```http
  POST /message
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `phoneNumber`      | `string` | **Required** |
| `message`      | `Object` | **Required** |

```javascript
{
  "phoneNumber" : "phone target",
  "message" : {
      "text": "Hello There!"
  }
}
```

## Using AI
To use Google's AI, first set the `GOOGLE_API_KEY` and `PROMPT_KEY` on *.env*, then send a message containing the Prompt Key that has been set

## Tech Stack

<img src="https://img.shields.io/badge/Node%20js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white"/> <img src="https://img.shields.io/badge/Express%20js-000000?style=for-the-badge&logo=express&logoColor=white"/> <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white"/>



# Whatsapp Api

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


## API Reference

#### Get QR image

```http
  GET /qr
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



## Tech Stack

<img src="https://img.shields.io/badge/Node%20js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white"/> <img src="https://img.shields.io/badge/Express%20js-000000?style=for-the-badge&logo=express&logoColor=white"/> <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white"/>


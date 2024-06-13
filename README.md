
# Whatsapp Simple Api

The Whatsapp API multi account allows users to manage multiple Whatsapp accounts
using a single application. This feature is useful for individuals or businesses
who need to handle multiple Whatsapp accounts simultaneously.

Usage:
- To use the Whatsapp API multi account, follow the instructions provided in this file.
- Make sure to configure the necessary settings and provide the required credentials.
- Once set up, you can start using the multi account feature to manage multiple Whatsapp accounts.

Note:
- This feature may have limitations or restrictions depending on the Whatsapp provider.
- Refer to the official documentation for more details and updates regarding the Whatsapp API multi account.

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
  GET /qr/{id}
```

#### Send Text Message

```http
  POST /message/{id}
```

#### Check Status Connected

```http
  GET /status/{id}
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


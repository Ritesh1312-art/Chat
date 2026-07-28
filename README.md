# 🌌 VIBEROOM

```
 _    _ _ _          ______                      
| |  | (_) |         | ___ \                     
| |  | |_| |__   ___ | |_/ /___  ___  _ __ ___   
| |/\| | | '_ \ / _ \|    // _ \/ _ \| '_ ` _ \  
\  /\  / | |_) |  __/| |\ \ (_) | (_) | | | | | |
 \/  \/|_|_.__/ \___\_| \_\___/ \___/|_| |_| |_|
```

## 📝 Description
VibeRoom is a real-time, random 1-on-1 video chatting Progressive Web App (PWA) with built-in moderation, real-time translation, and a sleek dark-themed glassmorphic UI.

## ✨ Features
- 🎥 **Real-time Video Chat**: Peer-to-peer WebRTC connections.
- 💬 **Live Messaging**: Socket.io powered instant text chat.
- 🌐 **Real-time Translation**: Automatic translation of chat messages.
- 📱 **PWA Ready**: Installable on desktop and mobile.
- 🛡️ **AI Moderation**: NSFW image detection and promo link filtering.
- 🌙 **Dark Mode UI**: Beautiful glassmorphic design.
- 🔒 **Secure Auth**: Firebase Phone OTP authentication.
- 💎 **Premium Features**: Razorpay integration for Vibe VIP.

## 🛠️ Tech Stack
| Tier | Technology |
|---|---|
| Frontend | Next.js 16, Tailwind CSS v4, simple-peer |
| Backend | Node.js (v22), Express.js, Socket.io |
| Database | MongoDB (Mongoose), Redis (ioredis) |
| Auth | Firebase Authentication |
| ML/AI | nsfwjs |
| Payments | Razorpay |

## 🏗️ Architecture

```
[ Client (Browser/PWA) ]
      |         |
 (WebRTC)    (Socket.io / HTTP)
      |         |
[ Peer 2 ]   [ Node.js Server ]
                |---------|
            [MongoDB]  [Redis]
```

## 🚀 Getting Started

### Prerequisites
- Node.js v22.2+
- MongoDB instance
- Redis server
- Firebase project
- Razorpay account

### Installation
1. Clone the repo
2. Run `npm install`
3. Setup environment variables in `.env`
4. Run `npm run dev`

## 📁 Project Structure
```
viberoom/
├── apps/
│   ├── web/ (Next.js Frontend)
│   └── server/ (Node.js/Express Backend)
├── packages/
│   └── types/ (Shared TypeScript interfaces)
├── nginx/ (Web server configs)
└── README.md
```

## ☁️ Free Hosting Stack
- **Oracle Cloud ARM**: Free VPS for hosting the Node backend & Nginx.
- **Vercel**: Free hosting for the Next.js frontend.
- **MongoDB Atlas**: Free tier NoSQL database.
- **Upstash/RedisLabs**: Free managed Redis.

## 🤝 Contributing
Pull requests are welcome!

## 📄 License
MIT License

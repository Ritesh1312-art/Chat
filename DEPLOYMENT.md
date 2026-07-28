# VibeRoom Deployment Guide

This guide covers the full deployment of the VibeRoom application (Next.js frontend + Express/Socket.io backend) utilizing free-tier services and an Oracle Cloud ARM VM.

## 1. MongoDB Atlas (Database)
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and sign up.
2. Create a new cluster (M0 Free Tier).
3. Select AWS or Google Cloud and the nearest region (e.g., Mumbai).
4. Under Database Access, create a user (save the password).
5. Under Network Access, add `0.0.0.0/0` to allow connections from anywhere.
6. Click "Connect" -> "Connect your application" and copy the connection string.
7. Replace `<password>` with your actual password. This is your `MONGODB_URI`.

## 2. Upstash Redis (Caching & Socket Adapter)
1. Sign up at [Upstash](https://upstash.com/).
2. Create a new Redis database. Choose the free tier and nearest region.
3. Once created, scroll down to the "Node" connection section.
4. Copy the `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` or the direct Redis URL. This is your `REDIS_URL`.

## 3. Firebase Auth (Phone OTP)
1. Go to [Firebase Console](https://console.firebase.google.com/).
2. Create a new project: "VibeRoom".
3. Go to Build > Authentication > Sign-in method.
4. Enable "Phone".
5. Optional: Add test phone numbers to bypass actual OTP during testing.
6. Go to Project Settings > General > Your Apps. Add a Web App.
7. Copy the `firebaseConfig` object. These will be your Next.js `NEXT_PUBLIC_FIREBASE_*` variables.
8. Go to Project Settings > Service Accounts. Generate a new private key. This JSON file contains variables for your Node.js backend.

## 4. Razorpay (Payments)
1. Sign up at [Razorpay](https://razorpay.com/).
2. Go to Settings > API Keys in "Test Mode".
3. Generate a new key pair.
4. Save the `Key ID` (`NEXT_PUBLIC_RAZORPAY_KEY_ID`) and `Key Secret` (`RAZORPAY_KEY_SECRET`).

## 5. Cloudinary (Image Uploads)
1. Sign up at [Cloudinary](https://cloudinary.com/).
2. On your Dashboard, copy your Cloud Name, API Key, and API Secret.
3. These are your `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET`.

## 6. Metered.ca (TURN Server for WebRTC)
1. Sign up at [Metered.ca](https://www.metered.ca/stun-turn).
2. Create an app (Free tier allows 50GB/month).
3. Copy the TURN server credentials (URL, username, credential).
4. Pass these into the frontend environment variables to initialize the simple-peer WebRTC connections.

---

## 7. Oracle Cloud Always Free ARM VM Provisioning

Oracle provides an Always Free ARM VM (Ampere A1) with up to 4 cores and 24GB RAM.

### Step 7.1: Provision the VM
1. Sign up for Oracle Cloud (requires a credit card for verification, but free tier is completely free).
2. Go to Instances > Create Instance.
3. Name it "viberoom-server".
4. Image: Ubuntu 22.04.
5. Shape: Ampere (VM.Standard.A1.Flex). Select 2-4 OCPUs and 12-24 GB RAM.
6. Download the SSH key pair (`.key` and `.pub`). **Crucial!**
7. Click "Create". Wait for it to provision and note the Public IP.

### Step 7.2: Open Ports in Oracle Cloud Console
1. Go to your Instance > click on the Subnet link.
2. Click on the Default Security List.
3. Add Ingress Rules for:
   - Source: `0.0.0.0/0`, TCP, Port `80` (HTTP)
   - Source: `0.0.0.0/0`, TCP, Port `443` (HTTPS)
   - Source: `0.0.0.0/0`, TCP, Port `4000` (Backend API/Sockets)

### Step 7.3: Connect and Setup VM
SSH into the machine:
```bash
ssh -i path/to/your/key.key ubuntu@<YOUR_PUBLIC_IP>
```

Open iptables on Ubuntu (Oracle image default firewall):
```bash
sudo iptables -I INPUT -p tcp -m tcp --dport 80 -j ACCEPT
sudo iptables -I INPUT -p tcp -m tcp --dport 443 -j ACCEPT
sudo iptables -I INPUT -p tcp -m tcp --dport 4000 -j ACCEPT
sudo netfilter-persistent save
```

Install Node.js 22.x:
```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs
node -v # Should be 22.x
```

Install PM2 and Nginx:
```bash
sudo npm install -g pm2
sudo apt update
sudo apt install -y nginx certbot python3-certbot-nginx
```

### Step 7.4: Deploy Backend
1. Clone the repository on the VM (or SCP the files).
2. `cd viberoom/apps/api`
3. `npm install`
4. Create a `.env` file with all backend secrets.
5. `npm run build`
6. `pm2 start dist/index.js --name "viberoom-api"`
7. `pm2 save`
8. `pm2 startup`

### Step 7.5: Configure Nginx & SSL
Create Nginx config: `sudo nano /etc/nginx/sites-available/viberoom`
```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```
Enable and reload:
```bash
sudo ln -s /etc/nginx/sites-available/viberoom /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```
Get SSL Certificate:
```bash
sudo certbot --nginx -d api.yourdomain.com
```

---

## 8. Vercel Deployment (Next.js Frontend)
1. Push your code to a GitHub repository.
2. Log into [Vercel](https://vercel.com).
3. Import the project.
4. Set the Root Directory to `apps/web`.
5. Add all frontend environment variables (see below).
6. Click Deploy.

## 9. Environment Variables Summary

**Backend (`apps/api/.env`)**:
```env
PORT=4000
NODE_ENV=production
FRONTEND_URL=https://your-vercel-app.vercel.app
MONGODB_URI=mongodb+srv://...
REDIS_URL=redis://...
FIREBASE_PROJECT_ID=...
FIREBASE_CLIENT_EMAIL=...
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
RAZORPAY_KEY_ID=...
RAZORPAY_KEY_SECRET=...
```

**Frontend (`apps/web/.env.local` or Vercel Settings)**:
```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api
NEXT_PUBLIC_SOCKET_URL=https://api.yourdomain.com
NEXT_PUBLIC_RAZORPAY_KEY_ID=...
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
GOOGLE_TRANSLATE_API_KEY=...
USE_TRANSLATE_MOCK=false
```

## 10. Final Checklist
- [ ] Database accepts connections and collections are created.
- [ ] Firebase SMS limits are checked (free tier has limits on SMS auth).
- [ ] PWA Icons are loaded correctly.
- [ ] Razorpay webhook endpoints are secure and tested.
- [ ] Nginx is properly forwarding WebSocket requests (`Upgrade` header).
- [ ] SSL certificates auto-renew via certbot timer.

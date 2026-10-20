We solve financial confusion by giving users an AI mentor (Maarg) that provides personalized money advice, tracks learning, and makes finance fun with XP, quizzes, and charts — all in one app.
ArthaMind is a Fullstack web app designed to help user manage money intelligently with the help of its own AI chatbot,"Maarg".
It also educates user about finance in a fun way.

## Deployment

This project deploys as one Node/Express service that serves the Vite client and
the API from the same process.

Build command:

```bash
npm ci && npm run build
```

Start command:

```bash
npm start
```

The server uses the hosting provider's `PORT` value and listens on `0.0.0.0`.
The repository includes a GitHub Actions workflow for deploying to a Linux VPS.
It syncs the source over SSH, builds on the VPS, and restarts the systemd
service. It does not use Render or deploy the app as a static site.

### VPS setup

Install Node.js 20+, `rsync`, and the project dependencies on the VPS. Create a
dedicated `arthamind` user, then clone or create the deployment directory:

```bash
sudo useradd --system --create-home --shell /usr/sbin/nologin arthamind
sudo mkdir -p /opt/arthamind
sudo chown -R arthamind:arthamind /opt/arthamind
```

Copy [`ops/arthamind.service`](./ops/arthamind.service) to
`/etc/systemd/system/arthamind.service`, adjust paths if needed, and run:

```bash
sudo systemctl daemon-reload
sudo systemctl enable arthamind
```

Create `/opt/arthamind/.env.production` on the VPS with the variables below.
Keep this file outside Git; the workflow intentionally excludes it.

Add these GitHub Actions secrets (the `production` environment is recommended):

```text
SSH_HOST
SSH_USER
SSH_PRIVATE_KEY
DEPLOY_PATH=/opt/arthamind
```

The SSH user must be able to write `DEPLOY_PATH` and run
`sudo systemctl restart arthamind` without an interactive password. Restrict
that sudo permission to the service restart command.

Set these environment variables in `/opt/arthamind/.env.production` on the VPS:

```text
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID
VITE_FIREBASE_MEASUREMENT_ID
VITE_GEMINI_API_KEY       # optional; enables live Maarg responses
```

Firebase Authentication providers and Firestore must also be enabled in the
Firebase console. The production build outputs the client to `dist/client` and
the server bundle to `dist/server/index.js`.

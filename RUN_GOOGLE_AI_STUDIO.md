**Run & Deploy Notes — Google AI Studio / Container**

This file explains minimal steps to run the project locally and a recommended container approach that can be used to run the app in Google AI Studio or Google Cloud Run.

1) Local (development)
- Install dependencies: `npm install`
- Copy env: `cp .env.example .env` and set `NEXT_PUBLIC_WHATSAPP` if you want the header link to work.
- Run dev server: `npm run dev` (open http://localhost:3000).

2) Production (build + start)
- Build: `npm run build`
- Start: `npm run start` (runs the Next production server on port 3000 by default).

3) Container (Docker) — recommended for Google AI Studio or Cloud Run
- Dockerfile (example):

  ```dockerfile
  FROM node:20-alpine AS builder
  WORKDIR /app
  COPY package*.json .
  RUN npm ci --production=false
  COPY . .
  RUN npm run build

  FROM node:20-alpine AS runner
  WORKDIR /app
  ENV NODE_ENV=production
  COPY --from=builder /app/package*.json ./
  COPY --from=builder /app/.next ./.next
  COPY --from=builder /app/public ./public
  COPY --from=builder /app/node_modules ./node_modules
  COPY --from=builder /app/.env ./.env
  EXPOSE 8080
  CMD ["node", "server.js"]
  ```

  Note: `server.js` can be a tiny Express wrapper that imports and runs Next. If you prefer static export, you can use `next export` for purely static hosting (images and dynamic routes may need adaptation).

4) Google AI Studio
- AI Studio notebooks can run containerized services or shell commands; prefer building a container and deploying it with Cloud Run, then connect the URL to your AI Studio pipeline or use the container directly where supported.

5) Helpful tips
- Ensure `next.config.ts` image settings suit your target environment; `unoptimized: true` simplifies hosting but may impact performance.
- Use `next/image` `priority` for hero LCP images as implemented in `components/hero-section.tsx`.

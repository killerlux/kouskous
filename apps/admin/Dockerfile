FROM node:20-alpine AS deps

WORKDIR /workspace/apps/admin

COPY apps/admin/package*.json ./

RUN npm install

COPY apps/admin/ .

RUN npm run build

FROM node:20-alpine

WORKDIR /app

ENV NODE_ENV=production

COPY --from=deps /workspace/apps/admin/package*.json ./
RUN npm install --omit=dev

COPY --from=deps /workspace/apps/admin/.next ./.next
COPY --from=deps /workspace/apps/admin/public ./public
COPY --from=deps /workspace/apps/admin/next.config.js ./next.config.js

EXPOSE 3000

CMD ["npm", "run", "start"]


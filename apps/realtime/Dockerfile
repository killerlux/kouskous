FROM node:20-alpine AS base

WORKDIR /workspace

COPY tsconfig.json ./tsconfig.json
COPY apps/realtime/package*.json apps/realtime/

WORKDIR /workspace/apps/realtime

RUN npm install

COPY apps/realtime/ .

RUN npm run build

FROM node:20-alpine

WORKDIR /app

ENV NODE_ENV=production

COPY --from=base /workspace/apps/realtime/package*.json ./
RUN npm install --omit=dev

COPY --from=base /workspace/apps/realtime/dist/apps/realtime/src ./dist

EXPOSE 4001

CMD ["node", "dist/main"]


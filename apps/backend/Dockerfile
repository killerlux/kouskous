FROM node:20-alpine AS base

WORKDIR /workspace

# Copy files needed for build context (tsconfig lives at repo root)
COPY tsconfig.json ./tsconfig.json
COPY apps/backend/package*.json apps/backend/

WORKDIR /workspace/apps/backend

RUN npm install

COPY apps/backend/ .

RUN npm run build

FROM node:20-alpine

WORKDIR /app

ENV NODE_ENV=production

COPY --from=base /workspace/apps/backend/package*.json ./
RUN npm install --omit=dev

COPY --from=base /workspace/apps/backend/dist/apps/backend/src ./dist

EXPOSE 4000

CMD ["node", "dist/main"]


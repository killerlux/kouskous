FROM node:20-alpine AS builder

ENV PNPM_HOME="/root/.local/share/pnpm"
ENV PATH="${PNPM_HOME}:${PATH}"

WORKDIR /workspace

RUN corepack enable

# Copy only the files needed to install dependencies (better cache utilisation)
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/admin/package.json apps/admin/package.json
COPY packages/shared/package.json packages/shared/package.json

RUN pnpm install --filter @taxi/admin... --frozen-lockfile

# Bring in the rest of the workspace (source, configs, public assets…)
COPY . .

# Ensure the public folder exists even if empty (Next.js expects it at runtime)
RUN mkdir -p apps/admin/public

# Build the Admin app (outputs to apps/admin/.next)
RUN pnpm --filter @taxi/admin build

# Produce a pruned node_modules for the admin app only
RUN pnpm deploy --filter @taxi/admin --prod /opt/app

FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Copy runtime dependencies prepared via pnpm deploy
COPY --from=builder /opt/app/ ./

# Copy the built Next.js assets
COPY --from=builder /workspace/apps/admin/.next ./.next
COPY --from=builder /workspace/apps/admin/public ./public
COPY --from=builder /workspace/apps/admin/next.config.js ./next.config.js

EXPOSE 3000

CMD ["node", "node_modules/.bin/next", "start", "-p", "3000"]


FROM node:20-slim AS base

# PNPM
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

# REQUIRED GLOBAL RUNTIMES
RUN npm i -g corepack@latest
RUN npm install -g bun

# REQUIRED FOR PNPM
RUN corepack enable

WORKDIR /app

# COPY FILES
COPY . .

# INSTALL DEPENDENCIES
RUN pnpm install

EXPOSE 4000

CMD ["pnpm", "dev"]
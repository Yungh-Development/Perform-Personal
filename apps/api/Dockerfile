FROM node:20-slim

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
COPY ./package.json /app/package.json

# INSTALL DEPENDENCIES
RUN pnpm install -f

# COPY FILES
COPY . .

EXPOSE 3000

CMD ["pnpm", "dev"]
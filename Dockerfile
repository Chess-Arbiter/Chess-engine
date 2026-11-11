# The Lichess bot (lichess/bot.ts), bundled into one file and run on plain Node.

FROM node:26-slim AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts
COPY tsconfig*.json ./
COPY src ./src
COPY lichess ./lichess
RUN npm run build

FROM node:26-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/dist-bot/bot.mjs ./
USER node
CMD ["node", "bot.mjs"]

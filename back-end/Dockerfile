FROM node:22-alpine AS deps

WORKDIR /app
RUN apk add --no-cache openssl

COPY package*.json ./
RUN npm ci

FROM deps AS build

COPY prisma ./prisma
RUN npm run prisma:generate

COPY nest-cli.json tsconfig*.json eslint.config.mjs ./
COPY src ./src
RUN npm run build
RUN npm prune --omit=dev

FROM node:22-alpine AS runtime

WORKDIR /app
ENV NODE_ENV=production

RUN apk add --no-cache openssl \
  && addgroup -S rentcity \
  && adduser -S rentcity -G rentcity

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma
COPY package*.json ./

USER rentcity
EXPOSE 4000

CMD ["node", "dist/main.js"]

FROM node:16-alpine
RUN apk add g++ make cmake python3 --no-cache

ENV NODE_ENV=production

WORKDIR /pma

COPY --chown=node:node ./api /pma

RUN npm install --production

RUN chown -R node:node /pma

USER node
EXPOSE 3000
CMD ["node", "server"]
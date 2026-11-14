FROM node:22-alpine
WORKDIR /app
COPY server.js index.html styles.css script.js package.json ./
COPY content ./content
COPY assets ./assets
RUN mkdir -p data && chown node:node data
USER node
ENV PORT=3000
EXPOSE 3000
VOLUME ["/app/data"]
CMD ["node","server.js"]

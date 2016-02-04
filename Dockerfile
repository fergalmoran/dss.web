FROM node
ENV NODE_ENV production

RUN mkdir /app
WORKDIR /app/dist/

ADD dist /app/dist/
ADD node_modules /app/node_modules/

ENV NODE_ENV production
CMD ["npm", "start"]

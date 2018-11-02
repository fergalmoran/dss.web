FROM fergalmoran/node

ENV NODE_ENV production

WORKDIR /app/dist/
ADD dist /app/dist/

RUN npm install

ENV NODE_ENV production
CMD ["npm", "start"]

#FROM digitallyseamless/nodejs-bower-grunt-runtime

FROM node

ENV NODE_ENV production

WORKDIR /app/dist/
ADD dist /app/dist/
ENV NODE_ENV production
CMD ["npm", "start"]

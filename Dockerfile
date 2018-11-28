FROM node:10

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json .
# For npm@5 or later, copy package-lock.json as well
# COPY package.json package-lock.json ./

RUN npm install -g yarn

RUN npm install
# If you are building your code for production
# RUN npm install --only=production

# Bundle app source
COPY . .

ADD . /usr/src/app/

EXPOSE 3000
CMD [ "yarn", "build" ]
CMD [ "yarn", "start" ]
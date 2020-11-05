# Development
FROM node:12
RUN npm install -g react-scripts
RUN npm install -g nodemon
WORKDIR /server
COPY package*.json ./
RUN npm install
COPY . ./
EXPOSE 80
CMD ["npm", "run", "dev"]

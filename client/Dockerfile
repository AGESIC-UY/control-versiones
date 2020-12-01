# Development
FROM node:12
RUN npm install -g react-scripts
RUN npm install node-sass
RUN npm install @material-ui/core
WORKDIR /client
COPY package*.json ./
RUN npm install
COPY . ./
EXPOSE 3002
EXPOSE 35729
CMD ["npm", "start"]

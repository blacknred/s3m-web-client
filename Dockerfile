FROM node:alpine

# set working directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY . ./

# add `/usr/src/app/node_modules/.bin` to $PATH
ENV PATH /usr/src/app/node_modules/.bin:$PATH

# install and cache app dependencies
ADD package.json /usr/src/app/package.json

# dependencies
RUN yarn install
RUN yarn global add react-scripts@1.1.5

EXPOSE 3000

# start app
CMD ["yarn", "start"]

# docker build -t s3m-web-client .
# docker run -it -v ~+:/usr/src/app -p 3000:3000 s3m-web-client


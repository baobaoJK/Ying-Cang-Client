# 构建阶段
FROM node:22-alpine as build-stage
LABEL authors="KSaMar"

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# 生产阶段
FROM nginx:alpine as production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 20520
CMD ["nginx", "-g", "daemon off;"]
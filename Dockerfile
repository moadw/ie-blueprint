FROM node:24-alpine AS development-dependencies-env
COPY . /app
WORKDIR /app
RUN npm ci

FROM node:24-alpine AS production-dependencies-env
COPY ./package.json package-lock.json /app/
WORKDIR /app
RUN npm ci --omit=dev

FROM node:24-alpine AS build-env
ARG VITE_GRAPHQL_URL
ARG VITE_REST_URL
ARG VITE_PLATFORM
ARG VITE_AMPLITUDE_API_KEY
ARG VITE_APP_URL
ARG VITE_CLEVER_CLIENT_ID
ARG VITE_CLASSLINK_CLIENT_ID
ARG VITE_FIREBASE_API_KEY
ARG VITE_FIREBASE_AUTH_DOMAIN
ARG VITE_FIREBASE_PROJECT_ID
ARG VITE_FIREBASE_APP_ID
ENV VITE_GRAPHQL_URL=$VITE_GRAPHQL_URL \
    VITE_REST_URL=$VITE_REST_URL \
    VITE_PLATFORM=$VITE_PLATFORM \
    VITE_AMPLITUDE_API_KEY=$VITE_AMPLITUDE_API_KEY \
    VITE_APP_URL=$VITE_APP_URL \
    VITE_CLEVER_CLIENT_ID=$VITE_CLEVER_CLIENT_ID \
    VITE_CLASSLINK_CLIENT_ID=$VITE_CLASSLINK_CLIENT_ID \
    VITE_FIREBASE_API_KEY=$VITE_FIREBASE_API_KEY \
    VITE_FIREBASE_AUTH_DOMAIN=$VITE_FIREBASE_AUTH_DOMAIN \
    VITE_FIREBASE_PROJECT_ID=$VITE_FIREBASE_PROJECT_ID \
    VITE_FIREBASE_APP_ID=$VITE_FIREBASE_APP_ID
COPY . /app/
COPY --from=development-dependencies-env /app/node_modules /app/node_modules
WORKDIR /app
RUN npm run build

FROM node:24-alpine
COPY ./package.json package-lock.json /app/
COPY --from=production-dependencies-env /app/node_modules /app/node_modules
COPY --from=build-env /app/build /app/build
WORKDIR /app
CMD ["npm", "run", "start"]
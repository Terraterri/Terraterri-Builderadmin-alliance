FROM node:18-alpine AS builder
WORKDIR /app
COPY . .
RUN npm install

# Per-environment endpoints injected at build time via --build-arg.
# Defaults are the PROD URLs so the existing prod pipeline (which passes no
# build-args) is unaffected; the dev CI overrides them with the dev domains.
ARG VITE_USER_ENDPOINT=https://micro-api-one.terraterri.com
ARG VITE_SERVICES_ENDPOINT=https://micro-api-two.terraterri.com
ARG VITE_MASTERS_ENDPOINT=https://micro-api-three.terraterri.com
ARG VITE_WEBSITE_ENDPOINT=https://nodeapi.terraterri.com
ARG VITE_EXPOADMIN_ENDPOINT=https://expoadminapi.terraterri.com/
ARG VITE_EXPOAPI_ENDPOINT=https://expoadminapi.terraterri.com/tt-expo-builder-be/
ARG VITE_BASE_URL=https://builderalliance.terraterri.com/
ARG VITE_RAZOR_API_KEY
ENV VITE_USER_ENDPOINT=$VITE_USER_ENDPOINT
ENV VITE_SERVICES_ENDPOINT=$VITE_SERVICES_ENDPOINT
ENV VITE_MASTERS_ENDPOINT=$VITE_MASTERS_ENDPOINT
ENV VITE_WEBSITE_ENDPOINT=$VITE_WEBSITE_ENDPOINT
ENV VITE_EXPOADMIN_ENDPOINT=$VITE_EXPOADMIN_ENDPOINT
ENV VITE_EXPOAPI_ENDPOINT=$VITE_EXPOAPI_ENDPOINT
ENV VITE_BASE_URL=$VITE_BASE_URL
ENV VITE_RAZOR_API_KEY=$VITE_RAZOR_API_KEY

RUN npm run build


# Optional build-time assertion. When EXPECT_HOST is supplied the build fails
# unless that string appears in the compiled bundle. The dev pipeline passes
# EXPECT_HOST=dev. so a build that silently fell back to the PROD ARG defaults
# above can never reach the dev environment. Prod passes nothing, so this is a
# no-op there and the existing prod pipeline is completely unaffected.
ARG EXPECT_HOST=
RUN if [ -n "$EXPECT_HOST" ]; then       grep -rq "$EXPECT_HOST" dist/assets/         || (echo "ERROR: expected host '$EXPECT_HOST' missing from the built bundle" && exit 1);       echo "build guard OK: '$EXPECT_HOST' found in bundle";     fi

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/templates/default.conf.template
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
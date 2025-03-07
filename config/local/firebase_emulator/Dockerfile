FROM node:18.16.0-bullseye-slim AS deps
WORKDIR /app
RUN npm install --location=global firebase-tools@12.4.0
COPY config/local/firebase_emulator /app/
ENTRYPOINT ["firebase", "emulators:start", "--project", "demo-heures-supp-prod", "--only", "auth", "--import=exported-dev-data", "--export-on-exit=exported-dev-data"]

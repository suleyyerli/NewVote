FROM node:18-alpine

WORKDIR /app

# Installation des dépendances
COPY package*.json ./
RUN npm install

# Copie des fichiers sources
COPY . .

# Build de l'application
RUN npm run build

# Copie des fichiers nécessaires pour le standalone
RUN cp -r public .next/standalone/ && \
    cp -r .next/static .next/standalone/.next/

# Exposition du port
EXPOSE 3000

# Commande de démarrage pour standalone
CMD ["node", ".next/standalone/server.js"] 
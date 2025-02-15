FROM node:18-alpine

WORKDIR /app

# Installation des dépendances
COPY package*.json ./
RUN npm install

# Copie des fichiers sources
COPY . .

# Build de l'application
RUN npm run build

# Configuration pour le standalone
RUN cp -r .next/static .next/standalone/.next/ && \
    cp -r public .next/standalone/ && \
    cp -r .next/static .next/standalone/.next/static

# Définir le répertoire de travail pour le runtime
WORKDIR /app/.next/standalone

# Exposition du port
EXPOSE 3000

# Variable d'environnement pour le chemin des assets
ENV NODE_ENV=production

# Commande de démarrage pour standalone
CMD ["node", "server.js"] 
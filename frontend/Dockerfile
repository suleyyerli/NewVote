FROM node:18-alpine

WORKDIR /app

# Installation des dépendances
COPY package*.json ./
RUN npm install

# Copie des fichiers sources
COPY . .

# Build de l'application
RUN npm run build

# Exposition du port
EXPOSE 3000

# Commande de démarrage
CMD ["node", ".next/standalone/server.js"] 
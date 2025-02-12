# Deploy

```bash
sudo apt update

curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash

nvm install 20

adduser newvote

mkdir /srv/newvote

chown -R newvote:newvote /srv/newvote

chmod 755 /srv/newvote

apt install git nginx -y mysql-server -y

su - newvote

cd /srv/

git clone https://github.com/suleyyerli/NewVote.git newvote
## ZIP du projet + scp pour copier le projet + unzip sur le serveur

## Sur le serveur verifier l'emplacement des fichiers /srv/newvote

cd backend

npm install

cd ../frontend

npm install







```

## db

sure le serveur de developpment

```bash
mysqldump -u root -p social_network_db --no-data

```

Il faut copier le resultat du mysqldump

et coller dans le mysql serveur production

```sql
CREATE DATABASE IF NOT EXISTS social_network_db;

CREATE USER socialnetworkdb@localhost IDENTIFIED BY 'password';

GRANT ALL PRIVILEGES ON social_network_db.* TO socialnetworkdb@localhost ;

 FLUSH PRIVILEGES ;

INSERT INTO users (username, email, password, role)
VALUES (
    'suleytest',
    'suleytest@test.com',
    '$2b$10$yie',  -- Remplacer par un vrai hash bcrypt
    'admin'
);
```

```bash
npm install pm2 -g


```

Creer le fichier .env

```bash
nano /srv/newvote/backend/.env
```

```bash
## Lancer le serveur en background
/srv/newvote/backend$ pm2 start src/test.js

pm2 status
pm2 list
pm2 delete

```

```bash
##pour que le site demarre automatiquement au lanceùment du server

su - newvote
pm2 startup systemd
pm2 status
pm2 list
pm2 delete (id)
pm2 info (id)
pm2 logs (id)
pm2 restart (id)
pm2 stop (id)
pm2 start (id)
pm2 monit

```

# Configuration de la Base de Données

## Création de la Base de Données

```sql
CREATE DATABASE IF NOT EXISTS social_network_db;
USE social_network_db;
```

## Création des Tables

### Table Users

```sql
CREATE TABLE Users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') DEFAULT 'user',
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_username (username),
    INDEX idx_email (email)
);
```

### Table Posts

```sql
CREATE TABLE Posts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    content TEXT NOT NULL,
    userId INT NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE CASCADE,
    INDEX idx_userId (userId),
    INDEX idx_createdAt (createdAt)
);
```

### Table Comments

```sql
CREATE TABLE Comments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    content TEXT NOT NULL,
    userId INT NOT NULL,
    postId INT NOT NULL,
    likesCount INT DEFAULT 0,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE CASCADE,
    FOREIGN KEY (postId) REFERENCES Posts(id) ON DELETE CASCADE,
    INDEX idx_userId (userId),
    INDEX idx_postId (postId),
    INDEX idx_likesCount (likesCount)
);
```

### Table CommentLikes

```sql
CREATE TABLE CommentLikes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    userId INT NOT NULL,
    commentId INT NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE CASCADE,
    FOREIGN KEY (commentId) REFERENCES Comments(id) ON DELETE CASCADE,
    UNIQUE KEY unique_like (userId, commentId),
    INDEX idx_userId (userId),
    INDEX idx_commentId (commentId)
);
```

## Création d'un Administrateur (exemple)

```sql
-- Mot de passe : admin123 (à hasher avec bcrypt)
INSERT INTO Users (username, email, password, role)
VALUES (
    'admin',
    'admin@example.com',
    '$2b$10$YourHashedPasswordHere',  -- Remplacer par un vrai hash bcrypt
    'admin'
);
```

## Suppression de la Base de Données (si nécessaire)

```sql
DROP DATABASE IF EXISTS social_network_db;
```

## Notes Importantes

1. Les mots de passe doivent être hashés avec bcrypt avant d'être insérés
2. Les clés étrangères sont configurées avec `ON DELETE CASCADE` pour maintenir l'intégrité des données
3. Des index ont été ajoutés pour optimiser les performances des requêtes fréquentes
4. Les champs `createdAt` et `updatedAt` sont automatiquement gérés

## Commandes Utiles

### Vérifier la Structure d'une Table

```sql
DESCRIBE Users;
DESCRIBE Posts;
DESCRIBE Comments;
DESCRIBE CommentLikes;
```

### Vérifier les Index

```sql
SHOW INDEX FROM Users;
SHOW INDEX FROM Posts;
SHOW INDEX FROM Comments;
SHOW INDEX FROM CommentLikes;
```

# General usage of Doctrine DBAL

Create or edit entity classes and corresponding repository classes
```bash
php bin/console make:entity
```
<br>

Create migration file containing SQL statements to update database structure
```bash
php bin/console make:migration
```
<br>

Update database structure with lastest migration
```bash
php bin/console doctrine:migration:migrate
```
---
For further information check the official [documentation](https://www.symfony.com/doc/current/doctrine.html) by Symfony.

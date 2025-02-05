# Syncora
an open-source web-organizer project

> [!WARNING]  
> This project is NOT in active development!

## System-Setup *(built for APT package manager)*
```bash
curl
```

## Environment-Setup
Start Syncora
```bash
ddev start
```
<br>

Install packages and dependencies
```bash
ddev composer install
```
<br>

Import database
```bash
ddev import-db -f extras/dump.sql.gz
```
<br>

Build assets
```bash
ddev build
```

## Dev-Tools

[Doctrine usage](/docs/doctrine.md)






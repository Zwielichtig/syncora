# Syncora
an open-source web-organizer project

> [!WARNING]  
> This project is NOT in active development!
<br>

## System-Setup *(built for APT package manager)*
> [!IMPORTANT]
> This script will give you the tools needed to set up a DDEV environment, if you already have a functioning DDEV system running you can skip this part
```bash
wget -O ~/systemInstall.sh https://raw.githubusercontent.com/Zwielichtig/syncora/refs/heads/master/extras/systemInstall.sh
```
```bash
chmod +x ~/systemInstall.sh
```
```bash
sudo ./systemInstall.sh
```

<br>

## Environment-Setup for local development
Start Syncora
```bash
ddev start
```
If any problems with the docker-provider arise, use:
```bash
sudo groupadd docker
sudo usermod -aG docker $USER
newgrp docker
```
<br>

Install Composer packages and dependencies
```bash
ddev composer install
```
<br>

Install Node packages and dependencies
```bash
ddev npm i
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

Start Watcher
```bash
ddev watch
```
<br>

Open phpMyAdmin
```bash
ddev phpmyadmin
```
<br>

Open Mailpit
```bash
ddev launch -m
```

___
- [Doctrine usage](/docs/doctrine.md)






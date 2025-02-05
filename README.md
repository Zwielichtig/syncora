# Syncora
an open-source web-organizer project

> [!WARNING]  
> This project is NOT in active development!

## System-Setup *(built for APT package manager)*
> [!IMPORTANT]
> This script will give you the tools needed to set up a DDEV environment, if you already got a functioning DDEV system running you can skip this part
```bash
wget -O ~/systemInstall.sh https://raw.githubusercontent.com/Zwielichtig/syncora/refs/heads/master/extras/systemInstall.sh
```
```bash
chmod +x ~/systemInstall.sh
```
```bash
sudo ./systemInstall.sh
```


## Environment-Setup for local development
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

Start Watcher
```bash
ddev watch
```
___
- [Doctrine usage](/docs/doctrine.md)






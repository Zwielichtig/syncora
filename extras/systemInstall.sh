#!/bin/bash

# By Zwielicht 2025

# Ensure script is run with the correct privileges
  if [ "$(id -u)" -ne 0 ]; then
  echo "This script must be run as root or with sudo."
  exit 1
  fi

# Function - install  package
install_package() {
  PACKAGE=$1
  if which "$PACKAGE" > /dev/null 2>&1; then
    echo "$PACKAGE is already installed."
  else
    echo "Installing Package..."
    sudo apt install -y "$PACKAGE"
  fi
}

# Function - install VSCode
install_vscode() { 
  echo "Installing Visual Studio Code..."
  if ! command -v code &> /dev/null; then
    sudo apt install -y wget gpg
    wget -qO- https://packages.microsoft.com/keys/microsoft.asc | sudo gpg --dearmor > /etc/apt/trusted.gpg.d/microsoft.gpg
    sudo add-apt-repository "deb [arch=amd64] https://packages.microsoft.com/repos/vscode stable main"
    sudo apt update
    sudo apt install -y code
  else
    echo "Visual Studio Code is already installed."
  fi
}

# Function - install Docker
install_docker() {
  echo "Installing Docker..."
  if ! command -v docker &> /dev/null; then
    # Uninstall old versions if any
    sudo apt remove -y docker docker-engine docker.io containerd runc

    # Set up official GPG key and repository
    sudo apt install -y apt-transport-https ca-certificates curl software-properties-common
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/trusted.gpg.d/docker.gpg
    sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"

    sudo apt update
    sudo apt install -y docker-ce docker-ce-cli containerd.io

    # Add current user to the docker group
    USERNAME=$(logname)
    sudo usermod -aG docker $USERNAME
    echo "Docker installation completed."
  else
    echo "Docker is already installed."
  fi
}

# Function - install Docker Compose
install_docker_compose() {
  echo "Installing Docker Compose..."
  if ! command -v docker-compose &> /dev/null; then
    sudo curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
  else
    echo "Docker Compose is already installed."
  fi
}

# Function - install DDEV
install_ddev() {
  echo "Installing DDEV..."
  if ! command -v ddev &> /dev/null; then
    # Add DDEV's GPG key to keyring
    sudo apt-get update && sudo apt-get install -y curl
    sudo install -m 0755 -d /etc/apt/keyrings
    curl -fsSL https://pkg.ddev.com/apt/gpg.key | gpg --dearmor | sudo tee /etc/apt/keyrings/ddev.gpg > /dev/null
    sudo chmod a+r /etc/apt/keyrings/ddev.gpg

    # Add DDEV releases to package repository
    echo "deb [signed-by=/etc/apt/keyrings/ddev.gpg] https://pkg.ddev.com/apt/ * *" | sudo tee /etc/apt/sources.list.d/ddev.list >/dev/null

    # Update package information and install DDEV
    sudo apt-get update && sudo apt-get install -y ddev

    # One-time initialization of mkcert
    mkcert -install
    echo "DDEV installation completed."
  else
    echo "DDEV is already installed."
  fi
}

# Function - install Git
install_git() {
  install_package "git"

  echo
  if validate_input "Would you like to set your Git identity?"; then
    while true; do
      read -p "Enter username for Git: " git_name
      if [[ -z "$git_name" ]]; then
        echo "Username can't be empty. Please try again."
        continue
      else
        break
      fi
    done

    while true; do
      read -p "Enter email address for Git: " git_mail
      
      # Trim whitespaces
      git_mail=$(echo "$git_mail" | xargs)

      # Check if email is empty
      if [[ -z "$git_mail" ]]; then
        echo "Email address can't be empty. Please try again."
        continue
      fi

      # Check if email is valid
      if [[ ! "$git_mail" =~ ^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$ ]]; then
        echo "Invalid email address. Please enter a valid email (e.g., user@example.com)."
        continue
      fi

      break
    done

    git config --global user.name "$git_name"
    git config --global user.email "$git_mail"
    echo "Git identity has been set."
  fi
}

# Function - configure SSH
configure_ssh() {
  USERNAME=$(logname)
  ssh_key_path="/home/$USERNAME/.ssh/syncora_id_rsa"

  # Check if directory and key already exist
  if [ -d "$(dirname "$ssh_key_path")" ]; then
    if [ -f "$ssh_key_path" ]; then
      if ! validate_input "The key "$ssh_key_path" already exists. Overwrite?"; then
        echo "Aborting key configuration."
        return
      fi
    fi
  else
    # Create directory
    mkdir -p "$(dirname "$ssh_key_path")"
  fi

  # Prompt for passphrase
  while true; do
    read -sp "Enter a passphrase for SSH key (required): " passphrase
    echo
    if [ -z "$passphrase" ]; then
        echo "Passphrase cannot be empty. Please try again."
        continue
    fi

    read -sp "Confirm passphrase: " confirm_passphrase
    echo

    # Check if passphrases match
    if [ "$passphrase" == "$confirm_passphrase" ]; then
      echo "Passphrase confirmed."
      break
    else
      echo "Passphrases do not match. Please try again."
    fi
  done

  # Generate the SSH key with the provided passphrase
  sudo -u $USERNAME ssh-keygen -t rsa -b 4096 -f "$ssh_key_path" -N "$passphrase" -C "syncora@$(hostname)" -q
  echo "SSH key generated at $ssh_key_path."
}

# Function - validate user input
validate_input() {
  while true; do
    read -p "$1 (Y/n): " choice
    case "$choice" in
      [yY]|'')
        return 0
        ;;
      [nN])
        return 1
        ;;
      *)
        echo "Invalid input. Please enter 'y' or 'n'."
        ;;
    esac
  done
}

echo "   _____                                 ";
echo "  / ____|                                ";
echo " | (___  _   _ _ __   ___ ___  _ __ __ _ ";
echo "  \___ \| | | | '_ \ / __/ _ \| '__/ _\` |";
echo "  ____) | |_| | | | | (_| (_) | | | (_| |";
echo " |_____/ \__, |_| |_|\___\___/|_|  \__,_|";
echo "          __/ |                          ";
echo "         |___/                           ";
echo " ========================================";
echo "                                         ";
echo "Welcome to the system setup for local development on Syncora"

# Ask user to update system packages
if validate_input "Do you want to update system packages? [recommended]"; then
  echo "Updating system packages..."
  sudo apt update && sudo apt upgrade -y
else
  echo "Skipping system update."
fi

# Ask the user which tools to install
echo
echo "Please choose the tools to install"
if validate_input "Install Git?"; then
  install_git
fi

echo
if validate_input "Install Visual Studio Code?"; then
  install_vscode
fi

echo
if validate_input "Install Docker?"; then
  install_docker
fi

echo
if validate_input "Install Docker Compose?"; then
  install_docker_compose
fi

echo
if validate_input "Install DDEV?"; then
  install_ddev
fi

echo
echo "Installation completed!"
if validate_input "Would you like to also configure a SSH key?"; then
    configure_ssh
fi

echo
if validate_input "Would you like to reboot your system to ensure all changes are applied correctly?"; then
  echo "Rebooting system..."
  sleep 3s
  sudo reboot
else
  echo "You can reboot your system later to apply changes."
fi

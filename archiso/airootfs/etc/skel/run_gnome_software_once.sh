#!/bin/bash

FLAG_FILE="$HOME/.config/.gnome_software_launched"

if [ ! -f "$FLAG_FILE" ]; then
    gnome-software &
    mkdir -p "$(dirname "$FLAG_FILE")"
    touch "$FLAG_FILE"
fi

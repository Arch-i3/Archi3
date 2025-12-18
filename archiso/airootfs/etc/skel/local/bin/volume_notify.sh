#!/bin/bash

# --- BEÁLLÍTÁSOK ---
# Értesítés ID (bármilyen szám, hogy felülírja az előzőt)
ID=2593
# Ikonok (opcionális, ha vannak ikonjaid, megadhatod az útvonalat)
ICON_VOL="audio-volume-high"
ICON_MUTE="audio-volume-muted"

# --- MŰKÖDÉS ---

case $1 in
    up)
        # Hangerő növelése 5%-kal
        pamixer -i 5
        ;;
    down)
        # Hangerő csökkentése 5%-kal
        pamixer -d 5
        ;;
    mute)
        # Némítás váltása
        pamixer -t
        ;;
esac

# Jelenlegi hangerő és némítás állapot lekérdezése
VOL=$(pamixer --get-volume)
IS_MUTED=$(pamixer --get-mute)

if [ "$IS_MUTED" == "true" ]; then
    # Ha némítva van
    dunstify -a "SYSTEM" -r "$ID" -u low -i "$ICON_MUTE" "Hangerő" "Némítva"
else
    # Ha nincs némítva: Küldjük az értesítést
    # -h int:value:$VOL -> Ez mondja meg a Dunstnak, hogy rajzoljon csúszkát (progress bar)
    dunstify -a "SYSTEM" -r "$ID" -u low -h int:value:"$VOL" -i "$ICON_VOL" "Hangerő: ${VOL}%"
fi

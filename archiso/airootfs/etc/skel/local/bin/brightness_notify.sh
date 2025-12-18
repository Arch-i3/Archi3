#!/bin/bash

# --- BEÁLLÍTÁSOK ---
# Értesítés ID (legyen más, mint a hangerőé!)
ID=2594
# Ikonok (opcionális, témától függ, ezek általános nevek)
ICON="display-brightness"

# --- MŰKÖDÉS ---

case $1 in
    up)
        # Fényerő növelése 5%-kal (vagy 10%-kal, ízlés szerint)
        brightnessctl set +5%
        ;;
    down)
        # Fényerő csökkentése 5%-kal
        # Fontos: beállíthatunk minimumot, hogy ne sötétüljön el teljesen a képernyő véletlenül
        # A brightnessctl alapból nem engedi 1 alá vinni, de érdemes figyelni rá.
        brightnessctl set 5%-
        ;;
esac

# Aktuális érték lekérdezése
# A brightnessctl -m (machine readable) kimenete: device,class,current,max_percent,max_raw
# A 4. mező a százalék, pl. "50%". A 'tr' paranccsal levágjuk a % jelet a végéről.
BRIGHTNESS=$(brightnessctl -m | awk -F, '{print substr($4, 0, length($4)-1)}')

# Értesítés küldése
# -h int:value:$BRIGHTNESS -> progress bar rajzolása
dunstify -a "SYSTEM" -r "$ID" -u low -h int:value:"$BRIGHTNESS" -i "$ICON" "Fényerő: ${BRIGHTNESS}%"

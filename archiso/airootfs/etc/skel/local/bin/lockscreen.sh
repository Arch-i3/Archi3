#!/bin/bash
RES=$(xrandr | grep '*' | awk '{print $1}' | head -n1)
convert $HOME/.i3lock/Archi3.png -resize ${RES}\! /tmp/lock.png
exec i3lock -i /tmp/lock.png --ignore-empty-password --show-failed-attempts

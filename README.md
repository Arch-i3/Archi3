
<img height=50 src=https://github.com/Arch-i3/Archi3-Artwork/blob/main/images/Archi3-logo-dark-small.png />

Yet another linux distribution, based on Arch Linux and i3.
#

## Philosophy
The system tries to follow [Unix philosophy](https://en.wikipedia.org/wiki/Unix_philosophy) and [KISS principle](https://en.wikipedia.org/wiki/KISS_principle).
Use the smallest and thinnest application possible. 

#
## Features

- [Arch Linux](https://archlinux.org/) base system
- [Calamares](https://calamares.io/) GUI installer
- [i3](https://i3wm.org/) tiling window manager

## Applications

> [!NOTE]
> Archi3 default applications
> | Catergory  | junior user | Senior User |
> | ------------- | ------------- |----------|
> | Menu  | dmenu |
> | File Manager | PCManFM | Midnight Commander |
> | Monitor Settings| lxrandr | xrandr |
> | Package Manager | bauh | pacman |
> | Task Manager | lxtask | htop |

- [Blueman](https://github.com/blueman-project/blueman) is a GTK+ Bluetooth Manager
- [Alacritty](https://alacritty.org/) terminal
- [mpv](https://mpv.io/) a free, open source, and cross-platform media player
- [DeaDBeeF](https://deadbeef.sourceforge.io/) is a modular cross-platform audio player with DSD support
- [Gnome Weather](https://apps.gnome.org/hu/Weather/) a weather app

- Material Design ([Materia](https://github.com/nana-4/materia-theme) theme, [Papirus](https://github.com/PapirusDevelopmentTeam/papirus-icon-theme) icon theme)
- Low CPU usage + Low memory usage + Energy saving = Lower [ecological footprint](https://en.wikipedia.org/wiki/Ecological_footprint)

For example:
  |          | Windows10 Home x64 | ChromeOS Flex | Archi3 |
  |-----------|--------|---------------|---------|
  |Samsung NP370 | 1,7GB | 900 MB | 350 MB |
  

#
## Code names

<img align="left" width="100" src="https://www.worldwildlife.org/assets/structure/unique/logo-c562409bb6158bf64e5f8b1be066dbd5983d75f5ce7c9935a5afffbcc03f8e5d.png">

Each edition is named after an endangered species, a list of which can be found on the WWF [website](https://www.worldwildlife.org/species/directory?direction=desc&sort=extinction_status).

> [!IMPORTANT]
> WWF® and ©1986 Panda Symbol are owned by WWF. All rights reserved.

#
## Use
### Default i3 keybindings

Keys to use with $mod (Alt):

<img src=https://i3wm.org/docs/keyboard-layer1.png />
Keys to use with Shift+$mod:

<img src=https://i3wm.org/docs/keyboard-layer2.png />

#
> [!TIP]
> Archi3 hotkeys for applications
> | Hotkey  | Application |
> | ------------- | ------------- |
> | $mod+d  | open application launcher (dmenu)  |
> | $mod+shift+q  | kill a window  |
> | $mod+f  | File Manager  |
> | $mod+Return  | Terminal Emulator  |
> | $mod+m  | Monitor settings  |
> | $mod+shift+p  | Package manager  |
> | $mod+p  | Power manager  |
> | $mod+n  | Network manager  |
> | $mod+b  | Bluetooth manager  |
> | $mod+x  | Lock screen  |


> [!NOTE]
> More information: [i3 reference card](https://i3wm.org/docs/refcard.html)

## Imprint

Thanks to all Linux and open source developers, because without them this project would not have been possible.
Special thanks to the [Archcraft](https://github.com/archcraft-os), [Arcolinux](https://github.com/arcolinux) and [EndeavourOS](https://github.com/endeavouros-team) projects, from which I drew ideas.

#
## Download

The iso can be downloaded here:
> | version  | link |
> | ------------- | ------------- |
> |v0.4-beta | [download](https://www.mediafire.com/file/wab2hrml3tjuyqi/Archi3-2025.05.09-x86_64.iso/file) |
> |v0.1-beta | [download](https://www.mediafire.com/file/9rjniezkg01rc8c/Archi3-2025.03.11-x86_64.iso/file) |


#
## Creating a USB
You can choose from the [following](https://wiki.archlinux.org/title/USB_flash_installation_medium) methods.

For example, in Linux with dd:
```
sudo dd bs=4M if=path/to/archlinux-version-x86_64.iso of=/dev/disk/by-id/usb-My_flash_drive conv=fsync oflag=direct status=progress
```



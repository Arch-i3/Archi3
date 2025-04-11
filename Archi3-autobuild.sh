#!/bin/bash
mkdir BUILD
cd BUILD
mkdir local
cd local
mkdir repo
cd
mkdir GitHub
cd GitHub
git clone https://github.com/Arch-i3/Archi3.git
cd
cd BUILD
git clone https://github.com/arch-linux-calamares-installer/alci-iso.git
cd alci-iso
rm -rf archiso
ln -s /home/kakuk/GitHub/Archi3/archiso .
cd
cd BUILD
git clone https://github.com/Arch-i3/Archi3_repo.git


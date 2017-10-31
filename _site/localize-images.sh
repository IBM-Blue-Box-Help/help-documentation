#!/bin/bash

# WARNING: This is a highly experimental tool, so please use at your own risk!

# Description:
# This script is designed to copy image assets (only .png, .jpg and .svg files) from the 'img' directory in the project root to their respective language subdirectories (e.g. 'img/es')

# Usage:
# To run this script, you must be in your project root directory (e.g. ~/help-documentation-staging-area). The script will copy all images found in the img/ directory to their respective img/$lang directories. In practice, this means that 'img/foo.png' will be copied to 'img/es/foo.jpg', 'img/en/foo.jpg', etc. If an image already exists in 'img/de/foo.png', it will not be replaced.

# $ sh localize-images.sh
#
# or
#
# $ chmod +x localize-images.sh
# $ ./localize-images.sh

cwd=$(pwd)
cd ./img

langs=(en es de fr it ja "pt_BR" "zh_CN" "zh_TW");

# build a list of the lang sub-directories images to ignore
ignored_dirs="";
for lang in "${langs[@]}"
do
  ignored_dirs="$ignored_dirs -path ./$lang -o";
done
# truncate off the last " -o", as per the requirement of the find command
ignored_dirs=${ignored_dirs%???};

for lang in "${langs[@]}"
do
  find . -type d \($ignored_dirs \) -prune -o \( -iname '*.svg' -o -iname '*.png' -o -iname '*.jpg' \) -print | xargs -I {} cp -n {} $lang/{}
done

cd $cwd


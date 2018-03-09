---
layout: page
title:  "How to Launch an Instance from a Volume"
tags: [openstack, launch instance, volume]
dateAdded: June 13th, 2015
featured: true
---

Red Hat has [a good article on launching an instance from a volume](https://access.redhat.com/documentation/en-US/Red_Hat_Enterprise_Linux_OpenStack_Platform/4/html/End_User_Guide/boot_from_volume.html).  The summary is:

1. Choose an image to create a bootable volume from:

		$nova image-list

2. Create a bootable volume from the image using the image ID:

		# cinder create --image-id e0b7734d-2331-42a3-b19e-067adc0da17d --display-name my-boot-vol 8

3. List volumes:

		$ cinder list

4. Launch the instance:

		$ nova boot --flavor 2 --image e0b7734d-2331-42a3-b19e-067adc0da17d \ --block_device_mapping vda=3195a5a7-fd0d-4ac3-b919-7ba6cbe11d46:::0 myInstanceFromVolume


5. Observe that the volume is attached to a server when you list volumes:

		$ nova volume-list


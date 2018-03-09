---
layout: page
title:  "Creating a volume with the command line"
tags: [cinder, ceph, volume]
dateAdded: September 21st, 2016
author: Ying Tang
featured: false
weight: 4
---

# Creating a volume with the command line

To create a volume, use the following syntax:

     cinder create <size> --display-name <name> --volume-type <type> \
     --image-id <imageid> --availablity-zone <az>
  
* *\<size>*: The size of the volume in gibibytes (GiB).     
* *\<name>*: The name of the volume.
* *\<type>*: `CEPH_HYBRID` or `CEPH_SSD`. You can use the `cinder type-list` command to get a list of available volume types. 
* *\<imageid>*: The ID of the image that you want to use for your volume. You can use the `nova image-list` command to list the existing images. 
* *\<az>*: The availability zone in which you want to create the volume. You can use the `cinder availability-zone-list` command to get a list of availability zones. 


The following figure describes the output of this command. 

![Create a volume with command line]({{site.baseurl}}/img/cli-create-volume.jpg)

You can also use the `cinder list` command to get a list of your existing volumes. 


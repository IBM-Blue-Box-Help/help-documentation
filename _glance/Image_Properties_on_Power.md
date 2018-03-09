---
layout: page
author: Niraj Patel
title: Optimal Settings for Glance Images on Power Compute
dateAdded: October 6, 2016
tags: [glance, ppc64el, images, power]
weight: 5
featured: FALSE
editor: Leslie Lundquist
---

When you're working with Glance images that you'll use to boot VMs on Power compute nodes, we recommend that you use the following properties (key/value pairs) for your images:

 * architecture=ppc64
 
 * hw_scsi_model=virtio-scsi  (This pair adds the virtio-scsi controller and gets better performance and support for discard operations.)

 * hw_disk_bus=scsi  (This pair connects every Cinder block device to that controller.)

These settings are needed to be able to attach Cinder volumes to running guest VMs.

Here's a screen shot showing what the Horizon interface looks like when you're updating metadata. You can update the metadata when you initially create an image, or later at any time.

![Glance_image_metadata.png]({{site.baseurl}}/img/Glance_image_metadata.png)

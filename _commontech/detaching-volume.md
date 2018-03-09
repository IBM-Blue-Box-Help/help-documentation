---
layout: page
title:  "What Should I Do Prior to Detaching a Volume?"
featured: true
weight: 2
tags: [getting started, detach volume]
dateAdded: June 18th, 2015
---

Please take the following steps to detach a volume safely:

* For **Linux** instances, unmount the volume and remove any reference to it from your `/etc/fstab` file.

* For **Windows** instances, take the volume offline using the **Disk Management utility** prior to detaching the volume.

The **OpenStack** volume service cannot tell whether it is safe to remove volumes from an instance, so it does what it is told.

For example, if you tell the volume service to detach a volume from an instance while that volume is being written to, you can expect some level of file system corruption, as well as faults from any process within the instance that was using the device when the volume was detached.

---
layout: page
title: "How to Move from Ephemeral Disk to Cinder Storage"
featured: false
weight: 5
tags: [cinder, ephemeral]
author: Blue Box Support
dateAdded: June 16, 2016
---


Transitioning from the ephemeral disk to the Cinder disk cannot be performed by making a snapshot, because snapshots do not include ephemeral storage.

To move your **EXT-DATA-ephemeral** volumes to Cinder, you’ll need to do the following steps:

1. Create a volume in Cinder.
2. Attach the volume to the instance.
3. Copy the data on `/dev/sdb` to the new volume.
4. Detach the volume from instance.
5. Attach volume to your new instance.

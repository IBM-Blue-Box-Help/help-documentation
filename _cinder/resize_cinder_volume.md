---
layout: page
title:  "How Can I Resize a Cinder Volume?"
tags: [cinder, resize]
dateAdded: October 13th, 2015
featured: false
weight: 4
---


**Cinder** volumes are block storage devices that you attach to instances to enable persistent storage. Resizing of Cinder volumes is not supported yet. Until it becomes supported, you can accomplish the same thing with these steps:

Unmount the Cinder volume from inside the instance:

```
umount /mnt/volume
```

Detach the Cinder volume:

```
nova volume-detach <instanceid> <volumeid>
```

Snapshot the volume.

Deploy a new volume from the snapshot, with the new size.


See [OpenStack Storage Concepts](http://ibm-blue-box-help.github.io/help-documentation/openstack/userdocs/openstack-storage-concepts/) for more information about the OpenStack storage concepts.

---
layout: page
title:  "What happens behind the scenes when I boot a virtual machine, and how can I make it boot faster?"
dateAdded: January 9, 2017
featured: true
author: Ulysses Kanigel
editor: Leslie Lundquist
weight: 4
tags: [nova, instance, VM, virtual, boot, time, speed, slow, fast, glance, image, size]
---

**What happens behind the scenes on a compute node when I boot a virtual machine?**

Here's an example of a typical 7-second build with a **618MB Red Hat Enterprise Linux 7.2 QCOW2 image**, already cached on the compute node, prepared with `virt-sparsify` and `virt-sysprep`, and the default `m1-medium` flavor:

```
19:38:45.816 lock is acquired to build & run instance (0s to acquire lock)
19:38:45.946 resources are claimed (Memory, Disk, CPU)
19:38:46.045 network build starts
19:38:46.168 IP allocated
... misc nova virt API tasks run
19:38:46.905 qemu-img create runs
19:38:47.047 libvirt driver retrieves network info, device mapping info
19:38:48.606 VM starts
... instance power state is synchronized with controller database
19:38:52.196 network virtual interface plugged in
19:38:52.299 VM instance build complete
```

If it's taking longer than this, here are a few possible causes:

 * your image may be large
 * you may be running pre or post-instance creation scripts
 * you may be associating multiple networks/IPs
 * the image may not be cached yet on the compute node you're deploying to

Instance provisioning always takes longer the first time, because the image has to be copied from your Glance image store to the compute node. After the first time, provisioning from the same image on the same compute node will be quicker.

**How can I make instances boot faster?**

* Set your grub timeout to 0 seconds.
* Ensure that your images are only as large as they need to be.
* On each compute node, keep one long-term instance that uses the same backing image as the new instance you're spinning up.  This technique ensures that the `glance-image` cache in _base_ on each compute node is populated.
* When running your Nova boot command, hard code the UUID for the image, network, and flavor.  This technique can trim 4 seconds or so from your boot time.
* If you're using Chef and want to further optimize image creation and boot time, check out Brian O'Connell's excellent series of detailed articles on doing just that: http://infrastructuredevops.com/categories/#bluebox

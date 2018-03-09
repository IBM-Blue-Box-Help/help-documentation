---
layout: page
title: Running Out of Space on Converged Controllers?
dateAdded: October 11, 2016
author: Chris Wheeler
editor: Leslie Lundquist
tags: [troubleshooting, cinder, snapshots, object storage, glance images]
---


**Q.** I have Converged Controllers (Controller Nodes with both Instances and Glance Images Stored on them) and I'm running out of space.  Also, when I attempt to migrate VMs, I am seeing a policy denied error.  What do I do?

**A.** Without block or object storage, images and snapshots are synchronized between both controller nodes and stored on each, and there is no method to move them elsewhere. Thus, storage fills up quickly. Both cold and live migration are disabled when you're using ephemeral storage, due to the potential for failures and data loss.

The ideal way to avoid consuming space on the controllers with images and snapshots would be to ask your customer success manager to add Cinder block storage or Swift object storage to your cluster, and then to use that storage as the backend for the Glance image service. (Additional cost is associated.)

The best option for freeing up space without additional cost is to remove unneeded images, snapshots, and VMs. If that is not possible and you need to reprovision a VM to another compute node, we recommend taking a snapshot of the VM, provisioning elsewhere using server group *anti-affinity* (see http://ibm-blue-box-help.github.io/help-documentation/nova/deploy-to-specific-hypervisor/ ), and deleting the original VM.

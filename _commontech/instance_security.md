---
layout: page
title:  "How can I Create Better Security in My Cloud?"
tags: [commontech, instance, hypervisor, security, interfaces]
author: Dustin Lundquist
editor: Leslie Lundquist
dateAdded: July 12th, 2016
featured: false
weight: 4
---

Users have root access to their instances, and we want to restrict access to the host hypervisors. Therefore, anytime information flows from the instance to the hypervisor, it should be through secured interfaces. We should think very carefully before introducing any more avenues for information to move from the guest instance to the hypervisor. 

The existing interfaces:

1. Instance I/O devices -- virtualized network interfaces, virtualized disk controllers, etc -- these are provided by QEMU
2. Network services: metadata, DHCP, etc -- these are run by Neutron in network namespaces.
3. OpenStack APIs

These interfaces represent the security boundary between users and the stack itself. If there is a security weakness in one of these areas, it could be used to gain access to the hypervisor and potentially to other tenants.

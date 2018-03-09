---
layout: page
title: Building Blocks for IBM Bluemix Private Cloud with Red Hat
featured: false
weight: 10
tags: [getting started, dedicated controllers, nodes, overview, red hat, rhosp]
dateAdded: March 31, 2017
author: Leslie Lundquist
---

### Cloud Overview: IBM Bluemix Private Cloud with Red Hat Building Blocks

Every **IBM Bluemix Private Cloud with Red Hat** starts with a cluster of controller and compute nodes:

* Each cloud starts with two dedicated controller-only nodes and dedicated Vyatta gateway firewalls
* The base cluster starts with three Standard-Plus compute nodes OR three I/O Optimized compute nodes

**Additional building blocks:**

* Dedicated Gateway Firewalls (2 included by default)
* Up to 10 Gbps of network connectivity 
* You can add compute nodes (or additional ones): Standard-Plus or I/O-Optimized
* You can add SSD block storage (backed by Ceph)
* You can add object storage (Swift)

**Expansion Compute Nodes**

Expansion compute nodes address your workload's requirements for faster I/O ephemeral, more RAM, or larger ephemeral storage.  I/O-optimized expansion nodes allow better coverage of specific instance types and workloads. Compute types are grouped into Availability Zones for easy targeting of workloads to the appropriate compute type.

**Expansion Storage Nodes**  

* You can add SSD Block Storage
* You can add Object Storage 

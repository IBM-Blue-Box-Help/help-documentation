---
layout: page
title: IBM Bluemix Private Cloud Building Blocks (Community Edition)
featured: false
weight: 10
tags: [getting started, dedicated, local, controllers, nodes, overview]
dateAdded: March 31, 2017
author: Leslie Lundquist
---

Every **IBM Bluemix Private Cloud**, Dedicated or Local, starts with a cluster of controller and compute nodes:

**IBM Bluemix Private Cloud:**

* A cloud can start as a three-node cluster with two hyper-converged (controller + compute nodes) and one compute-only node.
* A cloud can start as a five-node cluster with a pair of dedicated controller-only nodes and three compute-only nodes. 

**IBM Bluemix Private Cloud Local:**

* Each cloud must have at least one dedicated controller-only node and three compute-only nodes.  
	
From any of these starting places (e.g., 3-node hyper-converged, or 5-node with dedicated controllers), you can add compute nodes of any type, along with block storage (Ceph), and/or object storage (Swift).

**Additional building blocks:**

* For a Standard Capacity Dedicated cloud, Dedicated Gateway Firewalls are included by default
* Enterprise Capacity includes double the resources and 10 Gbps of network connectivity 
* Dedicated controller nodes (or additional ones)
* Compute nodes (or additional ones): Standard or Enterprise, IO or High Storage, Power Compute (Habañero)

**Expansion Compute Nodes**

Optionally, you can select from the following compute node extensions to add to your standard or enterprise cloud:

* You can select specialized expansion compute nodes: IO, or HIGH STORAGE, or HABAÑERO POWER COMPUTE
* You can select additional standard or enterprise compute nodes: STANDARD COMPUTE, or ENTERPRISE COMPUTE

Expansion compute nodes address your requirements for faster IO ephemeral, more RAM, and an order of magnitude larger ephemeral storage.  Both types of expansion nodes—IO optimized and high storage capacity—allow better coverage of instance types and workloads. Starting with the 2.1.0 release, compute types have been grouped into Availability Zones for easy targeting of workloads to the appropriate compute type.

**Types of Storage Nodes**

Hybrid Block Storage nodes provide lower-cost and higher-density Block Storage.  

* You can select Block Storage: SSD or HYBRID
* You can select Object Storage 

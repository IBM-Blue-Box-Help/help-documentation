---
layout: page
title: General Product Overview
featured: false
weight: 10
tags: [release, features, gettingstarted, overview]
dateAdded: March 29, 2016
author: Leslie Lundquist
---

#### General Product Overview

Both offerings of **IBM Blue Box Cloud**, Dedicated and Local, are deployed automatically through a **Site Controller** machine, which serves as a storehouse for the **Ursula/Ansible playbooks** we use to create your cloud. You can view the [Ursula playbooks](https://github.com/blueboxgroup/ursula) on **GitHub**. They are open source documents.

**Site Controller**

To deploy the **IBM Blue Box Dedicated** offering, a physical **Site Controller** machine must be located in a **SoftLayer Datacenter** within the same geographical region in which your new IBM Blue Box Dedicated cloud is deployed.

To deploy the **IBM Blue Box Local** cloud offering, a Site Controller logical machine must be co-located within your IBM Local Cloud data center, and it will communicate with a Central Site Controller machine at IBM Blue Box.

Each version of **Ursula** on the Site Controller is tailored to initialize and run a specific version of OpenStack and IBM Blue Box Cloud, by setting up the proper environment variables and other aspects of your customized cloud configuration. The particular version of Ursula described in this document is 2.10, and the environment which it creates for your cloud is described in the next section.

**Software Environment Created by Ursula**

IBM Blue Box Cloud software is based on **Ubuntu 14.04** or **Cirros 0.3.3 x86_64** and the **Kilo** release of OpenStack, specifically including the Nova, Glance (backend points to Swift), Swift, Cinder (backed by Ceph clusters), Neutron L3 HA, Keystone, Horizon, Heat, LBaaS, and Ceilometer (+MongoDB) modules. The Cinder backing data storage is provided by Ceph clusters. Your cloud also will include some third-party software monitoring tools that work along with the OpenStack modules: Grafana, ELK, and Sensu.

Upon request, IBM will enable some additional enhanced features:

* Deploying an OpenStack software load balancer (LBaaS) that is managed through Neutron (it requires the Dedicated Controller feature)
* Integration with Urban Code Deployer (UCD) through an OpenStack Heat (Orchestration) plug-in.

**Hardware Environment and Monitoring**

The IBM Blue Box Cloud hardware substrate varies by offering. You can get more information about the Bill of Materials (BOM) from your IBM Blue Box Cloud service team.

You can use the **OpenStack Horizon** interface to monitor your cloud’s performance, or you can use a customized IBM Blue Box product, Box Panel, to view your cloud as well as your resource usage, your network configurations, and other features of your cloud.

You can find more information about Box Panel in the [Box Panel User Guide.](https://github.com/IBM-Blue-Box-Help/help-documentation/blob/gh-pages/_gettingstarted/Box_Panel.md)

#### **Cloud Overview: IBM Blue Box Cloud Building Blocks**

Every IBM Blue Box Cloud, Dedicated or Local, starts with a cluster of controller and compute nodes:

**IBM Blue Box Dedicated Cloud:**

	• A cloud can start as a three-node cluster with two hyper-converged (controller + compute nodes) and one compute-only node.
	• A cloud can start as a five-node cluster with a pair of dedicated controller-only nodes and three compute-only nodes. 

**IBM Blue Box Local Cloud:**

	• Each cloud must have at least one dedicated controller-only node and three compute-only nodes.  
	
From any of these starting places (e.g., 3-node hyper-converged, or 5-node with dedicated controllers), you can add compute nodes of any type, along with block storage (Ceph), and/or object storage (Swift).

**Additional building blocks:**

	• For a Standard Capacity Dedicated cloud, Dedicated Gateway Firewalls are included by default
	• Enterprise Capacity includes double the resources and 10 Gbps of network connectivity 
	• Dedicated controller nodes (or additional ones)
	• Compute nodes (or additional ones): Standard or Enterprise, IO or High Storage 

#### **Optional Expansion Compute Nodes**

Optionally, you can select from the following compute node extensions to add to your standard or enterprise cloud:

	• You can select specialized expansion compute nodes: IO, or HIGH STORAGE 
	• You can select additional standard or enterprise compute nodes: STANDARD COMPUTE, or ENTERPRISE COMPUTE

Expansion compute nodes address your requirements for faster IO ephemeral, more RAM, and an order of magnitude larger ephemeral storage.  Both types of expansion nodes—IO optimized and high storage capacity—allow better coverage of instance types and workloads. Starting with the 2.1.0 release, compute types have been grouped into Availability Zones for easy targeting of workloads to the appropriate compute type.

#### **Optional Hybrid Block Storage Nodes **

Hybrid Block Storage nodes provide lower cost and higher density Block Storage.  

	• You can select Block Storage: SSD or HYBRID
	• You can select Object Storage 


Your purchase of IBM Blue Box Dedicated Cloud includes 24/7 technical support. The Box Panel product provides an interface for opening a support ticket. You also can call Blue Box Support at 1-800-613-4305 or email us at *support@bluebox.net*.

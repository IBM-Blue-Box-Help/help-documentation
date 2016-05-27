--- 

layout: page 
title: "OpenStack Network Concepts" 
featured: false 
weight: 2
tags: [OpenStack, concepts] 
author: Ying Tang
Editor: Leslie Lundquist
dateAdded: May 25, 2016
--- 

## Basic Concepts

| **Concept**          | ** Description**                                                                                                                                   																		 |
|----------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Network              | An isolated L2 segment, similar to a VLAN in regular networking. A network may have one or more subnets.                                     																			     |
| Subnet               | A range of IPv4 addresses.																																																	 |
| Port 	               | A connection point for attaching a single device, such as the NIC of a virtual server, to a virtual network. Also describes the associated network configuration, such as the MAC and IP addresses to be used on that port. |
| Fixed IP address     | IP address that is assigned to an instance on boot, such as the private network IP addresses.																											                     |
| Floating IP address  | IP address that is assigned to an instance on demand.																																										 |
| Quota                | A quota limits the number of available resources.																																											 |
| Security groups      | A set of project-specific network filter rules that are applied to an instance’s network interfaces.																														 |
| Security group rule  | A set of protocol, port, and IP address specifications to allow traffic to flow to or from an instance on the network.																										 |

## Network types

### Internal Networks

An internal network provides connectivity among the virtual network interfaces attached to it. Each such internal network interface is associated with a VM. A single VM can have multiple network
 interfaces associated with it. 
 
You can enable communication among a set of VMs by connecting them to the same internal network. Internal networks are associated with a single project and are visible to and accessible by only the single project. 
 
### External Networks

External networks include the public network, the SoftLayer private network, and a router network. 

* The public network provides access to the Internet. 
* The SoftLayer private network is intended to provide access to other services in SoftLayer. 
* The router network is intended to provide access to customer resources outside your private cloud environment. 

Such resources might reside in a data center at your site or in another private cloud environment owned by you in SoftLayer or elsewhere. The public and SoftLayer private networks 
are physical networks.
--- 

layout: page 
title: "OpenStack Network Concepts" 
featured: false 
weight: 2
tags: [OpenStack, concepts] 
author: Ying Tang
editor: Leslie Lundquist
dateAdded: May 25, 2016
--- 

This document offers a basic introduction to some common networking concepts. You'll encounter these concepts when working with your IBM Bluemix on OpenStack.
 
### Terminology Used in This Document

| **Concept**          | **Description**                                                                                                                                   																		 |
|----------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------| 
|L2       |Layer-2 of the ISO 7-layer Internet Architecture, where packets are routed. |
|VLAN     | Virtual Local Area Network, essentially a subnet. |
|IP       | Internet Protocol, typically used as an abbreviation for an IP Address, which specifices the destination of a packet on the network. |
|IPv4     |Internet Protocol, version 4, an Internet address of the form xxx.xxx.xxx, now usually with the addition of /xx at the end to denote the subnet size using a protocol called CIDR. |
|CIDR     | Classless Inter-Domain Routing or supernetting, which is a way to extend the useful life of IPv4 addresses, which can be scarce in a global pool, and therefore usually must be purchased. Here is a link to more information about CIDR: http://searchnetworking.techtarget.com/definition/CIDR. Here is a link to a CIDR subnet size calculator, which is handy for knowing how many IPs you'll get out of a certain range: http://www.subnet-calculator.com/cidr.php (remember that some of those IPs will be pre-allocated and not available for your cloud).|
|IPv6     | Internet Protocol, version 6, a newer Internet addressing protocol that provides plenty of network addresses but can add complexity to networking architectures.  |
|NIC      | Network Interface Card, a piece of hardware that attaches servers to a network. Also, Virtual NICs, essentially a piece of software that works like a NIC, are common in cloud usage, and the term "network interface" usually refers to a virtual NIC unless context dictates that it refers to hardware specifically.|
|MAC      | The individual identifier, something like a hardware serial number, that uniquely identifies every host on a network. |


### Basic Networking Concepts

| **Concept**          | **Description**                                                                                                                                   																		 |
|----------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Network              | An isolated Layer-2 (L2) segment, similar to a VLAN in regular networking. A network may have one or more subnets.                                     																			     |
| Subnet               | A range of IPv4 addresses.																																																	 |
| Port 	               | A connection point for attaching a single device, such as the NIC of a virtual server, to a virtual network. The term "port" also describes the associated network configuration, such as the MAC and IP addresses to be used on that port. |
| Fixed IP address     | IP address that is assigned to an instance on boot, such as a network IP address for an instance that needs to reach the public Internet.																											                     |
| Floating IP address  | IP address that is assigned to an instance on demand, from a pool, often of the IPv6 form.																																										 |
| Quota                | A quota limits the number of available resources, such as Compute or Disk allocations, for your cloud.																																											 |
| Security groups      | A set of network filter rules, specific to your project, which are applied to an instance’s network interactions by specifying which IPs can or cannot send packets to another IP or port.																														 |
| Security group rule  | A list of protocol, port, and IP address specifications that establish how traffic is allowed flow to, or from, any specific instance on the network; these are the specifics of a security group.																										 |

### Cloud Network Types

Generally, your cloud will have one or more each of **internal** and **external** networks. You can think of this idea as if the instances in your cloud can "talk" to each other on the internal networks, and they "talk" to sources outside your private cloud on the external networks.

Various terms can be used to describe internal and external networks. For example, internal networks sometimes are called "tenant networks." External networks that are used to communicate with the public Internet sometimes are referred to as "provider networks."

#### Internal Networks

An internal network "talks" within your cloud; it provides connectivity among the all of the virtual network interfaces (NICs) attached to it. Each internal network interface is associated with a virtual machine (VM), and a single VM can have multiple network interfaces associated with it, which means it can "talk" on many networks. 
 
You can enable communication among a set of VMs by connecting them to the same internal network. Internal networks are associated with a single project (tenant), and they are visible to and accessible to that project only. 
 
#### External Networks

External networks can "talk" within and outside your cloud. They may include the public Internet, your cloud's external network, and the SoftLayer network, which contains the SoftLayer router.

* Your cloud's "public network" or "external network" provides access to and from the public Internet. 
* The SoftLayer private network is intended to provide access to other services in SoftLayer, including other clouds you may wish to communicate with. (See the [Release Notes](http://ibm-blue-box-help.github.io/help-documentation/gettingstarted/commontech/release_notes_for_customers/) for more information about access to the SoftLayer private network. 
* The SoftLayer router network connects to the SoftLayer Backend Core Router (BCR), which lets you reach resources outside your own private cloud environment, resources which might reside in a data center at your site (IBM Bluemix Local on OpenStack) or in another private cloud environment owned by you, in a SoftLayer data center or elsewhere (Bluemix Dedicated on OpenStack or your own legacy cloud). 
* Public and SoftLayer private networks are physical networks.

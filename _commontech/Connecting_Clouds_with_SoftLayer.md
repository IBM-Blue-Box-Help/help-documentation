---
layout: page
title: Set Up Network Connectivity Between Multiple Cloud Environments, Using the Private Network
featured: false
weight: 13
tags: [getting started, network, private network]
dateAdded: March 22nd, 2016
author: Shaival Choski
editor: Leslie Lundquist, Jesse Proudman
---

### Overview: 

This document explains how to set up network connectivity between multiple **IBM Bluemix Private Cloud** installations, using the **IBM Cloud Data Center** private network. 

Traffic transmitted over the IBM Cloud Data Center private network is not metered, so this is the preferred method to communicate between multiple IBM Bluemix Private Clouds. You can read more about the IBM Cloud Data Centers [private network here](http://www.softlayer.com/network).

Do note, IBM Cloud Data Center private network traffic is segmented from the public internet and from other SoftLayer customers, but traffic is *not encrypted*. Should you require encryption, even in the context of a private network, you'll want to ensure that you add client-side encryption to your configuration.

### Assumptions: 

The document assumes that each IBM Bluemix Private Cloud you are planning to connect has been deployed under the same SoftLayer account. If you order multiple clouds as an IBM Bluemix Private Cloud customer, this assumption should be true automatically.

### Known Limitations:

Traffic from instances that have a floating IP associated with them will have SNAT translation performed **before traversing** the IBM Cloud Data Center private network.  If the customer's application is sensitive to the source address being translated, instances with floating IPs cannot be used.

### To Initiate Network Connectivity

1. If your IBM Bluemix Private cloud already is deployed, open a support ticket and request access to the IBM Cloud Data Center private network.

2. If your IBM Bluemix Private is a new deployment (for new users), when ordering the Bluemix Private cloud, request IBM Cloud Data Center private network connectivity.

### Communicating Between Virtual Machines over the Private Network

When you request an IBM Cloud Data Center private network, an internal OpenStack shared network named `sl-private-network` is created for you. This network is subject to a few provisions:

* This network is visible to all users across all OpenStack projects in your IBM Bluemix Private Cloud.
* All users are able to attach virtual machines directly on this network and will have network connectivity to all other virtual machines attached to that network.
* Virtual Machines on this network can be secured using standard OpenStack security groups.
* When a virtual machine is deployed to the `sl-private-network`, a 10.x.x.x IP address is assigned. This IP address is routable between your IBM Cloud data centers. 
* Each IBM Bluemix Private Cloud will have a unique 10.x.x.x subnet, and the IBM Cloud Data Center will route traffic between them over its private network.

On each instance you want to be able to communicate with, perform these steps:

**Step 1.** Create a virtual machine as usual.  Locate the pulldown menu on the right, where you would normally attach a floating IP address to your VM.  On the same pulldown menu, select `Attach Interface` and then select `sl-private-network-01`.

**Step 2.** Log in to the virtual machine you just created.  Configure the IP manually on the `eth1` interface, for example:

```
vi /etc/network/interfaces

# Configure Loopback
auto lo
iface lo inet loopback

auto eth0
iface eth0 inet dhcp

auto eth1
iface eth1 inet static
address 10.168.6.87
netmask 255.255.255.192
gateway 10.168.6.65
```

**Step 3.** Add static route for the 10 net, for example, `ip route add 10.0.0.0/8 via 10.168.6.65` and remember to `ifdown eth1 && ifup eth1`

If you haven't done these 3 steps on each of your instances, you won't get connectivity to your other locations.  Neutron will automatically change the IP address to the floating IP when assigned on a NIC card.

---
layout: page
title: Utilizing SoftLayer's Private Network with Multiple IBM Blue Box Environments
featured: false
weight: 13
tags: [SoftLayer, network, private network, gettingstarted]
dateAdded: March 22nd, 2016
author: Shaival Choski
editor: Leslie Lundquist, Jesse Proudman
---

# Utilizing SoftLayer's Private Network with Multiple IBM Blue Box Clouds

### Overview: 

This document explains how to set up network connectivity between multiple **IBM Blue Box Dedicated** private clouds, using the **SoftLayer** private network. 

Traffic transmitted over the SoftLayer private network is not metered, so this is the preferred method to communicate between multiple IBM Blue Box Dedicated clouds. You can read more about the SoftLayer [private network here](http://www.softlayer.com/network).

Do note, SoftLayer private network traffic is segmented from the public internet and from other SoftLayer customers, but traffic is *not encrypted*. Should you require encryption, even in the context of a private network, you'll want to ensure that you add client-side encryption to your configuration.

### Assumptions: 

The document assumes that each IBM Blue Box cloud you are planning to connect has been deployed under the same SoftLayer account. If you order multiple clouds as an IBM Blue Box customer, this assumption should be true automatically.

### Known Limitations:

Traffic from instances that have a floating IP associated with them will have SNAT translation performed **before traversing** the SoftLayer private network.  If the customer's application is sensitive to the source address being translated, instances with floating IPs cannot be used.

 L2 population presents some limitations for customers that want to implement vIP failover between instances, because it won't work without making Neutron API calls.  

### To Initiate Network Connectivity

1. If your IBM Blue Box cloud already is deployed, open an IBM Blue Box support ticket and request access to the SoftLayer private network.

2. If your IBM Blue Box cloud is a new deployment (for new users), when ordering the Blue Box cloud, request SoftLayer private network connectivity.

### Communicating Between Virtual Machines over the Private Network

When you request a SoftLayer private network, an internal OpenStack shared network named `sl-private-network` is created for you. This network is subject to a few provisions:

* This network is visible to all users across all OpenStack projects in your IBM Blue Box Dedicated cloud.
* All users are able to attach virtual machines directly on this network and will have network connectivity to all other virtual machines attached to that network.
* Virtual Machines on this network can be secured using standard OpenStack security groups.
* When a virtual machine is deployed to the `sl-private-network`, a 10.x.x.x IP address is assigned. This IP address is routable between your SoftLayer data centers. 
* Each IBM Blue Box Dedicated cloud will have a unique 10.x.x.x subnet, and SoftLayer will route traffic between them over its private network.

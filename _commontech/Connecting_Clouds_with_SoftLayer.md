---
layout: page
title: Utilizing SoftLayer's Private Network with Multiple IBM Bluemix on OpenStack Environments
featured: false
weight: 13
tags: [getting started, SoftLayer, network, private network]
dateAdded: March 22nd, 2016
author: Shaival Choski
editor: Leslie Lundquist, Jesse Proudman
---

# Utilizing SoftLayer's Private Network with Multiple IBM Bluemix on OpenStack cloud instances

### Overview: 

This document explains how to set up network connectivity between multiple **IBM Bluemix Dedicated on OpenStack** private clouds, using the **SoftLayer** private network. 

Traffic transmitted over the SoftLayer private network is not metered, so this is the preferred method to communicate between multiple IBM Bluemix Dedicated on OpenStack cloud instances. You can read more about the SoftLayer [private network here](http://www.softlayer.com/network).

Do note, SoftLayer private network traffic is segmented from the public internet and from other SoftLayer customers, but traffic is *not encrypted*. Should you require encryption, even in the context of a private network, you'll want to ensure that you add client-side encryption to your configuration.

### Assumptions: 

The document assumes that each IBM Bluemix on OpenStack cloud instance you are planning to connect has been deployed under the same SoftLayer account. If you order multiple clouds as an IBM Bluemix on OpenStack customer, this assumption should be true automatically.

### Known Limitations:

Traffic from instances that have a floating IP associated with them will have SNAT translation performed **before traversing** the SoftLayer private network.  If the customer's application is sensitive to the source address being translated, instances with floating IPs cannot be used.

### To Initiate Network Connectivity

1. If your IBM Bluemix on OpenStack already is deployed, open an IBM Bluemix on OpenStack support ticket and request access to the SoftLayer private network.

2. If your IBM Bluemix on OpenStack is a new deployment (for new users), when ordering Bluemix on OpenStack, request SoftLayer private network connectivity.

### Communicating Between Virtual Machines over the Private Network

When you request a SoftLayer private network, an internal OpenStack shared network named `sl-private-network` is created for you. This network is subject to a few provisions:

* This network is visible to all users across all OpenStack projects in your IBM Bluemix Dedicated on OpenStack cloud instance.
* All users are able to attach virtual machines directly on this network and will have network connectivity to all other virtual machines attached to that network.
* Virtual Machines on this network can be secured using standard OpenStack security groups.
* When a virtual machine is deployed to the `sl-private-network`, a 10.x.x.x IP address is assigned. This IP address is routable between your SoftLayer data centers. 
* Each IBM Bluemix Dedicated on OpenStack cloud instance will have a unique 10.x.x.x subnet, and SoftLayer will route traffic between them over its private network.

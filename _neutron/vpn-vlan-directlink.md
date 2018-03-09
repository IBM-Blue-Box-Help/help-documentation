---
layout: page
title: "VPN, VLAN, and Direct Link"
featured: false
weight: 5
tags: [neutron, VLAN, Direct Link]
dateAdded: April 17, 2017
author: Ying Tang
---


## Overview

### VPN

VPN is a secured tunnel between two networks. A most typical VPN use cases with IBM Bluemix Private Cloud is the following: 

When you need to connect to your internal Bluemix Private Cloud instances, and you prefer not to put those virtual machines on the internet, you can [establish a bastion host with OpenVPN running on it](http://ibm-blue-box-help.github.io/help-documentation/gettingstarted/commontech/openvpn-setup/) and then [connect with OpenVPN to your cloud instance](http://ibm-blue-box-help.github.io/help-documentation/gettingstarted/commontech/connect-to-openvpn-server/). 
 
### VLAN

A VLAN is a logical grouping of switch (or bridge) ports spanning one or more switches which present a common isolated L2 broadcast domain, that is, a broadcast domain where a broadcast frame _should_ reach all ports on the VLAN). 

Technically a Neutron network _may_ be a VLAN. It has been extended to various overlay and tunnel technologies, and recently extended to mean a group of Neutron ports which are reachable via L3 (e.g. IP protocol packets). This distinction was made for large providers who wish to use L3 routing to reduce the L2 broadcast domain size to improve scaling.

Typically, you can use the Horizon dashboard or the OpenStack command line to [create additional networks with OpenStack Neutron](http://ibm-blue-box-help.github.io/help-documentation/neutron/creating-virtual-networks/).

### Direct Link

**Direct Link** is a SoftLayer feature that lets you connect to the SoftLayer private network backbone or network, bypassing the public Internet to connect to your Dedicated cloud(s). It is available in 1Gbps and 10Gbps increments. 

Direct Link can be utilized to create a hybrid cloud, if you want to link your Local cloud to a Dedicated cloud that is running in a SoftLayer data center. More information about Direct Link is available on the [SoftLayer website](http://www.softlayer.com/direct-link).

The most common use of Direct Link is to bring your own IP address to your IBM Bluemix Private Cloud instance. 

## Requesting VPN

In the following cases you need to contact the IBM Bluemix Private Cloud personnel for VPN setup:

If you bring your own SoftLayer IP (BYOIP) to the IBM Bluemix Private Cloud, and want to assign it to your cloud instance, you need either an OpenVPN connection or IPSec tunnel between your customer site and the cloud instance. Open a support ticket and provide the following information:
   
* The SoftLayer IP that you want to assign to your cloud instance
* Your remote-site VPN endpoint
   

If you bring your own floating IP (BYOFIP) to the IBM Bluemix Private Cloud, and want to connect to the cloud instances over the BYOFIP network from your customer site, a tunnel must be established by the IBM Bluemix Private Cloud personnel between the BYOFIP network and the cloud instance. Open a support ticket and provide the following information: 
   
* The floating IP that you would like to bring
* Your remote-site VPN endpoint


## Requesting VLAN

There is very rare chance that you need to orginate a VLAN request deliberately, because this should be a default setup process by IBM Bluemix Private Cloud personnel when they set up the cloud for you. In case there is a need, you can open a support ticket.

## Requesting Direct Link

If you request Direct Link for the purpose of BYOIP, Direct Link can be considered an alternative to the tunnel establised as described in [Requesting VPN](#requesting-vpn). 

To request a Direct Link, prepare the following information and open a support ticket with that included:

* Which SoftLayer Datacenter to connect
* Your remote-site Direct Link endpoint 
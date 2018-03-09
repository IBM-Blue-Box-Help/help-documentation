---
layout: page
title: "Using BYOFIP Connectivity Between IBM Bluemix Private Cloud and a Customer Site"
featured: FALSE
weight: 5
tags: [neutron, byofip]
date: August 12, 2016
author: Xiang Wang
editor: Jillian Tempelmeyer
---

# Using BYOFIP Connectivity Between IBM Bluemix Private Cloud and a Customer Site

## Overview
BYOFIP (Bring Your Own Floating IP) is a feature that lets our IBM customers bring their own floating IPs and set up a BYOFIP network in their IBM Bluemix Private Cloud. By enabling this feature, you'll be able to assign these floating IPs directly to your guest VMs. Then you can connect to the guest VMs over the BYOFIP network from your customer site. Additional fees may apply.

## Request
To request BYOFIP connectivity, please open a support ticket and request that this feature be enabled for your IBM Bluemix Private Cloud. You would need to provide the subnet or subnets that you'd like to bring into your cloud. Then, an IBM engineer sets up the BYOFIP external network and a tunnel endpoint in the Vyattas. This information is passed back to you through the ticket, so you can set up the tunnel endpoint on your end.

## Connecting to a guest VM
After an IBM engineer has confirmed that the feature is turned on, you can connect over the BYOFIP network by performing the following steps on Horizon or by using the command line:
  1. Create a Neutron router with **SNAT enabled**
  2. Set the router gateway to the BYOFIP network
  3. Create a private network
  4. Add an interface on the router to the private network
  5. Create guest VMs on the private network, and ensure that the security group has the proper security rules
  6. Allocate floating IPs from the BYOFIP network
  7. Assign the floating IPs you set up in the previous step to the guest VMs

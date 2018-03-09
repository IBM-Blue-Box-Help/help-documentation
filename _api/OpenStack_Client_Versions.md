---
layout: page
title: Requirements for OpenStack client versions
featured: false
weight: 10
tags: [openstack, client, command line, package, version, python, compatibility]
dateAdded: April 28, 2017
author: Leslie Lundquist
editor: Leslie Lundquist, Niraj Patel
---


## Requirements for OpenStack client versions

When interacting with your IBM Bluemix Private Cloud, it is a best practice to follow the list of suggested package versions for the OpenStack client, as given on the OpenStack website.

Using an unexpected version of `python-openstackclient` can cause problems for the clients interacting with the cloud. The OpenStack website contains a list of requirements with the package compatibility for each release of OpenStack. For example, to review the Newton or Mitaka package requirements, please see these pages:

**Newton:**
https://github.com/openstack/requirements/blob/stable/newton/upper-constraints.txt

**Mitaka:**
https://github.com/openstack/requirements/blob/stable/mitaka/upper-constraints.txt

It’s recommended that you use the versions for OpenStack clients listed in these requirements documents, so that the behavior of your client is predictable when interacting with the cloud.


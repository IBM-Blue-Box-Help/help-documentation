---
layout: page
title:  "Bluemix on OpenStack Components"
featured: true
weight: 1
tags: [getting started, blue box cloud, components]
dateAdded: January 7th, 2016
author: Eric French
---

Bluemix on OpenStack is built on OpenStack and utilizes many of its core components.

_Nova_ provides the computational and scheduling functions of Bluemix on OpenStack.  Nova is used to create, maintain and destroy instances.

_Keystone_ is the identity service that provides authorization and endpoint access to the OpenStack cluster.

_Cinder_ is the service that provides block storage provisioning and connection to instances.

_Glance_ is the image service that stores and provides disk images for instance provisioning.

_Neutron_ is the networking service that provides connectivity between OpenStack instances.

_Swift_ is the service that provides object storage and retrieval.

Most services have many of their common functions available in the Horizon interface.  In addition, each service has a set of API commands, which are discussed in detail in each section.

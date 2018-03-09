---
layout: page
title:  "Bluemix Private Cloud Components"
featured: true
weight: 1
tags: [getting started, bluemix private cloud, components, services, api]
dateAdded: January 7th, 2016
dateUpdated: January 24, 2017
author: Eric French, Leslie Lundquist
---

**IBM Bluemix Private Cloud** is built on OpenStack and utilizes many of its core components.

_Nova_ provides the computational and scheduling functions of Bluemix Private Cloud.  Nova is used to create, maintain and destroy instances.

_Keystone_ is the identity service that provides authorization and endpoint access to the OpenStack cluster.

_Cinder_ is the service that provides block storage provisioning and connection to instances.

_Glance_ is the image service that stores and provides disk images for instance provisioning.

_Neutron_ is the networking service that provides connectivity between OpenStack instances.

_Swift_ is the service that provides object storage and retrieval.

Most services have many of their common functions available in the Horizon interface.  In addition, each service has a set of API commands, which are discussed in detail in each section.

**Specific OpenStack Services Enabled for every IBM Bluemix Private Cloud**

Starting with version 3.0.0, your cloud is based on the OpenStack Mitaka Release and the services listed below. A link to the OpenStack API documentation is provided for each service.

Also, the **OpenStack API QuickStart Guide** might be helpful for getting started: [http://developer.openstack.org/api-guide/quick-start/api-quick-start.html](http://developer.openstack.org/api-guide/quick-start/api-quick-start.html)

 * Block Storage API & Extensions (Cinder v2.0) [http://developer.openstack.org/api-ref/block-storage/index.html](http://developer.openstack.org/api-ref/block-storage/index.html)
 * Compute API & Extensions (Nova v2.1) [http://developer.openstack.org/api-ref/compute/](http://developer.openstack.org/api-ref/compute/)
 * Dashboard (Horizon) API N/A
 * Identity API & Extensions (Keystone v3.0) [http://developer.openstack.org/api-ref/identity/v3/index.html](http://developer.openstack.org/api-ref/identity/v3/index.html)
 * Image Service API (Glance v2.2) [http://developer.openstack.org/api-ref/image/index.html](http://developer.openstack.org/api-ref/image/index.html)
 * Networking API & Extensions (Neutron v2.0, Neutron LBaaS v2) [http://developer.openstack.org/api-ref/networking/v2/index.html](http://developer.openstack.org/api-ref/networking/v2/index.html)
 * Object Storage API & Extensions (Swift v1.0) [http://developer.openstack.org/api-ref/object-storage/](http://developer.openstack.org/api-ref/object-storage/)
 * Orchestration API (Heat v1.0) [http://developer.openstack.org/api-ref/orchestration/index.html](http://developer.openstack.org/api-ref/orchestration/index.html)
 * Telemetry API (Ceilometer v2.0) (plus aodh) [http://docs.openstack.org/developer/ceilometer/webapi/v2.html](http://docs.openstack.org/developer/ceilometer/webapi/v2.html)

You might also wish to evaluate the relative maturity of each OpenStack service we use, from information in the OpenStack Project Navigator. [https://www.openstack.org/software/project-navigator](https://www.openstack.org/software/project-navigator)

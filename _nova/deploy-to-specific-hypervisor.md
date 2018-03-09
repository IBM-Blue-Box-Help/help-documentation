---
layout: page
title:  "How to deploy an instance to a specific hypervisor node"
tags: [nova, deploy, hypervisor, affinity, affinity groups, anti-affinity, antiaffinity]
dateAdded: September 14th, 2015
dateUpdated: February 7, 2017
author: Bluemix Private Cloud Support
editor: Leslie Lundquist
featured: false
weight: 4
---

For **IBM Bluemix Private Cloud 3.0 or newer**, you may receive this error message when targeting a specific compute node:

`Policy doesn't allow os_compute_api:servers:create:forced_host to be performed` 

In that case you will need to use  _group affinity_ and _group antiaffinity_ with server groups to influence scheduling your instance to be deployed close to or away from other instances. Here are two articles that explain how to do that:

https://raymii.org/s/articles/Openstack_Affinity_Groups-make-sure-instances-are-on-the-same-or-a-different-hypervisor-host.html

https://dev.cloudwatt.com/en/blog/affinity-and-anti-affinity-in-openstack.html


**The instructions that follow are for any IBM Bluemix Private cloud older than release 3.0.**

You may have the need to specify the host to which an instance is deployed.  Although this functionality is not available in Horizon, the API in older clouds lets you select a specific compute node for instance deployment.

These instructions assume that you have the OpenStack API configured on your local machine. See [Getting Started with the OpenStack API](http://ibm-blue-box-help.github.io/help-documentation/openstack/api/openstack-api-getting-started/) for assistance.

1. Determine which compute hypervisors are available in your cluster.


		$ nova service-list | grep nova-compute
		|41 | nova-compute  | ds1111 | nova    | enabled | up | 2015-05-15T17:14:56.000000 | -
		|55 | nova-compute  | ds1112 | nova    | enabled | up | 2015-05-15T17:14:56.000000 | -
		|70 | nova-compute  | ds1113 | nova    | enabled | up | 2015-05-15T17:14:56.000000 | -


2. Deploy to the desired compute hypervisor.

   Use the `--availability-zone` flag to specify which hypervisor you would like to generate your instance on. In this example, we would like to deploy our new instance to `ds1111`:


		$ nova boot --flavor 'm1.normal' --image 1e74ae39-8413-426e-9e3a-dcc5dd0704a3 --key-name your_key --security-groups default --availability-zone nova:ds1111 instance_1


<!-- new draft workaround method (works on all cloud versions, but requires extra support on the first 3 commands)

(first 3 commands must be performed by our support team)
nova aggregate-create host3 nova
nova aggregate-set-metadata host3 host3=true
nova aggregate-add-host host3 ds0003

(as soon as the first 3 commands are run, the following commands can be run by the customer to place an instance on a particular host, in this case, "ds0003")
openstack flavor create host3 --id auto --ram 512 --disk 1 --vcpus 1
nova flavor-key host3 set aggregate_instance_extra_specs:host3=true
nova boot --flavor [flavor-ID] --image [image-ID] --nic net-id=94a1c357-4d1d-4586-8971-623992d33ceb ubuntu-host3

-->

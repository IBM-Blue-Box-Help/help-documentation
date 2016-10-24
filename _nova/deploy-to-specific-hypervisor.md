---
layout: page
title:  "How to deploy an instance to a specific hypervisor node"
tags: [nova, deploy, hypervisor]
dateAdded: September 14th, 2015
author: Bluemix on OpenStack Support
editor: Leslie Lundquist
featured: false
weight: 4
---

You may have the need to specify which host an instance is deployed to. While this functionality is not available in Horizon, the API lets you select a specific compute node for instance deployment.

For **IBM Bluemix on OpenStack 3.0 or newer**, you may receive this error message when targeting a specific compute node:

`Policy doesn't allow os_compute_api:servers:create:forced_host to be performed` 

In that case you will need to use  _group affinity_ and _group antiaffinity_ with server groups to influence scheduling your instance to be deployed close to or away from other instances. [Here's an article on that.](https://raymii.org/s/articles/Openstack_Affinity_Groups-make-sure-instances-are-on-the-same-or-a-different-hypervisor-host.html)

[Here's another article.](https://dev.cloudwatt.com/en/blog/affinity-and-anti-affinity-in-openstack.html)


**The instructions that follow are for IBM Bluemix on OpenStack 3.0.0 or _older_.**

These instructions assume that you have the OpenStack API configured on your local machine. See [Getting Started with the OpenStack API](http://ibm-blue-box-help.github.io/help-documentation/openstack/api/openstack-api-getting-started/) for assistance.

1. Determine which compute hypervisors are available in your cluster.


		$ nova service-list | grep nova-compute
		|41 | nova-compute  | ds1111 | nova    | enabled | up | 2015-05-15T17:14:56.000000 | -
		|55 | nova-compute  | ds1112 | nova    | enabled | up | 2015-05-15T17:14:56.000000 | -
		|70 | nova-compute  | ds1113 | nova    | enabled | up | 2015-05-15T17:14:56.000000 | -


2. Deploy to the desired compute hypervisor.

   Use the `--availability-zone` flag to specify which hypervisor you would like to generate your instance on. In this example, we would like to deploy our new instance to `ds1111`:


		$ nova boot --flavor 'm1.normal' --image 1e74ae39-8413-426e-9e3a-dcc5dd0704a3 --key-name your_key --security-groups default --availability-zone nova:ds1111 instance_1


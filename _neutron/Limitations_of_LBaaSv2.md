---
layout: page
title: Limitations of Neutron LBaaS v2
author: Blue Box Support
editor: Leslie Lundquist
tags: [neutron, lbaas, limitations, haproxy, maxconn, security group]
dateAdded: September 27, 2016
---

The goal of exposing Neutron LBaaS v2 in IBM Bluemix Private Cloud is two-fold:

 * to provide a consistent LBaaS API as we approach Octavia integration, and
 * to provide a short-term solution for customers who need LBaaS.

This document briefly covers some specific limitations and possible workarounds for Neutron LBaaS v2. *It is extremely important to make these limitations known to customers as part of the pre-sales process.*

For more information about Known Limitations, please refer to the IBM Bluemix Private Cloud [3.0.0 Release Notes](http://ibm-blue-box-help.github.io/help-documentation/gettingstarted/commontech/Customer_3.0.0_Release_Notes/), particularly the section on **Known Limitations**.

1) Security Group Configuration is missing from Neutron-LBaaSv2 in Horizon, and new Load Balancers (LBs) are assigned to the default security group, which usually is locked down (appropriately!). Therefore, customers need to create their own LBaaS-specific security group + rules and assign it to the LB port. You can add the appropriate security group to the Load Balancer's port, following the documentation at http://docs.openstack.org/liberty/networking-guide/adv-config-lbaas.html

2) Heat configuration of Neutron-LBaaSv2 security group rules is not available. (That is, Heat doesn't allow a security group to be associated with a Load Balancer or port.) There is a blueprint for adding this feature, but currently it has not been accepted and there is no timeline for implementation. You can subscribe to the blueprint if you want to track future developments: https://blueprints.launchpad.net/heat/+spec/add-security-group-to-port As a workaround, you can write a script that assigns the right security group to the Load Balancers, and run it after the Heat deployment.

3) TLS Termination: The IBM Bluemix Private Cloud LBaaS v2 implementation does not currently support TLS termination.

4) No granular configuration of global HAproxy configuration variables such as global `maxconn`, and so forth. If customers want that, they should use HAproxy on the instances themselves, and skip Neutron-LBaaSv2.

5) How do I build and test a Neutron Load Balancer via the command line? See http://docs.openstack.org/liberty/networking-guide/adv-config-lbaas.html **Building an LBaaS v2 Load Balancer**

6) LBaaS Namespace Driver HA: Presently, the namespace driver lacks API calls to migrate between agents — which was the way Blue Box provided HA for the DHCP and L3 agents prior to their native HA support (Bluemix Private Cloud 3.0).

 * Customers should consider deploying multiple load balancers and using DNS round-robin to provide limited HA.
 * Customers must otherwise build HA options into their applications, such as failback strategies in a service-oriented architecture, in order to use this capability as part of a larger application.

 7) Dedicated Controller nodes (not Converged Controllers) are required to use LBaaS.

 8) If a member of a load balancer pool goes down, there is no known way to check the status of the member via the Neutron LBaaSv2 API.  See https://bugs.launchpad.net/neutron/+bug/1596709 for more details on this.  There is also no way (yet), via the Neutron LBaaSv2 API, to check the status of error codes returned by the load balancer health monitors.

 9) The OpenStack client `openstack` does not support LBaaSv2 operations yet, see [Transition to OpenStack Client](https://docs.openstack.org/developer/python-neutronclient/devref/transition_to_osc.html) for the current progress. Before the transition is done, the `neutron` client remains the only choice. To suppress any deprecation warnings, add `2> /dev/null` to the end of the command.


### Performance Limitations
The LBaaS v2 namespace driver should perform in line with other software-based load balancers. Any software forwarding solution (LBaaS or Neutron L3 Agent) will have some performance limitations.

The current implementation is not appropriate as a front-end for a high-traffic web service. Sites receiving 10,000 hits per hour should run smoothly, whereas sites receiving higher rates of traffic may require a hardware solution to overcome performance limitations.

**Addressing performance issues**

Performance is difficult to project in software load balancer solutions. Simply scaling up infrastructure is not necessarily the answer, because more CPU and RAM won’t necessarily help.

In addition to understanding the number of concurrent connections required, it also is critical to understand the detail around the characteristics of those connections:

 * How many concurrent connections must be maintained?
 * How long must they be maintained?
 * How many new connections are being received each second?

**Infrastructure Solutions**

Faster, specialized memory (TCAM vs DRAM) often is required to address performance issues. Detail:

 * For customers with 200,000+ concurrent connections, TCAM memory is preferred.
 * Characterise the types of connections. (For example, do you have many idle connections, or active connections? How many packets per second?)
  * idle connections: you may be able to increase limits to support these. But why are there so many idle connections?
  * active connections: for even one packet per second, the solutions would lean toward hardware.

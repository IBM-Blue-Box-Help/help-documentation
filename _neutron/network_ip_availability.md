---
layout: page
title: How Can I Check My Network IP Availability?
featured: false
weight: 3
tags: [neutron, IP, availability]
dateAdded: August 4, 2016
dateUpdated: January 4, 2017
author: Leslie Lundquist, Ulysses Kanigel
---

In OpenStack Mitaka and newer, availability commands let you check the availability of IPs more easily.

### Floating IP Pool Availability

**Q.** How can I check to see how many floating IPs are left in my availability pool? 

**A.** There’s an API call and a client call for resource allocation reporting:

```
> neutron net-ip-availability-list
```
This command gives information about how many floating IPs are used, and how many are still available, of these “consumables.” It returns information something like this (example networks):

```
+--------------------------------------+----------------------------------------------------+-----------+----------+
| network_id                           | network_name                                       | total_ips | used_ips |
+--------------------------------------+----------------------------------------------------+-----------+----------+
| 07f4db1a-14a4-4591-a8d8-d9c9e9b79fb6 | external                                           |        29 |        6 |
| 8e1594ed-305a-4e6b-b70e-b04059546ee8 | HA network tenant 5c3fd55db4f54096bd348f9774cea4c9 |     16382 |        2 |
| 6c8f7106-7d6a-4204-9a0e-372a8b7b7ed8 | internal                                           |      2042 |       10 |
| e33c63e6-ee7c-40a5-915a-29e7a625e731 | HA network tenant 758ff559d5df4960b0fe5d3dbd239997 |     16382 |        2 |
+--------------------------------------+----------------------------------------------------+-----------+----------+
```

**Aside:** Why are networks and subnets called "**HA network tenant xyz**" created?

The networks with names that include the phrase "HA network" host the High Availability network for a project.  One HA network is used per project, and all HA router ports are created on this network.  This arrangement allows failover to work if one of your network nodes goes down.  You can read more about this topic at:

 * [http://docs.openstack.org/mitaka/networking-guide/scenario-l3ha-lb.html](http://docs.openstack.org/mitaka/networking-guide/scenario-l3ha-lb.html)

 * [https://review.openstack.org/gitweb?p=openstack/neutron.git;a=blob;f=neutron/db/l3_hamode_db.py](https://review.openstack.org/gitweb?p=openstack/neutron.git;a=blob;f=neutron/db/l3_hamode_db.py)

You'll note that HA networks and subnets have an associated project, but the association is done in a non-obvious way: 

The `project_id` is shown to the right of word "tenant" in the `network_name`. But the `project_id` associated with the network itself is left blank.

Back to **floating IPs**: To get even more information about floating IPs, you can use another command, shown below, which provides the CIDR and more details about IPs that are in use:

```
> neutron net-ip-availability-show internal
```

This command returns output something similar to this example:

```
+------------------------+-------------------------------------------------------------------------------------------------+
| Field                  | Value                                                                                           |
+------------------------+-------------------------------------------------------------------------------------------------+
| network_id             | 6c8f7106-7d6a-4204-9a0e-372a8b7b7ed8                                                            |
| network_name           | internal                                                                                        |
| subnet_ip_availability | {"used_ips": 8, "subnet_id": "ddf06c18-8de9-4f59-ad38-f29831931ad3", "subnet_name": "internal", "ip_version": 4, "cidr":               |
|                        | "192.168.0.0/22", "total_ips": 1021}                                                            |
|                        | {"used_ips": 2, "subnet_id": "f3f651ca-8ef0-4f86-a802-2370d147cd14", "subnet_name": "test-external", "ip_version": 4, "cidr":          |
|                        | "169.46.132.0/22", "total_ips": 1021}                                                           |
| tenant_id              | 758ff559d5df4960b0fe5d3dbd239997                                                                |
| total_ips              | 2042                                                                                            |
| used_ips               | 10                                                                                              |
+------------------------+-------------------------------------------------------------------------------------------------+
```

### Internal and External Network IP Availability

**Q. How can I find out how many IPs I have left, and what IP ranges are currently available?**

**A. You can follow the examples below to find your current IP ranges and availability:**

First, find the `network_id` for each of the networks using the `neutron net-list` command with `egrep` as shown below: 

(The values returned here are example networks.)
```
> neutron net-list | egrep "external|internal"
| 0d13276b-c364-443a-9217-4af45e9e38f1 | external     | #this is the external network_id
46f82bc8-d180-46dd-9914-8733eddae793 159.122.122.160/27 | #this is the subnet_id for the external network
| ef5fb554-5e9b-4ab6-9fb4-0711c3c91e39 | internal  |   #this is the internal network_id
75f80035-fed4-4e17-9b2f-ab76143f95eb 192.168.0.0/22     | #this is the subnet_id for the internal network
```

Next, enter the `network_id` of the external network to find available IPs there:

```
> neutron net-ip-availability-show 0d13276b-c364-443a-9217-4af45e9e38f1
```
You will get back output something like this one:

```
+——————————---—---------—+————————————————————————————————————————————————————----—————+
| Field                  |      Value                                                  |
+—————————--------------—+---—————————————————————————————————————————————————————-————+
| network_id             | 0d13276b-c364-443a-9217-4af45e9e38f1                        |
| network_name           | external                                                    |
| subnet_ip_availability | {"used_ips": 2, "subnet_id": "46f82bc8-d180-46dd-9914-8733eddae793", "subnet_name": "external", "ip_version": 4, |
|                        | "cidr": "159.122.122.160/27", "total_ips": 29}              |
| tenant_id              | 0a75d5b865224f1d8bcbf4fb59153c49                            |
| total_ips              | 29                                                          |
| used_ips               | 2                                                           |
+------------------------+------------------------------------------------------------------------------------------------+
```
Next, enter the `network_id` of the internal network to find availability there:

```
> neutron net-ip-availability-show ef5fb554-5e9b-4ab6-9fb4-0711c3c91e39
```

You will get back a response similar to this one:

```
+------------------------+-------------------------------------------------------------------------------------------------+
| Field                  | Value                                                                                           |
+------------------------+-------------------------------------------------------------------------------------------------+
| network_id             | ef5fb554-5e9b-4ab6-9fb4-0711c3c91e39                                                            |
| network_name           | internal                                                                                        |
| subnet_ip_availability | {"used_ips": 3, "subnet_id": "75f80035-fed4-4e17-9b2f-ab76143f95eb", "subnet_name": "internal", "ip_version": 4, |
|                        | "cidr": "192.168.0.0/22", "total_ips": 1021}                                                    |
| tenant_id              | 0a75d5b865224f1d8bcbf4fb59153c49                                                                |
| total_ips              | 1021                                                                                            |
| used_ips               | 3                                                                                               |
+------------------------+-------------------------------------------------------------------------------------------------+
```

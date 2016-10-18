---
layout: page
title: "How Can I See My IPs?"
featured: false
weight: 5
tags: [neutron, external ip, internal ip, available ip]
author: Bluemix on OpenStack Support
dateAdded: August 4, 2016
---

**Q. How do I know how many IPs I have left, and what IP ranges are currently available?**

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
You will get back something like this:

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

You will get back something like this:

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

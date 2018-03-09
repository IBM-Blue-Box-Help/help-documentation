---
layout: page

title: Where Are the First Two IPs?

keywords: [neutron, IP, gateway, available]

author: Ulysses Kanigel

editor: Leslie Lundquist

dateAdded: August 25, 2016

featured: false

weight: 7
---

**Q.** When I ran this command:

`neutron net-ip-availability-show` 

on my network to find out how many IPs I have available, I found that 29 were allocated to my project, but I wasn't able to use the first two IPs. Why?

**A.** The first two IPs are reserved for the the **gateway IP** and the **fixed IP** assigned to your `router_gateway` port, respectively. Specifically, in this example:

```
# neutron net-ip-availability-show 0d13276b-c364-443a-9217-4af45e9e38f1
+------------------------+----------------------------------------------------------------------------------------------------------------------------------------+
| Field                  | Value                                                                                                                                  |
+------------------------+----------------------------------------------------------------------------------------------------------------------------------------+
| network_id             | 0d13276b-c364-443a-9217-4af45e9e38f1                                                                                                   |
| network_name           | external                                                                                                                               |
| subnet_ip_availability | {"used_ips": 29, "subnet_id": "46f82bc8-d180-46dd-9914-8733eddae793", "subnet_name": "external", "ip_version": 4, "cidr":              |
|                        | "153.122.122.160/27", "total_ips": 29}                                                                                                 |
| tenant_id              | 0a75d5b865224f1d8bcbf4fb59153c49                                                                                                       |
| total_ips              | 29                                                                                                                                     |
| used_ips               | 29                                                                                                                                     |
+------------------------+----------------------------------------------------------------------------------------------------------------------------------------+
```

 * `153.122.122.161` is reserved as the gateway IP for your external subnet of `153.122.122.160/27`. It is also the Horizon IP.
 * `153.122.122.162` is reserved as the fixed IP assigned to your `router_gateway` port. This address is used to test the reachability of your Neutron router.
	
	
These two IPs are essential to the operation of your OpenStack network and are unavailable for use by instances.

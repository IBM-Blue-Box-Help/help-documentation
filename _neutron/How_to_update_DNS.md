---
layout: page
title: "How Can I Update DNS?"
featured: false
weight: 5
tags: [neutron, DNS settings, subnet ]
author: Blue Box Support
dateAdded: September 13, 2016
---

**Q.** What Neutron commands could I use to update my DNS servers?

**A.** Here’s how to update the DNS settings in the `internal-new` subnet, to these DNS server addresses:

```
IPV4
DNS server1 = 192.168.10.1
DNS server2 = 192.168.10.2
DNS server3 = 8.8.8.8

root@ds00:~# neutron subnet-update aa4538ec-e838-4314-9159-4e9b6608cc39 --dns-nameserver 192.168.10.1 --dns-nameserver 192.168.10.2 --dns-nameserver 8.8.8.8
Updated subnet: aa4538ec-e838-4314-9159-4e9b6608cc39
root@ds00:~# neutron subnet-show aa4538ec-e838-4314-9159-4e9b6608cc39
+-------------------+------------------------------------------------------+
| Field             | Value                                                |
+-------------------+------------------------------------------------------+
| allocation_pools  | {"start": "192.168.228.2", "end": "192.168.231.254"} |
| cidr              | 192.168.228.0/22                                     |
| description       |                                                      |
| dns_nameservers   | 192.168.10.1                                         |
|                   | 192.168.10.2                                         |
|                   | 8.8.8.8                                              |
| enable_dhcp       | True                                                 |
| gateway_ip        | 192.168.228.1                                        |
| host_routes       |                                                      |
| id                | aa4538ec-e838-4314-9159-4e9b6608cc39                 |
| ip_version        | 4                                                    |
| ipv6_address_mode |                                                      |
| ipv6_ra_mode      |                                                      |
| name              | internal-new                                         |
| network_id        | 635183cd-2ef7-47f0-9cf4-c9f1632bae74                 |
| subnetpool_id     |                                                      |
| tenant_id         | 4739bb789f704fd28a6780ebabdbfe80                     |
+-------------------+------------------------------------------------------+

```

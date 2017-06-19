---
layout: page
title: "When creating port failed, how could I do ?"
featured: false
weight: 5
tags: [neutron]
author: Blue Box Support
dateAdded: June 19, 2017
---

**Q.** When creating port failed in some network, how could I do ?

**A.** 

Usually the first step is to gather the neutron network detail info which you are using with command `neutron net-show $networkId`.

```
+---------------------------+--------------------------------------+
| Field                     | Value                                |
+---------------------------+--------------------------------------+
| admin_state_up            | True                                 |
| availability_zone_hints   |                                      |
| availability_zones        | nova                                 |
| created_at                | xxxx-xx-xxTxx:xx:xx                  |
| description               |                                      |
| id                        | 83d4d436-6a3c-498d-baf0-f5eb60c3c3dc |
| ipv4_address_scope        |                                      |
| ipv6_address_scope        |                                      |
| mtu                       | 1500                                 |
| name                      | internal                             |
| port_security_enabled     | True                                 |
| provider:network_type     | vxlan                                |
| provider:physical_network |                                      |
| provider:segmentation_id  | 2                                    |
| router:external           | False                                |
| shared                    | False                                |
| status                    | ACTIVE                               |
| subnets                   | 0294a7f7-c0ab-48d4-b30a-3702c61099ab |
| tags                      |                                      |
| tenant_id                 | 55549544de6a4270ac5f3104eb422a56     |
| updated_at                | xxxx-xx-xxTxx:xx:xx                  |
+---------------------------+--------------------------------------+
```

When you find section `shared` is False, this means you could only create ports with the same tenant as the network.
  Please verify the tenant you are using with the tenant showed in network section `tenant_id`.

If you find the network tenant is `admin` and section `shared` is False, please contact IBM Bluemix Private Cloud support for
  help. They will help to adjust the network `shared` to True, which will allow other projects use the network.
---
layout: page
title: "Introduction to Load Balancer as a Service (LBaaS)"
featured: false
weight: 6
tags: [neutron, lbaas, delete, healthmonitor]
author: Leslie Lundquist
dateAdded: June 16, 2016
dateUpdated: February 22, 2017
---

The OpenStack Networking Service, Neutron, includes a Load Balancer as a Service (LBaaS). This service lets you configure a load balancer that runs outside of your instances and directs traffic to your instances. A common use case occurs when you want to use multiple instances to serve web pages and you also want to meet high performance or availability goals. OpenStack LBaaS v2 in Mitaka allows for multiple ports (called _listeners_) per load balancer.

The following links give a lot more information about the LBaaS v2 features in OpenStack Mitaka release, including **Installation and Configuration** instructions:
 
 * http://docs.openstack.org/developer/openstack-ansible/install-guide/configure-lbaas.html
 * http://docs.openstack.org/mitaka/networking-guide/adv-config-lbaas.html

**Specs:**

 * https://specs.openstack.org/openstack/neutron-specs/specs/kilo/lbaas-api-and-objmodel-improvement.html
 * https://specs.openstack.org/openstack/heat-specs/specs/mitaka/lbaasv2-support.html

**API:**

 * http://developer.openstack.org/api-ref-networking-v2-ext.html#lbaas-v2.0

The reference implementation of LBaaS, called Octavia, also provides some helpful documentation.

 * http://docs.octavia.io/review/master/index.html#

**Limitations:**

See http://ibm-blue-box-help.github.io/help-documentation/neutron/Limitations_of_LBaaSv2/

**How do you delete a load balancer instance via the command line?**

To delete a load balancer, you must first remove the objects associated with it.  Here's an example:

```
# neutron lbaas-loadbalancer-show 9db42cc4-8c7b-4641-9454-f8e2ec2fe494 | egrep "pools|listeners|id"
| id                  | 9db42cc4-8c7b-4641-9454-f8e2ec2fe494           |
| listeners           | {"id": "966eeb93-8062-4340-bb82-473a10206517"} |
| pools               | {"id": "dad502f3-fb9f-4f53-ac0e-57c1217e68c7"} |
| tenant_id           | 90124d2dfcbf46c5a6794b3602aba9f6               |

# neutron lbaas-listener-delete 966eeb93-8062-4340-bb82-473a10206517
Deleted listener: 966eeb93-8062-4340-bb82-473a10206517

# neutron lbaas-pool-show dad502f3-fb9f-4f53-ac0e-57c1217e68c7 | grep healthmonitor_id
| healthmonitor_id    | c3a3c32f-96d0-4744-9957-5947c9fe93cd           |

# neutron lbaas-healthmonitor-delete c3a3c32f-96d0-4744-9957-5947c9fe93cd
Deleted healthmonitor: c3a3c32f-96d0-4744-9957-5947c9fe93cd

# neutron lbaas-member-list dad502f3-fb9f-4f53-ac0e-57c1217e68c7
+--------------------------------------+------+-------------+---------------+--------+--------------------------------------+----------------+
| id                                   | name | address     | protocol_port | weight | subnet_id                            | admin_state_up |
+--------------------------------------+------+-------------+---------------+--------+--------------------------------------+----------------+
| 89d5a55a-a2ac-41e7-b903-42ce8d32cefd |      | 172.16.4.86 |          8443 |      1 | fabede1c-32ab-43b4-ba76-6b1abade0eb4 | True           |
+--------------------------------------+------+-------------+---------------+--------+--------------------------------------+----------------+

# neutron lbaas-member-delete 89d5a55a-a2ac-41e7-b903-42ce8d32cefd dad502f3-fb9f-4f53-ac0e-57c1217e68c7
Deleted member: 89d5a55a-a2ac-41e7-b903-42ce8d32cefd

# neutron lbaas-pool-delete dad502f3-fb9f-4f53-ac0e-57c1217e68c7
Deleted pool: dad502f3-fb9f-4f53-ac0e-57c1217e68c7

# neutron lbaas-loadbalancer-delete 9db42cc4-8c7b-4641-9454-f8e2ec2fe494
Deleted loadbalancer: 9db42cc4-8c7b-4641-9454-f8e2ec2fe494
```

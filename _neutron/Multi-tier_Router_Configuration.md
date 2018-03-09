---
layout: page
title: Multi-tier Router Configuration Within Your IBM Bluemix Private Cloud
tags: [neutron, networking, router, configuration, multi-tier, add_interface]
author: Ulysses Kanigel and Leslie Lundquist
dateAdded: August 31, 2016
weight: 4
featured: false
---

This article explains how to test a Multi-Tier Router Configuration, and why you might want one.

You might want to set up a multi-tier router configuration for your cloud in one of these use cases:

1. You want to prevent hosts on these (child) subnets from using floating IPs.
2. You want to create network isolation for these (child) networks from other project or tenant networks within your cloud, by giving each its own (child) router underneath the main router.
3. You need each of these isolated project networks to have internet ingress and egress, while remaining isolated from other networks within your cloud, and also not using floating IPs.

The way to establish a multi-tier network initially is to establish static routes from the main router to each of the "child" routers. The main idea of this test is to be sure that these static routes are persistent. In this example, we set up two child networks of this type, called `child-net1` and `child-net2`.

![The multi-tier network topology]({{site.baseurl}}/img/multi_router_network.png)

Let's say you want to test a multi-tier router configuration and confirm that the routes you've set up are persistent across failover.

**Here are the steps you'd need to take to perform the test:**

```

#Create networks and subnets

neutron net-create parent-net

neutron net-create child-net1

neutron net-create child-net2

neutron subnet-create parent-subnet 162.16.0.0/24

neutron subnet-create child-subnet1 162.16.1.0/24

neutron subnet-create child-subnet2 162.16.2.0/24

# Create routers

neutron router-create parent-router

neutron router-create child-router1

neutron router-create child-router2

# Set gateway of the parent router to the external network and add interface on the parent-router subnet

neutron router-gateway-set parent-router external

neutron router-interface-add parent-subnet b490f691-364f-4f7c-866c-1c45e7b8f8cf  #unique identifier for subnet

# Add interfaces for parent-router, child-router1 and child-router2 subnets

neutron port-create parent-router

neutron port-create child-router1

neutron port-create child-router2

neutron router-interface-add child-subnet1 port=c1b305a1-f634-4828-a6ce-d5a6a058824e  #unique identifier for port

neutron router-interface-add child-subnet1 2476ad51-e2cb-4d4e-bbd8-db18cc06ea88   #unique identifier for subnet

neutron router-interface-add child-subnet2 port=c1b467b1-f444-4325-a5dc-d4b3a04624d   #unique identifier for port

neutron router-interface-add child-subnet2 2378ad51-e4cc-2d3e-bcc5-db34cd05fa48    #unique identifier for subnet

# Set default route on child router(s) to parent-router subnet gateway address : they both talk to the parent router

neutron router-update child-router1 --routes type=dict list=true destination=0.0.0.0/0,nexthop=162.16.0.1

neutron router-update child-router2 --routes type=dict list=true destination=0.0.0.0/0,nexthop=162.16.0.1

```

**Here are the test results before router failover:**

```
root@ds0:~# ip netns exec qrouter-0937dbb1-1f57-41b4-958e-326db5df1786 ip route

default via 162.16.0.1 dev qr-c1b305a1-f6

163.254.0.0/24 dev ha-b7929778-61  proto kernel  scope link  src 163.254.0.3

163.254.192.0/18 dev ha-b7929778-61  proto kernel  scope link  src 163.254.192.7

162.16.0.0/24 dev qr-c1b305a1-f6  proto kernel  scope link  src 162.16.0.4

162.16.1.0/24 dev qr-9fab4ce0-54  proto kernel  scope link  src 162.16.1.1

162.16.2.0/24 dev gr-XXXXXXXXXX proto kernel  scope link src 162.16.2.1

root@ds0:~# ip netns exec qrouter-0937dbb1-1f57-41b4-958e-326db5df1786 ping 8.8.8.8

PING 8.8.8.8 (8.8.8.8) 56(84) bytes of data.

64 bytes from 8.8.8.8: icmp_seq=1 ttl=58 time=1.47 ms

64 bytes from 8.8.8.8: icmp_seq=2 ttl=58 time=1.41 ms

64 bytes from 8.8.8.8: icmp_seq=3 ttl=58 time=1.39 ms

^C

--- 8.8.8.8 ping statistics ---

3 packets transmitted, 3 received, 0% packet loss, time 2003ms

rtt min/avg/max/mdev = 1.391/1.429/1.477/0.035 ms

```

**And after failover:**

```

# ip netns exec qrouter-0937dbb1-1f57-41b4-958e-326db5df1786 ip route

default via 162.16.0.1 dev qr-c1b305a1-f6

163.254.0.0/24 dev ha-51f886ac-f1  proto kernel  scope link  src 163.254.0.3

163.254.192.0/18 dev ha-51f886ac-f1  proto kernel  scope link  src 163.254.192.6

162.16.0.0/24 dev qr-c1b305a1-f6  proto kernel  scope link  src 162.16.0.4

162.16.1.0/24 dev qr-9fab4ce0-54  proto kernel  scope link  src 162.16.1.1

162.16.2.0/24 dev gr-XXXXXXXXXX proto kernel  scope link src 162.16.2.1

# ip netns exec qrouter-0937dbb1-1f57-41b4-958e-326db5df1786 ping 8.8.8.8

PING 8.8.8.8 (8.8.8.8) 56(84) bytes of data.

64 bytes from 8.8.8.8: icmp_seq=1 ttl=58 time=1.67 ms

64 bytes from 8.8.8.8: icmp_seq=2 ttl=58 time=1.60 ms

64 bytes from 8.8.8.8: icmp_seq=2 ttl=58 time=1.62 ms
^C

--- 8.8.8.8 ping statistics ---

3 packets transmitted, 3 received, 0% packet loss, time 1001ms

rtt min/avg/max/mdev = 1.601/1.635/1.670/0.053 ms
```

There should be no problems with scaling this design up to include multiple subnets connected to each child router, because the routing is achieved at the child router. 

Note: Remember that any instances that are connected to a child router will not be able to have floating IPs associated to them, because that child router is not directly connected to the external network.

**Troubleshooting: Error: Failed to add_interface:**

You might get this error if you try to attach an interface to tenant-A-router for a tenant-B-network:
`Error: Failed to add_interface: Request Failed: internal server error while processing your request.`

Our Neutron policy actually does permit adding a router interface to users with `admin`, `cloud_admin`, or `project_admin` roles, but it fails because the Neutron API is explicitly coded to disallow operations on resources owned by tenants other than the one you are authenticated to, unless you have the `admin` role, as reflected in this code:

https://github.com/openstack/neutron/blob/stable/mitaka/neutron/api/v2/attributes.py#L971

If you need a network from one tenant attached to a router in a different tenant, the support team will need to perform that operation on your behalf.  Please provide the CLI command you are trying to run that throws the error and we will run it for you.

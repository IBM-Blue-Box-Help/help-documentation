---
layout: page
title: Multi-tier Router Configuration Within Your IBM Blue Box Cloud
tags: [neutron, networking, router, configuration, multi-tier]
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

The way to establish a multi-tier network initially is to establish static routes from the main router to each of the "child" routers. The main idea of the test is to be sure that these static routes are persistent. In this example, we set up two networks of this type, called `test1` and `test2`.

![The multi-tier network topology]({{site.baseurl}}/img/multi_router_network.png)

Let's say you want to test a multi-tier router configuration and confirm that the routes you've set up are persistent across failover.

**Here are the steps you'd need to take to perform the test:**

```

#Create networks and subnets

neutron net-create test1

neutron net-create test2

neutron subnet-create test1 162.16.0.0/24

neutron subnet-create test2 162.16.1.0/24

# Create routers

neutron router-create test-router1

neutron router-create test-router2

# Set gateway of the parent router to the external network and add interface on test1 subnet

neutron router-gateway-set test-router1 external

neutron router-interface-add test-router1 b490f691-364f-4f7c-866c-1c45e7b8f8cf

# Add interfaces for test1 and test2 subnets to child router

neutron port-create test1

neutron router-interface-add test-router2 port=c1b305a1-f634-4828-a6ce-d5a6a058824e

neutron router-interface-add test-router2 2476ad51-e2cb-4d4e-bbd8-db18cc06ea88

# Set default route on child router to test1 subnet gateway address

neutron router-update test-router2 --routes type=dict list=true destination=0.0.0.0/0,nexthop=162.16.0.1

```

**Here are the test results before router failover:**

```

root@ds0:~# ip netns exec qrouter-0937dbb1-1f57-41b4-958e-326db5df1786 ip route

default via 162.16.0.1 dev qr-c1b305a1-f6

163.254.0.0/24 dev ha-b7929778-61  proto kernel  scope link  src 163.254.0.3

163.254.192.0/18 dev ha-b7929778-61  proto kernel  scope link  src 163.254.192.7

162.16.0.0/24 dev qr-c1b305a1-f6  proto kernel  scope link  src 162.16.0.4

162.16.1.0/24 dev qr-9fab4ce0-54  proto kernel  scope link  src 162.16.1.1

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

# ip netns exec qrouter-0937dbb1-1f57-41b4-958e-326db5df1786 ping 8.8.8.8

PING 8.8.8.8 (8.8.8.8) 56(84) bytes of data.

64 bytes from 8.8.8.8: icmp_seq=1 ttl=58 time=1.67 ms

64 bytes from 8.8.8.8: icmp_seq=2 ttl=58 time=1.60 ms

^C

--- 8.8.8.8 ping statistics ---

2 packets transmitted, 2 received, 0% packet loss, time 1001ms

rtt min/avg/max/mdev = 1.601/1.635/1.670/0.053 ms

```

There should be no problems with scaling this design up to include multiple subnets connected to each child router, because the routing is achieved at the child router. 

Note: Remember that any instances that are connected to a child router will not be able to have floating IPs associated to them, because that child router is not directly connected to the external network.

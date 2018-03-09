---
layout: page
title: Why Can't I Ping Across My Tenant Networks?
featured: no
weight: 10
author: Chris Wheeler, Leslie Lundquist
dateAdded: May 24, 2016
---

### Network Troubleshooting Example: Unable to Ping Across Tenant Networks


**Q.** I have created my own network (`private_network`) with a subnet (`private_subnet`). I have also created a router (`my_router`) to connect this network to the existing internal network. However, instances attached to `private_network` are not able to ping instances on the internal network. They can ping the gateway IP address (10.0.0.1) and they can ping the IP address of the interface for the internal network on the router (192.168.1.113)... but they cannot ping any instances on the internal network. I am able to ping in the other direction, that is, from instances on the internal network to instances on the `private_network`... just not the other way around.

These are the commands (as best I can remember them) that I ran to create the relevant components in OpenStack:

1. `neutron net-create private_network`
2. `neutron subnet-create private_network --name private_subnet --gateway 10.0.0.1 10.0.0.0/24`
3. `neutron router-create my_router`
4. `neutron router-interface-add my_router private_subnet`
5. `neutron port-create internal`
6. `neutron router-interface-add my_router port=`

I needed to manually create an extra port on the internal network to connect the router to, because a router is already connected to it.

**A.** The problem with simply adding an interface from the internal network on `my_router` is that instances on the internal network have a default gateway of 192.168.0.1, which is on the default router, and the default router doesn't know how to route back to `private_network`.

In addition to adding ports from the opposite subnet to each router, you would need to add routes so that they can route in both directions...
```
neutron router-update default --routes type=dict list=true destination=10.0.0.0/24,nexthop=10.0.0.1
neutron router-update my_router --routes type=dict list=true destination=192.168.0.0/22,nexthop=192.168.0.1
```

**Q.** Attempting to execute the first command failed with the following error:
```
Invalid format for routes: [{u'destination': u'10.0.0.0/24', u'nexthop': u'10.0.0.1'}], the nexthop is not connected with router
```
I needed to modify the command in order to run it successfully, as shown below, where `192.168.1.119` is the port that I created on the internal network to attach `my_router` to.

```
neutron router-update default --routes type=dict list=true destination=10.0.0.0/24,nexthop=192.168.1.119
```

It turns out that this is enough to allow traffic to flow from instances connected to the `private_network` to instances connected to the internal network. However, it does appear that this configuration occurs an additional hop for network traffic, that is, traffic is first routed to the default gw (192.168.0.1) and then redirected to 192.168.1.119. I can see this if I ping an instance on the `private_network` from an instance on the internal network:
```
ubuntu@test:~$ ping 10.0.0.13
PING 10.0.0.13 (10.0.0.13) 56(84) bytes of data.
64 bytes from 10.0.0.13: icmp_seq=1 ttl=63 time=0.783 ms
From 10.0.0.13: icmp_seq=2 Redirect Host(New nexthop: 10.0.0.13)
64 bytes from 10.0.0.13: icmp_seq=2 ttl=63 time=0.624 ms
From 10.0.0.13: icmp_seq=3 Redirect Host(New nexthop: 10.0.0.13)
```

It would appear that a better approach is simply to manually add a route to each host on the internal network using our ansible scripts, as follows:
```
route add -net 10.0.0.0/24 gw 192.168.1.119
```

The next problem that I hit with this configuration is that the instances on the `private_network` are not able to connect to the public Internet via the internal network, for example, I am not able to ping 8.8.8.8. Would you happen to know why this is and what I need to do to enable it?

Oh, I forgot to mention that the error message when attempting to ping a host on the public internet is `"destination net unreachable"`, which suggests that the request is getting as far as the gateway (10.0.0.1) but it does not know how to route the request on.

**A.** You are correct that routing through `my_router` to get to the internal network incurs another network hop, but the impact is likely to be negligible. Adding static routes on every instance would eliminate that hop, but add a good deal of administrative overhead and many potential points of failure. Given the preference, I would recommend maintaining the routes at the router level.

As for why the instances on `private_network` not being able to reach the Internet, this is because the router has no external gateway set (see `external_gateway_info`)...

```
root@ds0006:~# neutron router-show the_router
+-----------------------+-------------------------------------------------------------+
| Field                 | Value                                                       |
+-----------------------+-------------------------------------------------------------+
| admin_state_up        | True                                                        |
| distributed           | False                                                       |
| external_gateway_info |                                                             |
| ha                    | True                                                        |
| id                    | af23ae89-3a13-43cd-a6cd-f919f7c03a64                        |
| name                  | my_router                                                 |
| routes                | {"destination": "192.168.0.0/16", "nexthop": "192.168.0.1"} |
| status                | ACTIVE                                                      |
| tenant_id             | 61471bdea08844478c1341ab39b4929a                            |
+-----------------------+-------------------------------------------------------------+
```

If you run `neutron router-gateway-set the_router external` it will allocate a floating IP to the router and allow it to reach the outside world.

**Q.** The lack of an external gateway on the `my_router` was intentional. We would like to "hide" the `private_network` as much as possible from the outside world. We were hoping to be able to route traffic destined for the public internet via the default router, which already has an external gateway configured. Do you know if this is possible and, if it is, are you able to tell us how to achieve this?

**A.** It may be possible to add a default router to `my_router` like so:
```
neutron router-update my_router --routes type=dict list=true destination=0.0.0.0/0,nexthop=192.168.0.1
```

This would effectively provide the same functionality as a router connected directly to the external network, minus the ability to allocate floating IPs. It would be more flexible to connect the router directly to the external network and control access by only allocating floating IPs to instances that need to be accessed from the internet, and use security group rules to protect different server "zones" from each other.

I have confirmed that setting the default route on a router that is not attached to the external network to point to the IP of the default router will allow it to route out to the Internet. Here is what it looks like in our lab environment:

```
root@ds0095:~# neutron router-port-list clwtest
+--------------------------------------+-------------------------------------------------+-------------------+-------------------------------------------------------------------+
| id                                   | name                                            | mac_address       | fixed_ips                                                         |
+--------------------------------------+-------------------------------------------------+-------------------+-------------------------------------------------------------------+
| 2a297ee9-58fa-4521-bde7-a5a1aaf0c54b | HA port tenant 7afd0586f5334f8bad4fb082de1cf92b | fa:16:3e:ac:4c:c4 | {"subnet_id": "1a759fa1-d5e5-4f7b-b806-50a2bbc4b19e",             |
|                                      |                                                 |                   | "ip_address": "169.254.192.4"}                                    |
| 2d5724dd-afab-4527-96ff-18e1c774f55b |                                                 | fa:16:3e:20:82:88 | {"subnet_id": "8ab08fdc-16a6-4168-9eba-434cd1399bf6",             |
|                                      |                                                 |                   | "ip_address": "192.168.0.184"}                                    |
| 93fd28b8-8695-4408-9351-09e4ffbf83c0 |                                                 | fa:16:3e:9c:01:ec | {"subnet_id": "4f886ceb-c0bb-4bfa-ba6e-f24fe25b2a51",             |
|                                      |                                                 |                   | "ip_address": "10.20.30.1"}                                       |
| 9f395f0f-65be-4001-ad29-cae268c7888c | HA port tenant 7afd0586f5334f8bad4fb082de1cf92b | fa:16:3e:9e:d8:ce | {"subnet_id": "1a759fa1-d5e5-4f7b-b806-50a2bbc4b19e",             |
|                                      |                                                 |                   | "ip_address": "169.254.192.3"}                                    |
+--------------------------------------+-------------------------------------------------+-------------------+-------------------------------------------------------------------+
root@ds0095:~# neutron router-show clwtest
+-----------------------+--------------------------------------------------------+
| Field                 | Value                                                  |
+-----------------------+--------------------------------------------------------+
| admin_state_up        | True                                                   |
| distributed           | False                                                  |
| external_gateway_info |                                                        |
| ha                    | True                                                   |
| id                    | 0f860d02-84a2-4df8-b675-3c117c96c8e7                   |
| name                  | clwtest                                                |
| routes                | {"destination": "0.0.0.0/0", "nexthop": "192.168.0.1"} |
| status                | ACTIVE                                                 |
| tenant_id             | 7afd0586f5334f8bad4fb082de1cf92b                       |
+-----------------------+--------------------------------------------------------+
```

**Discussion**: FYI... the instances that we intend to attach to the `private_network` are truly internal, that is, they will never be allocated a floating IP. This is actually a majority of our instances... there are only about 4 instances that need to have a floating IP in our offering.

The intention is to treat the internal network as the equivalent of a DMZ and attach the instances that require a floating IP to it. All of our other instances will be attached to the `private_network` and will only be able to access the public internet by routing traffic via the default router... using the configuration you have identified.

Does this sound like a sensible way of segregating our networks? Would you still recommend using a single network and creating appropriate security group rules? If so, what the are the benefits of that approach over the one that we are proposing?

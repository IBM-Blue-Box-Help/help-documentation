---
layout: page
title:  "How to Create An Instance With Static IP"
dateAdded: September 2, 2016
author: Jason Kennedy
editor: Leslie Lundquist
featured: true
weight: 4
tags: [openstack, static ip, instance]
---



This article shows you how you can create a new port in OpenStack, and attach it manually to instances at boot time, in order to assign a "static" IP to an instance.

First, much of this method is going to happen at the command line, as it's much more versatile a tool for working with your IBM Bluemix Private Cloud. If necessary, I'm willing to back up a bit and go over using the OpenStack CLI & API to make this instruction set seem more reasonable. That being said, let's jump right into how to get this done. This work is being done on a test cluster, but these steps can also be repeated in a screenshare on your own cluster if that seems warranted.

First, Bluemix Private Cloud clusters have two pre-generated networks: `internal` and `external`. For our purposes, we want to create this new port on the internal network, so let's take a quick peak at it via the command line:
```
bash-3.2$ openstack network list | grep internal
| 81e829d0-5e35-4808-9f7a-d22159faa9d1 | internal | c6560f00-ae29-40b5-93bb-6e7b1ffd3720
```
This gives us the ID of the internal network. To discuss CLI for a moment, I'm using `python-openstackclient` for this work; it's the "newer" of the clients. ID is used less with this client, but being able to find the ID for a given network, tenant or whatever is important as there's occasion to use the older tools (`python-novaclient`, etc.) when necessary. Let's not get bogged down in too much detail there at this point, though.

We need to see the subnet we'll be working with in this case, so let's take a look at that:

```
bash-3.2$ openstack network show internal
+-------------------------+--------------------------------------+
| Field                   | Value                                |
+-------------------------+--------------------------------------+
| admin_state_up          | UP                                   |
| availability_zone_hints |                                      |
| availability_zones      | nova                                 |
| description             | None                                 |
| id                      | 81e829d0-5e35-4808-9f7a-d22159faa9d1 |
| ipv4_address_scope      | None                                 |
| ipv6_address_scope      | None                                 |
| mtu                     | 0                                    |
| name                    | internal                             |
| port_security_enabled   | True                                 |
| project_id              | 2d529661c7a641a499e4c53d9672e787     |
| router:external         | Internal                             |
| shared                  | True                                 |
| status                  | ACTIVE                               |
| subnets                 | c6560f00-ae29-40b5-93bb-6e7b1ffd3720 |
| tags                    | []                                   |
+-------------------------+--------------------------------------+
```

That's the subnet we want, so let's take a closer look:

```
bash-3.2$ openstack subnet show c6560f00-ae29-40b5-93bb-6e7b1ffd3720
+-------------------+--------------------------------------+
| Field             | Value                                |
+-------------------+--------------------------------------+
| allocation_pools  | 10.220.0.2-10.220.3.254              |
| cidr              | 10.220.0.0/22                        |
| description       | None                                 |
| dns_nameservers   |                                      |
| enable_dhcp       | True                                 |
| gateway_ip        | 10.220.0.1                           |
| host_routes       |                                      |
| id                | c6560f00-ae29-40b5-93bb-6e7b1ffd3720 |
| ip_version        | 4                                    |
| ipv6_address_mode | None                                 |
| ipv6_ra_mode      | None                                 |
| name              | internal1                            |
| network_id        | 81e829d0-5e35-4808-9f7a-d22159faa9d1 |
| project_id        | 2d529661c7a641a499e4c53d9672e787     |
| subnetpool_id     | None                                 |
+-------------------+--------------------------------------+
```

There's our subnet; CIDR is `10.220.0.0/22`. Let's use `10.220.3.100` for our testing. We're going to manually create the port with that IP reservation.

```
bash-3.2$ openstack port create --network internal --fixed-ip ip-address=10.220.3.100 res1
+-----------------------+-----------------------------------------------------------------------------+
| Field                 | Value                                                                       |
+-----------------------+-----------------------------------------------------------------------------+
| admin_state_up        | UP                                                                          |
| allowed_address_pairs |                                                                             |
| binding_vnic_type     | normal                                                                      |
| created_at            | 2016-09-02 20:24:51+00:00                                                   |
| description           |                                                                             |
| device_id             |                                                                             |
| device_owner          |                                                                             |
| dns_name              | None                                                                        |
| extra_dhcp_opts       |                                                                             |
| fixed_ips             | ip_address='10.220.3.100', subnet_id='c6560f00-ae29-40b5-93bb-6e7b1ffd3720' |
| headers               |                                                                             |
| id                    | 09fab796-dcb5-4af2-bfc9-8d6793f85a91                                        |
| mac_address           | fa:16:3e:42:9e:41                                                           |
| name                  | res1                                                                        |
| network_id            | 81e829d0-5e35-4808-9f7a-d22159faa9d1                                        |
| port_security_enabled | True                                                                        |
| project_id            | 77fc0b79f2734d76a69a46e978f16cb8                                            |
| security_groups       | 749ac466-07b6-4b35-b01a-a2ff4287cabb                                        |
| status                | DOWN                                                                        |
| updated_at            | 2016-09-02 20:24:51+00:00                                                   |
+-----------------------+-----------------------------------------------------------------------------+
```

Done! Now we just need to boot this instance up while specifying the port we just created:

```
bash-3.2$ openstack server create --flavor m1.small --image cirros --nic port-id=09fab796-dcb5-4af2-bfc9-8d6793f85a91 test1
+--------------------------------------+-----------------------------------------------+
| Field                                | Value                                         |
+--------------------------------------+-----------------------------------------------+
| OS-DCF:diskConfig                    | MANUAL                                        |
| OS-EXT-AZ:availability_zone          |                                               |
| OS-EXT-STS:power_state               | NOSTATE                                       |
| OS-EXT-STS:task_state                | scheduling                                    |
| OS-EXT-STS:vm_state                  | building                                      |
| OS-SRV-USG:launched_at               | None                                          |
| OS-SRV-USG:terminated_at             | None                                          |
| accessIPv4                           |                                               |
| accessIPv6                           |                                               |
| addresses                            |                                               |
| adminPass                            | PrxEm43QinYX                                  |
| config_drive                         |                                               |
| created                              | 2016-09-02T20:29:47Z                          |
| flavor                               | m1.small (2)                                  |
| hostId                               |                                               |
| id                                   | 1e78035f-e48b-48f7-a94d-8b402d451c44          |
| image                                | cirros (2be77b0d-b50c-43e4-956b-40557cb5b595) |
| key_name                             | None                                          |
| name                                 | test1                                         |
| os-extended-volumes:volumes_attached | []                                            |
| progress                             | 0                                             |
| project_id                           | 77fc0b79f2734d76a69a46e978f16cb8              |
| properties                           |                                               |
| security_groups                      | [{u'name': u'default'}]                       |
| status                               | BUILD                                         |
| updated                              | 2016-09-02T20:29:48Z                          |
| user_id                              | d10464fc6205471ba5098b0529c18735              |
+--------------------------------------+-----------------------------------------------+

bash-3.2$ openstack server list | grep test1
| 1e78035f-e48b-48f7-a94d-8b402d451c44 | test1         | ACTIVE | internal=10.220.3.100|
```

So it got the IP we wanted it to, but does it work? Let's attach a floating IP to it and test.

```
bash-3.2$ openstack ip floating add 169.45.125.46 test1
bash-3.2$ openstack server list | grep test1
| 1e78035f-e48b-48f7-a94d-8b402d451c44 | test1         | ACTIVE | internal=10.220.3.100, 169.45.125.46  |

```

Looks good so far, let's log in. (NOTE: for the purpose of this demo, I've added port 22 ingress to the default security group, just for the purpose of this writeup. You'd normally want to specify a secgroup in your server boot argument and keep default pristine)

```
bash-3.2$ ssh cirros@169.45.125.46
The authenticity of host '169.45.125.46 (169.45.125.46)' can't be established.
RSA key fingerprint is SHA256:LvwRGVXQE/GcyyKddURKf7lzaaKM2hu9/024aRVOLsw.
Are you sure you want to continue connecting (yes/no)? yes
Warning: Permanently added '169.45.125.46' (RSA) to the list of known hosts.
cirros@169.45.125.46's password:
$ ifconfig
eth0      Link encap:Ethernet  HWaddr FA:16:3E:42:9E:41
          inet addr:10.220.3.100  Bcast:10.220.3.255  Mask:255.255.252.0
          inet6 addr: fe80::f816:3eff:fe42:9e41/64 Scope:Link
          UP BROADCAST RUNNING MULTICAST  MTU:1500  Metric:1
          RX packets:137 errors:0 dropped:0 overruns:0 frame:0
          TX packets:148 errors:0 dropped:0 overruns:0 carrier:0
          collisions:0 txqueuelen:1000
          RX bytes:17055 (16.6 KiB)  TX bytes:14498 (14.1 KiB)

lo        Link encap:Local Loopback
          inet addr:127.0.0.1  Mask:255.0.0.0
          inet6 addr: ::1/128 Scope:Host
          UP LOOPBACK RUNNING  MTU:16436  Metric:1
          RX packets:0 errors:0 dropped:0 overruns:0 frame:0
          TX packets:0 errors:0 dropped:0 overruns:0 carrier:0
          collisions:0 txqueuelen:0
          RX bytes:0 (0.0 B)  TX bytes:0 (0.0 B)

$
```

Great! And there you have it. 

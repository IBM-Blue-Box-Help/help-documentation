---
layout: page
title:  "How to configure a highly-available IP"
tags: [neutron, configuring ip, ha, highly available, allowed address pairs, l2 pop]
dateAdded: September 21, 2016
author: Eric French
featured: false
weight: 4
note: Leslie Lundquist
originally added: April 9th, 2015 
---

This article provides a resource on how to set up HA floating IPs within an **IBM Bluemix Private Cloud Local** environment. These instructions assume that you already have the [**OpenStack Python API Clients**](http://ibm-blue-box-help.github.io/help-documentation/openstack/api/openstack-api-getting-started/) installed.

NOTE: This feature works with IBM Bluemix Private Local Cloud ONLY. It does not apply to the IBM Bluemix Private Cloud (Dedicated Cloud) offering. The IBM Bluemix data center Network currently requires us to use L2 POP, a driver designed to support scaling to large networks. To quote one of our engineers: 


"The L2Population mechanism driver we need to use to make VXLAN work on IBM Bluemix data center networks is incompatible with MAC learning or ARP responses used by HA IP methods. IPs are mapped to hosts through two translation mechanisms: ARP maps IPs to MAC addresses, and switches learn which MAC is associated with each port. At failover time, any HA IP must change at least one of these two mappings." 


As a possible workaround, in the OpenStack Mitaka release, there is an option to disable half of the L2 POP responder, which could allow you to set up the gratuitous ARP type of HA. (See this article: https://review.openstack.org/278597) If you really need HA, it's best to use a Load Balancer for that, such as Neutron LBaaS v2. As another possible workaround, if your cloud is deployed within a single SoftLayer Pod, and it will never grow beyond that single Pod, you could possibly implement some type of HA IP in a custom way.

**Configure your OpenStack instances**

There are two portions to the OpenStack work. The first portion requires administrative credentials to set up availability zones, and the second portion can be done by a regular user. The first portion only needs to be done once.

### First Portion: Administrative steps

**Set up availability zones**

We use availability zones to create a pool of resources to ensure that our two unique VMs don't end up on the same physical hosts.

As an administrator, create two distinct availability zones:

{% highlight bash %}
```
$ nova aggregate-create group1 group1-az
+----+--------+-------------------+-------+-------------------------------+
| Id | Name   | Availability Zone | Hosts | Metadata                      |
+----+--------+-------------------+-------+-------------------------------+
| 8  | group1 | group1-az         |       | 'availability_zone=group1-az' |
+----+--------+-------------------+-------+-------------------------------+
$ nova aggregate-create group2 group2-az
+----+--------+-------------------+-------+-------------------------------+
| Id | Name   | Availability Zone | Hosts | Metadata                      |
+----+--------+-------------------+-------+-------------------------------+
| 11 | group2 | group2-az         |       | 'availability_zone=group2-az' |
+----+--------+-------------------+-------+-------------------------------+
```
{% endhighlight %}

View your availability zone information to get information on your hypervisors:

{% highlight bash %}
```
$ nova availability-zone-list
+-----------------------+----------------------------------------+
| Name                  | Status                                 |
+-----------------------+----------------------------------------+
| internal              | available                              |
| |- ds1263             |                                        |
| | |- nova-conductor   | enabled :-) 2014-12-03T00:07:33.000000 |
| | |- nova-cert        | enabled :-) 2014-12-03T00:07:33.000000 |
| | |- nova-consoleauth | enabled :-) 2014-12-03T00:07:33.000000 |
| | |- nova-scheduler   | enabled :-) 2014-12-03T00:07:27.000000 |
| |- ds1264             |                                        |
| | |- nova-conductor   | enabled :-) 2014-12-03T00:07:32.000000 |
| | |- nova-cert        | enabled :-) 2014-12-03T00:07:32.000000 |
| | |- nova-consoleauth | enabled :-) 2014-12-03T00:07:33.000000 |
| | |- nova-scheduler   | enabled :-) 2014-12-03T00:07:30.000000 |
| group1-az             | available                              |
| |- ds1263             |                                        |
| | |- nova-compute     | enabled :-) 2014-12-03T00:07:33.000000 |
| group2-az             | available                              |
| |- ds1264             |                                        |
| | |- nova-compute     | enabled :-) 2014-12-03T00:07:33.000000 |
| nova                  | available                              |
| |- ds1265             |                                        |
| | |- nova-compute     | enabled :-) 2014-12-03T00:07:32.000000 |
| |- ds1266             |                                        |
| | |- nova-compute     | enabled :-) 2014-12-03T00:07:32.000000 |
+-----------------------+----------------------------------------+
```
{% endhighlight %}

Selecting hosts from that list, add them to your two distinct availability zones:

{% highlight bash %}
```
$ nova aggregate-add-host 8 ds1263
Host ds1263 has been successfully added for aggregate 8
+----+--------+-------------------+----------+-------------------------------+
| Id | Name   | Availability Zone | Hosts    | Metadata                      |
+----+--------+-------------------+----------+-------------------------------+
| 8  | group1 | group1-az         | 'ds1263' | 'availability_zone=group1-az' |
+----+--------+-------------------+----------+-------------------------------+
$ nova aggregate-add-host 11 ds1264
Host ds1264 has been successfully added for aggregate 11
+----+--------+-------------------+----------+-------------------------------+
| Id | Name   | Availability Zone | Hosts    | Metadata                      |
+----+--------+-------------------+----------+-------------------------------+
| 11 | group2 | group2-az         | 'ds1264' | 'availability_zone=group2-az' |
+----+--------+-------------------+----------+-------------------------------+
```
{% endhighlight %}

That's it!

### Second Portion: Steps That Require Regular Permissions Only

* Confirm that the `allowed-address-pairs` extension is loaded.

The `allowed-address-pairs` extension is required, and it is shipped by default with each **IBM Bluemix Private** Cloud installation. You can confirm it's operating by running the following commands:

{% highlight bash %}
```
$ neutron ext-list | grep allowed-address-pairs
| allowed-address-pairs | Allowed Address Pairs
|
```
{% endhighlight %}


**Note:** You cannot have `allowed_address_pairs` enabled and port security disabled on the SAME Neutron port, because they are mutually exclusive.

* Create a VRRP security group.

This security group is used to communicate to your HA nodes. In this instance, we're permitting `SSH` access, but you can make this protocol `HTTP`, `HTTPS`, etc...

{% highlight bash %}
```
$ neutron security-group-create vrrp
Created a new security_group:
+----------------------+-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| Field                | Value                                                                                                                                                                                                                                                                                                                         |
+----------------------+-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| description          |                                                                                                                                                                                                                                                                                                                               |
| id                   | 7f09ac66-23e2-46cd-9af8-ca541dd99bc1                                                                                                                                                                                                                                                                                          |
| name                 | vrrp                                                                                                                                                                                                                                                                                                                      |
| security_group_rules | {"remote_group_id": null, "direction": "egress", "remote_ip_prefix": null, "protocol": null, "tenant_id": "0109935df2314105bf7ba85a79a1c001", "port_range_max": null, "security_group_id": "7f09ac66-23e2-46cd-9af8-ca541dd99bc1", "port_range_min": null, "ethertype": "IPv4", "id": "28236695-9cb4-4a0c-a04d-9d230fcdce4a"} |
|                      | {"remote_group_id": null, "direction": "egress", "remote_ip_prefix": null, "protocol": null, "tenant_id": "0109935df2314105bf7ba85a79a1c001", "port_range_max": null, "security_group_id": "7f09ac66-23e2-46cd-9af8-ca541dd99bc1", "port_range_min": null, "ethertype": "IPv6", "id": "a8180e54-6ae6-44e7-9da8-baeec24dbe6f"} |
| tenant_id            | 0109935df2314105bf7ba85a79a1c001                                                                                                                                                                                                                                                                                              |
+----------------------+-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
```
{% endhighlight %}

* Add `ICMP` access:

{% highlight bash %}
```
$ $ neutron security-group-rule-create --protocol icmp vrrp
Created a new security_group_rule:
+-------------------+--------------------------------------+
| Field             | Value                                |
+-------------------+--------------------------------------+
| direction         | ingress                              |
| ethertype         | IPv4                                 |
| id                | f795c776-2e8c-4234-9f9c-cff5bd4398fc |
| port_range_max    |                                      |
| port_range_min    |                                      |
| protocol          | icmp                                 |
| remote_group_id   |                                      |
| remote_ip_prefix  |                                      |
| security_group_id | 7f09ac66-23e2-46cd-9af8-ca541dd99bc1 |
| tenant_id         | 0109935df2314105bf7ba85a79a1c001     |
+-------------------+--------------------------------------+
```
{% endhighlight %}

* Add `SSH` access:

{% highlight bash %}
```
$ neutron security-group-rule-create --protocol tcp --port-range-min 22 --port-range-max 22 vrrp
Created a new security_group_rule:
+-------------------+--------------------------------------+
| Field             | Value                                |
+-------------------+--------------------------------------+
| direction         | ingress                              |
| ethertype         | IPv4                                 |
| id                | 41c996f5-1e7b-4061-87ff-8dba581eda7c |
| port_range_max    | 22                                   |
| port_range_min    | 22                                   |
| protocol          | tcp                                  |
| remote_group_id   |                                      |
| remote_ip_prefix  |                                      |
| security_group_id | 7f09ac66-23e2-46cd-9af8-ca541dd99bc1 |
| tenant_id         | 0109935df2314105bf7ba85a79a1c001     |
+-------------------+--------------------------------------+
```
{% endhighlight %}

* Collect parameters required to boot the instances.

You'll need to collect a few specific pieces of information to ensure that our HA load balancers are provisioned with the OS we want, and that they end up as unique physical hypervisors.

* Select a particular flavor ID. In this case, we will use `m1.medium` with ID `3`:

{% highlight bash %}
```
$ nova flavor-list
+----+-----------+-----------+------+-----------+---------+-------+-------------+-----------+
| ID | Name      | Memory_MB | Disk | Ephemeral | Swap_MB | VCPUs | RXTX_Factor | Is_Public |
+----+-----------+-----------+------+-----------+---------+-------+-------------+-----------+
| 1  | m1.tiny   | 512       | 10   | 0         |         | 1     | 1.0         | True      |
| 2  | m1.small  | 2048      | 20   | 0         |         | 1     | 1.0         | True      |
| 3  | m1.medium | 4096      | 40   | 0         |         | 2     | 1.0         | True      |
| 4  | m1.large  | 8192      | 80   | 0         |         | 4     | 1.0         | True      |
| 5  | m1.xlarge | 16384     | 160  | 0         |         | 8     | 1.0         | True      |
+----+-----------+-----------+------+-----------+---------+-------+-------------+-----------+
```
{% endhighlight %}

* Select the ID of the particular image. In this case, we've selected `ubuntu-14.04` and the ID is `1525c3f3-1224-4958-bd07-da9feaedf18b`:

{% highlight bash %}
```
$ nova image-list | grep  ubuntu-14.04
+--------------------------------------+---------------------------------+--------+--------+
| ID                                   | Name                            | Status | Server |
+--------------------------------------+---------------------------------+--------+--------+
| 1525c3f3-1224-4958-bd07-da9feaedf18b | ubuntu-14.04                    | ACTIVE |        |
+--------------------------------------+---------------------------------+--------+--------+
```
{% endhighlight %}

* Collect the ID of the Internal network. In this case, that is `ba0fdd03-72b5-41eb-bb67-fef437fd6cb4`:

{% highlight bash %}
```
$ nova network-list
+--------------------------------------+----------+------+
| ID                                   | Label    | Cidr |
+--------------------------------------+----------+------+
| 06dc9d5a-f55a-410d-a7fd-4c7cb34ad927 | external | -    |
| ba0fdd03-72b5-41eb-bb67-fef437fd6cb4 | internal | -    |
+--------------------------------------+----------+------+
```
{% endhighlight %}

* Select the IDs of the `default` and `VRRP` groups, in this case they are `a963c698-473c-4182-8add-e1e6398629e5` and `7f09ac66-23e2-46cd-9af8-ca541dd99bc1` respectively:

{% highlight bash %}
```
$ nova secgroup-list
+--------------------------------------+----------+-------------+
| Id                                   | Name     | Description |
+--------------------------------------+----------+-------------+
| a963c698-473c-4182-8add-e1e6398629e5 | default  | default     |
| 7f09ac66-23e2-46cd-9af8-ca541dd99bc1 | vrrp |             |
+--------------------------------------+----------+-------------+
```
{% endhighlight %}

* Select the two unique availability zones we created previously. In this case, `group1-az` and `group2-az`.

{% highlight bash %}
```
$ nova availability-zone-list
+-----------+-----------+
| Name      | Status    |
+-----------+-----------+
| group1-az | available |
| group2-az | available |
| nova      | available |
+-----------+-----------+
$
```
{% endhighlight %}

* Boot two unique instances on two unique hosts.

Here's a synopsis of the values we collected from before:

{% highlight bash %}
```
flavor: 3
image: 1525c3f3-1224-4958-bd07-da9feaedf18b
availability-zone: group1-az, group2-az
security groups: b3ccd3e2-6566-40ba-8469-9919a44c0eaf, 1409d05d-7b34-4f77-8ae0-8c49c6be37a2
network id: ba0fdd03-72b5-41eb-bb67-fef437fd6cb4
```
{% endhighlight %}

Using those variables, let's boot our two VMs.

**Additional notes:**

You'll need to specify the `key-name` for the `SSH` key you use in the system. For example:

**Host 1**:

{% highlight bash %}
```
$ nova boot \
--key-name default \
--flavor 3 \
--image 1525c3f3-1224-4958-bd07-da9feaedf18b \
--availability-zone group1-az \
--security-groups a963c698-473c-4182-8add-e1e6398629e5,7f09ac66-23e2-46cd-9af8-ca541dd99bc1 \
--nic net-id=ba0fdd03-72b5-41eb-bb67-fef437fd6cb4 \
loadbalancer01
```
{% endhighlight %}

**Host 2**: (Notice that we're changing the availability zone and the hostname.)

{% highlight bash %}
```
$ nova boot \
--key-name default \
--flavor 3 \
--image 1525c3f3-1224-4958-bd07-da9feaedf18b \
--availability-zone group2-az \
--security-groups a963c698-473c-4182-8add-e1e6398629e5,7f09ac66-23e2-46cd-9af8-ca541dd99bc1 \
--nic net-id=ba0fdd03-72b5-41eb-bb67-fef437fd6cb4 \
loadbalancer02
```
{% endhighlight %}

* Collect instance data.

Now that your two instances have booted, you can collect the instance data.

{% highlight bash %}
```
$ nova list
+--------------------------------------+----------------+--------+------------+-------------+-----------------------+
| ID                                   | Name           | Status | Task State | Power State | Networks              |
+--------------------------------------+----------------+--------+------------+-------------+-----------------------+
| 9d64868e-55ae-4b40-b2fa-70a65b0e88e8 | loadbalancer01 | ACTIVE | -          | Running     | internal=10.230.7.183 |
| 0394331a-f2ce-480a-9a93-2a50207ef7ee | loadbalancer02 | ACTIVE | -          | Running     | internal=10.230.7.184 |
+--------------------------------------+----------------+--------+------------+-------------+-----------------------+
```
{% endhighlight %}

* Create a port.

**NOTE**: This action requires administrative credentials, but it can be executed to add the port to a specific tenant. If you want this port to be added to a tenant, use the `--tenant-id` parameter.

Also, be sure to make note of the IP address and the port id that's returned. In this case, it is `10.230.7.33` and `6bed4a2a-62e6-4cb1-80ce-b5971fee782d`.

{% highlight bash %}
```
$ neutron port-create --security-group 7f09ac66-23e2-46cd-9af8-ca541dd99bc1 internal
Created a new port:
+-----------------------+------------------------------------------------------------------------------------+
| Field                 | Value                                                                              |
+-----------------------+------------------------------------------------------------------------------------+
| admin_state_up        | True                                                                               |
| allowed_address_pairs |                                                                                    |
| binding:capabilities  | {"port_filter": true}                                                              |
| binding:host_id       |                                                                                    |
| binding:vif_type      | ovs                                                                                |
| device_id             |                                                                                    |
| device_owner          |                                                                                    |
| fixed_ips             | {"subnet_id": "8fb66dc4-d9f8-47eb-9679-85d7672ad37e", "ip_address": "10.230.7.33"} |
| id                    | 6bed4a2a-62e6-4cb1-80ce-b5971fee782d                                               |
| mac_address           | fa:16:3e:20:c6:e3                                                                  |
| name                  |                                                                                    |
| network_id            | ba0fdd03-72b5-41eb-bb67-fef437fd6cb4                                               |
| security_groups       | 7f09ac66-23e2-46cd-9af8-ca541dd99bc1                                               |
| status                | DOWN                                                                               |
| tenant_id             | 0109935df2314105bf7ba85a79a1c001                                                   |
+-----------------------+------------------------------------------------------------------------------------+
```
{% endhighlight %}

* If this is a public service, associate a floating IP to the VIP.

Using the `port-id` obtained in the previous step, now we can associate the floating IP to the VIP:

{% highlight bash %}
```
$ neutron floatingip-create --port-id=6bed4a2a-62e6-4cb1-80ce-b5971fee782d external
Created a new floatingip:
+---------------------+--------------------------------------+
| Field               | Value                                |
+---------------------+--------------------------------------+
| fixed_ip_address    | 10.230.7.33                          |
| floating_ip_address | 173.247.105.96                       |
| floating_network_id | 06dc9d5a-f55a-410d-a7fd-4c7cb34ad927 |
| id                  | 753b3d69-73e4-4396-a98c-df1afdc6c2bf |
| port_id             | 6bed4a2a-62e6-4cb1-80ce-b5971fee782d |
| router_id           | 7e027195-f474-41d7-b15b-9042eb396735 |
| tenant_id           | 0109935df2314105bf7ba85a79a1c001     |
+---------------------+--------------------------------------+
```
{% endhighlight %}

* Determine the port IDs for your load balancer instances.

Use the IP addresses to map the instances to their ports.

In this case:

`loadbalancer01` -> Port id: `23604992-c26c-426d-9634-f45d24b9ee83`

`loadbalancer02` -> Port id: `9f646d79-0599-4761-a4b3-cb9728bbb72a`

{% highlight bash %}
```
$ nova list
+--------------------------------------+----------------+--------+------------+-------------+-----------------------+
| ID                                   | Name           | Status | Task State | Power State | Networks              |
+--------------------------------------+----------------+--------+------------+-------------+-----------------------+
| 9d64868e-55ae-4b40-b2fa-70a65b0e88e8 | loadbalancer01 | ACTIVE | -          | Running     | internal=10.230.7.183 |
| 0394331a-f2ce-480a-9a93-2a50207ef7ee | loadbalancer02 | ACTIVE | -          | Running     | internal=10.230.7.184 |
+--------------------------------------+----------------+--------+------------+-------------+-----------------------+
$ neutron port-list
+--------------------------------------+------+-------------------+-------------------------------------------------------------------------------------+
| id                                   | name | mac_address       | fixed_ips                                                                           |
+--------------------------------------+------+-------------------+-------------------------------------------------------------------------------------+
| 23604992-c26c-426d-9634-f45d24b9ee83 |      | fa:16:3e:4d:89:4d | {"subnet_id": "8fb66dc4-d9f8-47eb-9679-85d7672ad37e", "ip_address": "10.230.7.183"} |
| 6bed4a2a-62e6-4cb1-80ce-b5971fee782d |      | fa:16:3e:20:c6:e3 | {"subnet_id": "8fb66dc4-d9f8-47eb-9679-85d7672ad37e", "ip_address": "10.230.7.33"}  |
| 9f646d79-0599-4761-a4b3-cb9728bbb72a |      | fa:16:3e:8d:0e:13 | {"subnet_id": "8fb66dc4-d9f8-47eb-9679-85d7672ad37e", "ip_address": "10.230.7.184"} |
+--------------------------------------+------+-------------------+-------------------------------------------------------------------------------------+
```
{% endhighlight %}

* Add the new VIP to the allowed address pairs for the instance ports

{% highlight bash %}
```
$ neutron port-update 23604992-c26c-426d-9634-f45d24b9ee83 --allowed_address_pairs list=true type=dict ip_address=10.230.7.33
Updated port: 23604992-c26c-426d-9634-f45d24b9ee83
$ neutron port-update 9f646d79-0599-4761-a4b3-cb9728bbb72a --allowed_address_pairs list=true type=dict ip_address=10.230.7.33
Updated port: 9f646d79-0599-4761-a4b3-cb9728bbb72a
```
{% endhighlight %}

**Keepalived**

Now we will move along to the `keepalived` portion of this work, shown partly as sample code that follows.


## Install keepalived


On your two hosts, install `keepalived`:
{% highlight bash %}
```
$ apt-get install keepalived
```
{% endhighlight %}


## Configure keepalived on both hosts

**Note**: *Set the password to a unique string.*

The IP listed in the virtual IP address should be your VIP **Host 1**:

{% highlight bash %}
```
vrrp_instance vrrp_group_1 { state MASTER interface eth0 virtual_router_id 1 priority 100 authentication
    { auth_type PASS auth_pass 9B1D715906B57DF2D78B8D3F02634271CDCC2A51826293FB8E893E21244F7242 }
        virtual_ipaddress { 10.230.7.33/24 brd 10.230.7.255 dev eth0 } }
```
{% endhighlight %}

**Host 2**:

{% highlight bash %}
```
vrrp_instance vrrp_group_1 { state BACKUP interface eth0 virtual_router_id 1 priority 50 authentication
    { auth_type PASS auth_pass 9B1D715906B57DF2D78B8D3F02634271CDCC2A51826293FB8E893E21244F7242 }
        virtual_ipaddress { 10.230.7.33/24 brd 10.230.7.255 dev eth0 }

# Start keepalived on both hosts
```
{% endhighlight %}

**Run the following commands on both hosts:**

{% highlight bash %}
```
/etc/init.d/keepalived start

## Test the floating IP
```
{% endhighlight %}

**Try connecting to your public floating IP:**

{% highlight bash %}
```
$ ssh ubuntu@173.247.105.96 Welcome to Ubuntu 14.04.1 LTS (GNU/Linux 3.13.0-36-generic x86_64)

## Test failover
```
{% endhighlight %}

**Stop the first load balancer and confirm that the IP fails over.**

{% highlight bash %}
```
$ nova stop loadbalancer01
$ ssh ubuntu@173.247.105.96
```
{% endhighlight %}

This command sequence should give you an `SSH key failure` result, because you're now connecting to the second host.

{% highlight bash %}
```
$ neutron subnet-update internal --dns_nameservers list=true 10.0.100.100
```
{% endhighlight %}

If **Active Directory** is not deployed, you can use a public DNS server, such as:

{% highlight bash %}
```
$ neutron subnet-update internal --dns_nameservers list=true 8.8.8.8
```
{% endhighlight %}

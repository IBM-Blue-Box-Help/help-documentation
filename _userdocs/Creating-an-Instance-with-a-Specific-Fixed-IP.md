---
layout: page
title:  "Creating an Instance with a Specific Fixed IP"
featured: true
weight: 2
tags: [openstack, instance, fixed IP]
dateAdded: January 2016
---

You may have a need to create an instance with a specific, private IP address (_aka Fixed IP_) from your subnet. To do this you must manually create a neutron port. This article outlines the steps that achieve this goal.
You will need to utilize either the API or the command line tools to do these steps.

## Pre-requisites

1. If you are going to use the command line (CLI) tools, ensure you have both of these tools installed. You can find installation instructions for both tools in our knowledge base: [**Getting started with the OpenStack API**](http://ibm-blue-box-help.github.io/help-documentation/openstack/api/openstack-api-getting-started/)

* `NeutronClient`
* `NovaClient`

You also must ensure that DHCP is Enabled on your Neutron subnet. DHCP is enabled by default, so unless you've specifically disabled it then you shouldn't need to do this step.

If it is not enabled already, run this command with the `NeutronClient` to enable it:

{% highlight bash %}
neutron subnet-update --enable-dhcp SUBNET_ID
{% endhighlight %}

Example:

{% highlight bash %}
$ neutron subnet-update --enable-dhcp c5cf95c4-3e36-43c0-9b07-bc73e7a4669b
Updated subnet: c5cf95c4-3e36-43c0-9b07-bc73e7a4669b
{% endhighlight %}

You should then be able to run the command `neutron subnet-show` on your subnet and see that the value of `enable_dhcp` is set to True, as shown in this example:

{% highlight bash %}
$ neutron subnet-show c5cf95c4-3e36-43c0-9b07-bc73e7a4669b
+------------------+--------------------------------------------+
| Field            | Value                                      |
+------------------+--------------------------------------------+
| allocation_pools | {"start": "10.0.0.2", "end": "10.0.0.254"} |
| cidr             | 10.0.0.0/24                                |
| dns_nameservers  |                                            |
| enable_dhcp      | True                                       |
| gateway_ip       | 10.0.0.1                                   |
| host_routes      |                                            |
| id               | c5cf95c4-3e36-43c0-9b07-bc73e7a4669b       |
| ip_version       | 4                                          |
| name             | Test                                       |
| network_id       | c435a78b-0928-4683-a545-3ab15f30809c       |
| tenant_id        | 65589599430509                             |
+------------------+--------------------------------------------+
{% endhighlight %}

**Notes:** Here is a full list of the commands used to form these calls:

{% highlight bash %}
neutron net-list
neutron subnet-list
neutron port-create
neutron port-list
nova flavor-list
nova keypair-list
nova image-list
nova secgroup-list
nova boot
nova list
{% endhighlight %}

## Walkthrough Steps

### Create a port

Using the NeutronClient you would start by creating your port with this command:

{% highlight bash %}
neutron port-create --fixed-ip subnet_id=SUBNET_ID,ip_address=IP_FROM_POOL --name PORT_NAME NETWORK_ID
{% endhighlight %}

**Example:**

Using a subnet with ID `76b3537c-4fbb-4f06-aa8c-795617a0821e` and IP pool range of `192.168.0.0/24` on a network with ID `b4988d1f-6546-4bb2-afd9-ab9afb211763` yields a command that looks like this one:

{% highlight bash %}
$ neutron port-create --fixed-ip subnet_id=76b3537c-4fbb-4f06-aa8c-795617a0821e,ip_address=192.168.0.50 --name fixedtest b4988d1f-6546-4bb2-afd9-ab9afb211763
Created a new port:
+-----------------------+-------------------------------------------------------------------------------------+
| Field                 | Value                                                                               |
+-----------------------+-------------------------------------------------------------------------------------+
| admin_state_up        | True                                                                                |
| device_id             |                                                                                     |
| device_owner          |                                                                                     |
| fixed_ips             | {"subnet_id": "76b3537c-4fbb-4f06-aa8c-795617a0821e", "ip_address": "192.168.0.50"} |
| id                    | cd497879-11a2-41ce-9f01-9a3c9a377ab1                                                |
| mac_address           | fa:16:3e:39:85:a6                                                                   |
| name                  | fixedtest                                                                           |
| network_id            | b4988d1f-6546-4bb2-afd9-ab9afb211763                                                |
| port_security_enabled | True                                                                                |
| security_groups       | 94b2a4be-3d6e-4687-9ec3-a5c4abde1377                                                |
| status                | ACTIVE                                                                              |
| tenant_id             | 65589599430509                                                                      |
+-----------------------+-------------------------------------------------------------------------------------+
{% endhighlight %}

### Optional: Have a floating IP assigned to your port before creating the instance

OPTIONAL: If you want to have a floating IP assigned to your port before creating the instance, this command will do that for you. Floating IPs are used so that your instance will be accessible externally over the internet.

You'll need to run the command `neutron net-list` to get the ID of your Ext-Net, which is where the floating IP will be allocated:**

{% highlight bash %}
$ neutron net-list
+--------------------------------------+---------+--------------------------------------------------+
| id                                   | name    | subnets                                          |
+--------------------------------------+---------+--------------------------------------------------+
| 7da74520-9d5e-427b-a508-213c84e69616 | Ext-Net | ef3bde66-8ac4-4356-8ab4-099519ba218a             |
| b4988d1f-6546-4bb2-afd9-ab9afb211763 | Network | 76b3537c-4fbb-4f06-aa8c-795617a0821e 10.0.0.0/24 |
+--------------------------------------+---------+--------------------------------------------------+
{% endhighlight %}

Run a neutron port-list to get the ID of the port you created in step #1:**

{% highlight bash %}
$ neutron port-list
+--------------------------------------+-----------+-------------------+-------------------------------------------------------------------------------------+
| id                                   | name      | mac_address       | fixed_ips                                                                           |
+--------------------------------------+-----------+-------------------+-------------------------------------------------------------------------------------+
| 623ee416-b180-490c-83f1-274acf870e17 |           | fa:16:3e:c6:9a:9a | {"subnet_id": "c5cf95c4-3e36-43c0-9b07-bc73e7a4669b", "ip_address": "10.0.0.1"}     |
| 7c433d21-01d6-417c-8ce5-3744c76856ea | test      | fa:16:3e:42:e4:ff | {"subnet_id": "c5cf95c4-3e36-43c0-9b07-bc73e7a4669b", "ip_address": "10.0.0.50"}    |
| d96561f0-7ca6-45bc-a59d-1893c832c5a4 |           | fa:16:3e:42:c3:7d | {"subnet_id": "c5cf95c4-3e36-43c0-9b07-bc73e7a4669b", "ip_address": "10.0.0.2"}     |
+--------------------------------------+-----------+-------------------+-------------------------------------------------------------------------------------+
{% endhighlight %}

Next you'll use neutron floatingip-create to both allocate and assign floating IP to your port:**

```
neutron floatingip-create --port-id PORT_ID NETWORK_ID
```

**NOTE:** Ensure the NETWORK_ID you use is the ID for your Ext-Net network.

Example:
{% highlight bash %}
$ neutron floatingip-create --port-id 7c433d21-01d6-417c-8ce5-3744c76856ea 7da74520-9d5e-427b-a508-213c84e69616
Created a new floatingip:
+---------------------+--------------------------------------+
| Field               | Value                                |
+---------------------+--------------------------------------+
| fixed_ip_address    | 10.0.0.50                            |
| floating_ip_address | 15.126.215.195                       |
| floating_network_id | 7da74520-9d5e-427b-a508-213c84e69616 |
| id                  | 91ad98e7-08e0-4659-a17f-9102ccae6a53 |
| port_id             | 7c433d21-01d6-417c-8ce5-3744c76856ea |
| router_id           | cb49e750-d8d6-444a-92e6-ff091266697a |
| tenant_id           | 65589599430509                       |
+---------------------+--------------------------------------+
{% endhighlight %}

You can then run a neutron floatingip-list to confirm:

{% highlight bash %}
$ neutron floatingip-list
+--------------------------------------+------------------+---------------------+--------------------------------------+
| id                                   | fixed_ip_address | floating_ip_address | port_id                              |
+--------------------------------------+------------------+---------------------+--------------------------------------+
| 91ad98e7-08e0-4659-a17f-9102ccae6a53 | 10.0.0.50        | 15.126.215.195      | 7c433d21-01d6-417c-8ce5-3744c76856ea |
+--------------------------------------+------------------+---------------------+--------------------------------------+
{% endhighlight %}

### Create an instance

Then using the NovaClient you'd use that port to create the instance with this command:**

{% highlight bash %}
nova boot --flavor FLAVOR_ID --key-name KEYPAIR_NAME --image IMAGE_ID --security-groups SECGROUP_ID --nic port-id=PORT_ID INSTANCE_NAME
{% endhighlight %}

Example:

{% highlight bash %}
$ nova boot --flavor 101 --key-name SupportKey --image 85e8bfdf-d560-4a1b-9711-52692d422927 --security-groups 3ea1c931-4825-444c-9f02-f341a8f50cc5 --nic port-id=cd497879-11a2-41ce-9f01-9a3c9a377ab1 porttest
+-----------------------------+---------------------------------------------------------------------------------------------------+
| Property                    | Value                                                                                             |
+-----------------------------+---------------------------------------------------------------------------------------------------+
| OS-EXT-AZ:availability_zone | nova                                                                                              |
| OS-EXT-STS:power_state      | 0                                                                                                 |
| OS-EXT-STS:task_state       | scheduling                                                                                        |
| OS-EXT-STS:vm_state         | building                                                                                          |
| accessIPv4                  |                                                                                                   |
| accessIPv6                  |                                                                                                   |
| adminPass                   | i77xQq2knk6D                                                                                      |
| config_drive                |                                                                                                   |
| created                     | 2014-08-28T14:39:19Z                                                                              |
| flavor                      | standard.small (101)                                                                              |
| hostId                      |                                                                                                   |
| id                          | 6cf72910-93e4-4d82-90b1-892a012d6c69                                                              |
| image                       | Ubuntu Server 12.04.5 LTS (amd64 20140806) - Partner Image (85e8bfdf-d560-4a1b-9711-52692d422927) |
| key_name                    | SupportKey                                                                                        |
| metadata                    | {}                                                                                                |
| name                        | porttest                                                                                          |
| progress                    | 0                                                                                                 |
| security_groups             | 3ea1c931-4825-444c-9f02-f341a8f50cc5                                                              |
| status                      | BUILD                                                                                             |
| tenant_id                   | 65589599430509                                                                                    |
| updated                     | 2014-08-28T14:39:19Z                                                                              |
| user_id                     | 52552375567809                                                                                    |
+-----------------------------+---------------------------------------------------------------------------------------------------+
{% endhighlight %}

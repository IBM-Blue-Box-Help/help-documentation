---
layout: page
title:  "Add a Specific Fixed Private IP to an Instance"
dateAdded: June 19th, 2015
featured: true
weight: 4
tags: [neutron, fixed private IP address]
---

You shouldn't normally need to do this.  Instead, update your DNS records so you can use hostnames instead of IPs in your deployment scripts or other config files. If an IP changes, you update the DNS record.

If you absolutely must do this, there are a couple of options for adding a specific fixed private IP to an instance.  The first way (adding the fixed IP to an existing instance) isn't all that reliable, so we recommend the second way (assigning at first boot) instead.

To create a virtual network port and attach a new network interface card with a new fixed IP to an existing virtual machine, you can use the "neutron port-create" and "nova interface-attach" commands. For example:

{% highlight bash %}
neutron port-create --fixed-ip subnet_id=<subnet id from neutron net-list>,ip_address=10.230.80.71 --name net1 internal
nova interface-attach --port-id <port id you just created> <instance id from nova list>
{% endhighlight %}

Prior to booting a new instance, you can create a virtual network port with a fixed-ip. For example:

{% highlight bash %}
neutron port-create net1 --fixed-ip ip_address=10.230.80.71 <net-id>
nova boot --image <img> --flavor <flavor> --nic port-id=<port-id> <vm-name>
{% endhighlight %}

When choosing which net-id to use, you can run the command `neutron port-list` to get, for example, the internal network's subnet ID.



You may be wondering why you can't just use the command `nova add-fixed-ip` to add IPs to a running instance.  This command doesn't let you choose a specific IP.  Instead, it just adds an IP from the network ID that you specify.  

You can remove specific fixed IPs using the command `nova remove-fixed-ip`.

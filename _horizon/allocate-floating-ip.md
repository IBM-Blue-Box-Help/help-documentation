---
layout: page
title:  "Allocating and Attaching a Public (Floating) IP to an Instance"
dateAdded: June 16th, 2015
featured: true
weight: 4
tags: [horizon, fixed private IP address]
---

Floating IPs are just publicly routable IPs.  Customers can assign them to their instances, making them reachable from the outside world.

There are two basic parts to the floating IP process: **allocation** and **attachment**. You must attach because you don't want someone coming along and grabbing your IP.  Here's how to allocate and attach your new IP:

1. From your **Horizon Dashboard**, under the **Project** section, go to **Instances**.  Next to your Instance, pull down the dropdown box on the right and choose **Associate Floating IP**:

2. In the **Floating IP** dialog box, if you don't have any IPs listed in the dropdown, click the plus (+) sign to allocate a new floating IP to your account:

   ![Floating IP Dialog Box]({{site.baseurl}}/img/Floating_IP_Dialog_Box.png)

3. Allocate the IP to your pool by clicking the **Allocate IP** button:

   ![Allocate Floating IP]({{site.baseurl}}/img/Allocate_Floating_IP.png)

4. Observe your new floating IP in the dropdown. You can now click the **Associate** button to attach it to your instance.

   ![Associate Floating IP]({{site.baseurl}}/img/Associate_Floating_IP.png)

You also can create floating IPs from the [command line interface](http://docs.openstack.org/admin-guide-cloud/content/create_list_of_available_floating_ips.html).

* In OpenStack, floating IPs are publicly routable IPs that you assign to your VMs. What happens inside the VM once the floating IP is added? The answer is ... nothing. If you log in via SSH and display the network configuration, you will see there is still a single network interface with a fixed IP configured. All setup is done on the compute hypervisor itself. OpenStack Neutron sets up the NAT between the VM's fixed and floating IPs.

One of the big advantages of floating IPs is: If a VM dies, you can re-use the floating IP by attaching it to another VM.

For more information, please see: https://www.mirantis.com/blog/configuring-floating-ip-addresses-networking-openstack-public-private-clouds/

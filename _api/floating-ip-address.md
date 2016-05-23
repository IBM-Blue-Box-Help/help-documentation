---
layout: page
title:  "Creating a floating IP address using the OpenStack API"
featured: true
tags: [openstack, floating ip address, api]
author: Jason Kennedy
dateAdded: August 13th, 2015
---

Hey folks, today we're going to run through the process necessary to add a floating IP address to one of your instances. I touched on how to complete this at the end of [**Creating Additional Networks in OpenStack via the Horizon Panel**](http://ibm-blue-box-help.github.io/help-documentation/gettingstarted/commontech/creating-additional-networks-with-horizon/), so let's run this example through the terminal. The first thing to consider is that *creating* a floating IP doesn't actually create the address, it merely allocates one from the assigned pool. Let's take a look at what we have assigned:

{% highlight bash %}
$neutron net-list | grep external
| c3e6c57d-83fd-412e-a9f5-18ea9f566e7b | external | 5391022f-29c5-4c5b-b329-31dbfa7dece4 173.247.106.0/27 |

#neutron floatingip-create c3e6c57d-83fd-412e-a9f5-18ea9f566e7b
Created a new floatingip:
+---------------------+--------------------------------------+
| Field | Value |
+---------------------+--------------------------------------+
| fixed_ip_address | |
| floating_ip_address | 173.247.106.23 |
| floating_network_id | c3e6c57d-83fd-412e-a9f5-18ea9f566e7b |
| id | 953cda96-1a33-4645-a4e2-1b00d6e06736 |
| port_id | |
| router_id | |
| status | DOWN |
| tenant_id | 669d7a58eebb43b5b022f9d25dee47b5 |
+---------------------+--------------------------------------+
{% endhighlight %}

Now that the IP has been created, we can go ahead and attach it to our instance. We'll need the port ID of our instance's internal IP address, and the ID of the floating IP, which we can see above.

{% highlight bash %}
# nova list
+--------------------------------------+------------------------------+---------+------------+-------------+----------------------------------------+
| ID | Name | Status | Task State | Power State | Networks |
+--------------------------------------+------------------------------+---------+------------+-------------+----------------------------------------+
| ccffca1d-cb3f-4036-a450-226efd6e6eb3 | hwraid                       | ACTIVE  | -          | Running     | internal=10.230.16.131, 173.247.106.12 |
+--------------------------------------+------------------------------+---------+------------+-------------+----------------------------------------+
{% endhighlight %}

So there's our instance (pardon the formatting) and its internal IP. Let's now use that information to find the port.

{% highlight bash %}
# neutron port-list | grep 10.230.16.131
| 1a276fd5-1f88-4e5a-a9ca-b02671310c44 | | fa:16:3e:eb:fb:29 | {"subnet_id": "d813c41f-3235-4b00-a41b-1f17d4011a84", "ip_address": "10.230.16.131"} |
{% endhighlight %}

So there it is! Now all we need is the floating IP's ID. We already have that, under the `floating_network_id` above when we created it: `953cda96-1a33-4645-a4e2-1b00d6e06736`. The final step is to associate them.

{% highlight bash %}
# neutron floatingip-associate 953cda96-1a33-4645-a4e2-1b00d6e06736 1a276fd5-1f88-4e5a-a9ca-b02671310c44
Associated floatingip 953cda96-1a33-4645-a4e2-1b00d6e06736
{% endhighlight %}

The command `nova list` should now show you both IP addresses associated with your instance:

{% highlight bash %}
# nova list | grep [myinstance]
| ccffca1d-cb3f-4036-a450-226efd6e6eb3 | [myinstance]                       | ACTIVE  | -          | Running     | internal=10.230.16.131, 173.247.106.23 |
{% endhighlight %}

At any point you want, you may also disassociate a floating IP by running the command followed by the ID of the address in question. We'll disassociate the address we just assigned to our instance below.

{% highlight bash %}
# neutron floatingip-disassociate 953cda96-1a33-4645-a4e2-1b00d6e06736
Disassociated floatingip 953cda96-1a33-4645-a4e2-1b00d6e06736
{% endhighlight %}

You will note the address is no longer associated with your instance. Thanks!

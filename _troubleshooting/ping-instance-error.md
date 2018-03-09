---
layout: page
title:  "Why can't I SSH to an instance, or ping it?"
tags: [troubleshooting, ssh, ping]
dateAdded: December 10, 2015
dateUpdated: January 10, 2017
featured: true
---

A common problem occurs when customers are unable to SSH or ping an instance.  Here's what you can do to resolve this issue:

1. In your security groups, have you enabled port 22 TCP and all ICMP access?  You can do this task using the **Horizon** dashboard, or you can do it using the command line.

2. Have you assigned a floating IP address to the instance?

3. When you created the instance, did you assign just the Internal network to it?  If you assigned both the Internal and the External networks, you will need to recreate the instance using the Internal network only, and then assign a floating IP to it after the instance is created.

4. Is the floating IP address routable from the location you're pinging / SSHing from?  Try `route -n`.  Verify that the public subnet in **OpenStack** is accessible from the client.

5. Check to see if the private subnet and public subnet are connected to the router with `neutron router-show router1`.

6. Double-check that the subnet is attached to a router.  For example, here's an example of a subnet that is not attached to a router and can't route:

{% highlight bash %}
# neutron subnet-show fd67f721-b243-4a5d-a853-3dd359b5eec6
+-------------------+---------------------------------------------------+
| Field             | Value                                             |
+-------------------+---------------------------------------------------+
| allocation_pools  | {"start": "172.16.39.25", "end": "172.16.39.254"} |
| cidr              | 172.16.39.0/24                                    |
| created_at        | 2017-01-09T16:50:48                               |
| description       |                                                   |
| dns_nameservers   |                                                   |
| enable_dhcp       | True                                              |
| gateway_ip        | 172.16.39.1                                       |
| host_routes       |                                                   |
| id                | fd67f721-b243-4a5d-a853-3dd359b5eec6              |
| ip_version        | 4                                                 |
| ipv6_address_mode |                                                   |
| ipv6_ra_mode      |                                                   |
| name              | snet-data                                         |
| network_id        | 088a0728-8c80-42f8-bebb-5e8893011009              |
| subnetpool_id     |                                                   |
| tenant_id         | 629aef95f3db4f2b991b62fa40aeff39                  |
| updated_at        | 2017-01-09T16:50:48                               |
+-------------------+---------------------------------------------------+

# neutron port-list -c id -c device_owner -c fixed_ips | grep router_interface | grep fd67f721-b243-4a5d-a853-3dd359b5eec6
# <no results>
{% endhighlight %}

If you have done all of these steps and you can't get SSH or ping to work, and `ssh -vvv` isn't providing any clues, [contact us](http://ibm-blue-box-help.github.io/help-documentation/gettingstarted/commonadmin/report-issue/).  We will check the following items from our side:

 * Does the public network match the local LAN?

```
ip netns <public namespace id> ping <floating IP>
```

 * Is traffic is being routed correctly out of the instance?

```
ip netns exec <private namespace id>
```

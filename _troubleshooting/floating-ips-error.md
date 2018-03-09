---
layout: page
title:  "Why are all the floating IPs that were assigned to me not available?"
tags: [troubleshooting, floating ip]
dateAdded: July 22nd, 2015
featured: false
weight: 4
---

On any given CIDR block, the first and last IPs are not usable, because they're the network and broadcast addresses.  

Also, there must be at least two gateway IPs: One for access to your **Horizon** dashboard, and one for testing the reachability of your **Neutron** router.

Type the command
{% highlight bash %}
neutron subnet-list
{% endhighlight %}

to see your assigned CIDR block(s).

Type the command

{% highlight bash %}
neutron floatingip-list
{% endhighlight %}

to get a list of floating IPs and what they are assigned to.

You can get a list of ports that belong to a given tenant by running the command
`neutron port-list`.

If you've used all of your floating IPs, feel free to contact our sales team and we can discuss possible options.

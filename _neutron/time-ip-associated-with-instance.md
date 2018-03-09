---
layout: page
title:  "How can I find the time a floating IP was associated or disassociated from an instance?"
tags: [neutron, configuring ip, highly available]
dateAdded: November 16th, 2015
featured: false
weight: 4
---

If you need to find the date/time a floating IP address was associated or disassociated from an instance, you can [open a support ticket](http://support.bluebox.net) and ask that we check the `auth` log on the hypervisor where your instance is located.  The log entry will look similar to:

{% highlight bash %}
Oct 14 23:24:59 hypervisor-name sudo: neutron ... neutron-rootwrap /etc/neutron/rootwrap.conf
ip netns exec qrouter-tea045f7-6a1c-4687-8a5e-ffecd51b2bcf ip -4 addr del 179.147.93.21/32 ...
{% endhighlight %}

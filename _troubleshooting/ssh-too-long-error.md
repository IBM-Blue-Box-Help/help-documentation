---
layout: page
title:  "Why does it take 4-5 seconds to SSH to my instance?"
tags: [troubleshooting, ssh]
dateAdded: November 17th, 2015
featured: true
---

The DNS settings on the instance might be wrong.  You can update the DNS servers as follows:

{% highlight bash %}
neutron subnet-update internal --dns_nameservers list=true 8.8.4.4 8.8.8.8
{% endhighlight %}

You will need to reboot the instance for the new DNS servers to be pulled in, or you can wait for the DHCP lease to be renewed.  You might also need to replace "internal" in the command above with the actual subnet UUID, which you can gain from running `neutron subnet-list`.

You can also speed up connections by setting `UseDNS` to "no" in `/etc/ssh/sshd_config`. (It defaults to yes.)

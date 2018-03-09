---
layout: page
title:  "Configuring DNS for Instances"
tags: [neutron, configuring dns, instances]
dateAdded: December 3rd, 2015
author: Eric French
featured: false
weight: 4
---

By default, your **IBM Bluemix Private ** Cloud will use the DHCP service provided by **Neutron** to resolve instances by name.  If the primary controller fails and the secondary controller node assumes control, the resolver address will change, breaking resolution for any running instances.

This article assumes that you have the **OpenStack API** configured on your local machine. For assistance, please see [**Getting Started with the OpenStack API**](http://ibm-blue-box-help.github.io/help-documentation/openstack/api/openstack-api-getting-started/).

To prevent this possibility of breaking resolution in case of failover, we recommend one of the following methods:

If your **IBM Bluemix Private** Cloud deployment utilizes **Microsoft Active Directory**, you have the option of accessing the **Active Directory** or similar existing internal DNS infrastructure.

Enter the following command, where `10.0.100.100` is the IP address of your **Active Directory** server:

{% highlight bash %}
$ neutron subnet-update internal --dns_nameservers list=true 10.0.100.100
{% endhighlight %}

If **Active Directory** is not deployed, you can use a public DNS server, such as:

{% highlight bash %}
$ neutron subnet-update internal --dns_nameservers list=true 8.8.8.8
{% endhighlight %}

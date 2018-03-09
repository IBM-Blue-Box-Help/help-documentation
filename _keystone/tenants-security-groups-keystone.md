---
layout: page
title:  "Projects and Security Groups"
tags: [keystone, projects, tenants, security groups]
dateAdded: July 28th, 2015
featured: false
weight: 4
---

**How can I get a list of projects from the command line?**

{% highlight bash %}
$ openstack project list
+----------------------------------+---------+
| ID                               | Name    |
+----------------------------------+---------+
| 2b724e8f6ede4676938899457055a48c | admin   |
| 43888d7305334806a0658e02fff03309 | demo    |
| 8efeea7692e345bd81a326d0381311a7 | service |
+----------------------------------+---------+
{% endhighlight %}

**Are security groups shared between projects?**

No.  Each project has its own independent set of security groups.

---
layout: page
title:  "Why can't I delete my project/tenant from the Horizon dashboard?"
tags: [troubleshooting, delete project]
dateAdded: November 13th, 2015
featured: false
weight: 4
---

Occasionally, you might try to delete a project from the Horizon dashboard but it doesn't work. When you click **Delete Project**, the screen refreshes but the project is still listed and no messages are displayed.

To workaround this problem, use the keystone command line client, as in the following example:
{% highlight bash %}
keystone tenant-list
{% endhighlight %}

(to get a list of tenant IDs)

{% highlight bash %}
keystone tenant-delete bfb4e3f449084968ad23d8d3f6f25b3b
{% endhighlight %}
(to delete a tenant using its tenant ID)

If you still have trouble, please **open a support ticket**.

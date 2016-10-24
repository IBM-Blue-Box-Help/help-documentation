---
layout: page
title:  "Error: 'Server doesn't support microversions' When Running Nova Commands"
tags: [troubleshooting, microversions, nova]
dateAdded: October 20th, 2015
featured: true
---

If you run a **Nova** command such as `nova list` you could get the following error:

{% highlight bash %}
# nova list
ERROR (UnsupportedVersion): Server doesn't support microversions
{% endhighlight %}

Recent versions of **Nova** client attempt to use the version 3 API, which adds fine-grained versioning.  This capability is not yet supported in **IBM Bluemix on OpenStack**.

You can add the following line to your `stackrc` file to resolve this mismatch problem:

`export OS_COMPUTE_API_VERSION=2`

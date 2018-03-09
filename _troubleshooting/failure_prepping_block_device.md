---
layout: page
title:  "Error: Failure prepping block device"
tags: [troubleshooting, nova, glance, cinder]
dateAdded: June 14th, 2016
featured: false
weight: 4
---

When booting a new instance using 'Boot from image (creates a new volume)', you may experience the following error:

{% highlight bash %}
Failed to perform requested operation on instance "test-instance", the instance has an error
status: Please try again later [Error: Build of instance c57f6717-a0fc-4c26-960a-66a958a4ba3d
aborted: Failure prepping block device.].
{% endhighlight %}

This is caused by a known bug in Nova. To remedy this issue, you can do the following:

1. Create a new volume manually, specifying your image to be copied into the volume.
2. Set that volume to be bootable via Cinder
3. Create a new instance with "Boot from volume"

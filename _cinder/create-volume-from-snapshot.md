---
layout: page
title:  "Is creating a volume from an instance snapshot supported?"
tags: [cinder, snapshot]
dateAdded: September 8th, 2015
author: Blue Box Support
featured: false
weight: 4
---

Yes, provided you are running at least the 1.2.x version of our **IBM Blue Box Cloud** stack, and you have the appropriate packages installed on your dedicated **Cinder** node.  Please [contact our support team](https://support.bluebox.net/) to learn whether that's the case.

Here is an example showing how you would create a volume from an instance snapshot:

{% highlight bash %}
nova boot --flavor m1.small --image ubuntu-14.04.2 --nic net-id=b25625cc-2f6b-48c2-b740-08e2b0503a12 testinstance
nova stop testinstance
nova image-create --poll testinstance test-vol
nova image-list
cinder create --image-id 4bb4621c-ae8a-40d2-9e8f-9fe8495f07f1 --display-name test --availability-zone nova 160
{% endhighlight %}

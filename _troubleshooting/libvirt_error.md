---
layout: page
title:  "Instance in error status: libvirt error"
tags: [troubleshooting, libvert, error]
dateAdded: December 3rd, 2015
featured: true
---

Rarely, you might see an instance go into an error state, and the usual command

`nova reset-state --active INSTANCE-ID`

doesn't work for getting it operational again.  If you try to view the instance's console log, it's empty, and the command

`nova show INSTANCE-ID`

shows an error similar to:

{% highlight bash %}
internal error: process exited while connecting to monitor:
Length mismatch: vga.vram: 1000000 in != 800000 qemu:
warning: error while loading state for instance 0x0 of device 'ram' load of migration failed ...
raise libvirtError (\'virDomainCreateWithFlags() failed\'
{% endhighlight %}

If this happens to you, please [**open a support ticket**](http://support.bluebox.net) and have us issue the command

`virsh start --force-boot instance-000000cd`

for the relevant instance.

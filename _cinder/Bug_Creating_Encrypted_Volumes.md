---
layout: page
title:  "Creating Encrypted Volumes with Cinder is Not Supported"
tags: [cinder, encryption, volumes]
author: Blue Box Support
dateAdded: June 13th, 2016
featured: false
weight: 4
---

### Creating Encrypted Volumes with Cinder is Not Currently Supported  

Try to create an encrypted Cinder volume with Ceph (for example) and the Cinder command line client will happily report that it has done so, but the volume will fail to attach to a virtual machine. If you enter these "normal" commands at the prompt, be aware that **they will not work** because encrypted volumes will not work at all:

{% highlight bash %}

cinder type-create LUKS

cinder encryption-type-create --cipher aes-xts-plain64 \
--key_size 512 \
--control_location front-end \
LUKS \
nova.volume.encryptors.luks.LuksEncryptor \

{% endhighlight %}

This false acknowledgement happens even though creating encrypted volumes with Ceph is not supported - see https://review.openstack.org/#/c/239798/

This is a known bug, tracked at: https://bugs.launchpad.net/cinder/+bug/1505113

**Update:**  We tested on OCTOBER 3, 2016, and this is still true. Attaching of encrypted volumes to a virtual guest will fail, because OpenStack Compute service will not run encryption providers.

+### Do you support ephemeral disk encryption?
+
+No. For handling crypto keys for customer data, we recommend that you use encryption inside the VM and encrypt objects before sending them to Swift.

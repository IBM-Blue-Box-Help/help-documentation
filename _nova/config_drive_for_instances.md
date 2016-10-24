---
layout: page
title:  "Can I create an instance and add files to it using config drive?"
tags: [nova, inject files, config drive]
dateAdded: June 1, 2016
featured: false
author: Ying Tang
editor: Leslie Lundquist
weight: 4
---
In IBM Bluemix on OpenStack Release 3.0, this feature is by default **not enabled**: The `force_config_drive` parameter in the `nova.conf` file is set to `false`. This is because support of this feature depends on the image from which the new instance is booted. Some of the customer images may not support this option. 

When using config drive, a filesystem is prepared by the hypervisor and attached to the instance. This method reduces any security risk, because arbitrary data from the instance is not processed in the hypervisor context. Traditional file injection, which refers to mounting of the instance filesystem by the hypervisor to write additional files to the instance's file system, presents the possibility that the instance filesystem could be malformed in such a way as to exploit a vulnerability in the hypervisor, resulting in code execution. Vulnerabilities of this kind once were commonplace.

If you want to allow the introduction of files while booting an instance, you can pass the `--config-drive true` option to the `nova boot` command to enable this feature. For example,

{% highlight bash %}
nova boot --image <image_name> --flavor <flavor> --nic <net-id=net_uuid> --security-group <security_group> --key-name <key_name> --file <dst_path=src_path> --config-drive true <instance_name>
{% endhighlight %}
	
For more information about the injected files and quotas, see [Manage Compute service quotas](http://docs.openstack.org/admin-guide/cli_set_compute_quotas.html). 
For more information about the `nova boot` command, see [Compute command-line client reference](http://docs.openstack.org/cli-reference/nova.html).


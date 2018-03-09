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
In IBM Bluemix Private Cloud Release 3.0, this feature is not enabled by default. The `force_config_drive` parameter in the `nova.conf` file is set to `false`. This is because support of this feature depends on the image from which the new instance is booted. Some customer images may not support this option. 

When using config drive, a filesystem is prepared by the hypervisor and attached to the instance. This method reduces security risk; arbitrary data from the instance is not processed by the hypervisor. Traditional file injection (mounting of the instance filesystem by the hypervisor to write additional files to the instance's file system) presents the possibility that the instance filesystem could be malformed in such a way as to exploit a vulnerability in the hypervisor, resulting in code execution. Vulnerabilities of this kind were once commonplace.

If you want to allow the introduction of files while booting an instance, pass the `--config-drive true` option to the `nova boot` command to enable this feature. For example:

```
nova boot --image <image_name> --flavor <flavor> --nic <net-id=net_uuid> --security-group <security_group> --key-name <key_name> --file <dst_path=src_path> --config-drive true <instance_name>
```
	
For more information about the injected files and quotas, see [Manage Compute service quotas](http://docs.openstack.org/admin-guide/cli_set_compute_quotas.html). 
For more information about the `nova boot` command, see [Compute command-line client reference](http://docs.openstack.org/cli-reference/nova.html).


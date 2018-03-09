---
layout: page
title:  "How can I create an instance with the Nova command line client?"
tags: [nova, boot, ephemeral]
dateAdded: June 1, 2016
author: Ying Tang
featured: false
weight: 4
---

You can use Nova command line client to launch an instance. For example, to create a VM from an image while attaching an ephemeral disk, use the following command:

	$ nova boot <vm_name> --flavor <flavor_name> --image <image_name> --security-groups <security_group_name> --nic net-id=<network_ID> --ephemeral size=<size_GBs>

* `<vm_name>`: Name of the instance.
* `--flavor <flavor_name>`: Name or ID of flavor.
* `--image <image_name>`: Name or ID of image.
* `--security-groups <security_group_name>`: Comma separated list of security group names.
* `--nic net-id=<network-ID>`: Create a NIC on the server.
* `--ephemeral size=<size_GBs>`: Create and attach a local ephemeral block device of <size_GBs> GB.

For more information about the `nova` command, see [Nova command line client](http://docs.openstack.org/cli-reference/nova.html).
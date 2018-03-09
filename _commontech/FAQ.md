---
layout: page
title:  "Technical FAQ"
featured: true
weight: 8
tags: [getting started, faq, resize, instance, admin, project, forbidden ports, ports, security groups]
author: Eric French, Ulysses Kanigel, Leslie Lundquist
dateAdded: April 9th, 2015
updated: March 18, 2016
editor: Leslie Lundquist
---

## Table of Contents

 * [How can I resize an existing instance?](#how-can-i-resize-an-existing-instance)
 * [How can I start up an instance on a specific host?](#how-can-i-start-up-an-instance-on-a-specific-host)
 * [I have a new cloud, and there are already two projects in place. What are these?](#i-have-a-new-cloud-and-there-are-already-two-projects-in-place-what-are-these)
 * [Which ports/URLs etc are publicly accessible on my Bluemix Private Cloud, and for what purpose?](#which-ports-urls-etc-are-publicly-accessible-on-my-bluemix-private-cloud-and-for-what-purpose)
 * [How can I measure IO Operations Per Second on an instance's or a volume's drive?](#how-can-i-measure-io-operations-per-second-on-an-instances-or-a-volumes-drive)
 * [When using security groups, how can I log refused TCP connections to forbidden ports?](#when-using-security-groups-how-can-i-log-refused-tcp-connections-to-forbidden-ports)
 * [What is the maximum number of virtual devices (for example, ports) that can be attached to a virtual machine?](#what-is-the-maximum-number-of-virtual-devices-for-example-ports-that-can-be-attached-to-a-virtual-machine)
 * [How can I get a list of all my VMs and their host names?](#how-can-i-get-a-list-of-all-my-vms-and-their-host-names)
 * [Does the command `openstack host show disk name` show the actual hard disk usage of the physical host?](#does-the-command-openstack-host-show-disk-name-show-the-actual-hard-disk-usage-of-the-physical-host)
 * [How can I create a volume from a snapshot and remove dependencies?](#how-can-i-create-a-volume-from-a-snapshot-and-remove-dependencies)
 
### How can I resize an existing instance?

Although the `Resize Instance` option does appear in **Horizon**, this functionality currently is not supported. If you need to extend an instance's size, the recommended path is to take a snapshot of the instance and redeploy that snapshot into a new, larger flavor.


### How can I start up an instance on a specific host?
This functionality is supported through the **OpenStack API**.  Please see [How to deploy an instance to a specific hypervisor node](http://ibm-blue-box-help.github.io/help-documentation/nova/deploy-to-specific-hypervisor/) for more details.


### I have a new cloud, and there are already two projects in place. What are these?

The `admin` and `service` projects are created to support the underlying operation of your **IBM Bluemix Private Cloud**. These projects should be left in place. Do not modify or deploy them.


### Which ports/URLs etc are publicly accessible on my Bluemix Private Cloud, and for what purpose?

The ports that are open through the firewall to your Bluemix Private Cloud are:

```
80 - horizon (OpenStack Web Portal)
443 - horizon (OpenStack Web Portal)
5000 - keystone (OpenStack Authentication API)
6080 - nova-novnc (OpenStack VNC Console)
8000 - heat (OpenStack CloudFormation API)
8004 - heat (OpenStack Orchestration API)
8774 - nova (OpenStack Compute API)
8776 - cinder (OpenStack Block Storage API)
9292 - glance (OpenStack Image API)
9696 - neutron (OpenStack Network API)
35357 - keystone-admin (OpenStack Authentication Admin API)
```

Three additional ports are enabled if you've requested Swift (OpenStack Object Storage) to be configured on your cluster: `6000, 6001, 6002`

All of these ports are available via your custom Horizon URL.

If you also need to restrict egress ports to the bare minimum, you will need to open at least ports 67/68 for DHCP and port 80 for metadata.

### How can I measure IO Operations Per Second on an instance's or a volume's drive?


You can use any number of tools to measure disk performance.

A particularly easy to use Python script for measuring IOPS by Benjamin Schweizer, with instructions and example results is available:

`https://benjamin-schweizer.de/measuring-disk-io-performance.html`

The latest version of this script currently [is available here.](https://benjamin-schweizer.de/files/iops/iops-2011-02-11)

Usage is as follows: 

    iops [-n|--num_threads threads] [-t|--time time] <device> 

Parameters:

    threads := number of concurrent io threads, default 1
    time    := time in seconds, default 10
    device  := some block device, like /dev/sda or \\\\.\\PhysicalDrive0

Examples:

    iops /dev/sda
    iops -n 8 -t 2 /dev/disk0
    iops --num_threads 1 --time 2 /dev/md1
    iops --num_threads 16 --time 2 /dev/md1

### When using security groups, how can I log refused TCP connections to forbidden ports?

If you want to log refused TCP connections to forbidden ports, you'll need to open up security groups and run `iptables` with logging on the instances.

### What is the maximum number of virtual devices (for example, ports) that can be attached to a virtual machine?

20 is the maximum number of virtual PCI slots available. 

### How can I get a list of all my VMs and their host names?

Need a list of all instances on a cloud with the host they live on? Need the names of the VMs, too? 
If you are `cloud_admin`, there’s a one-liner for that!

```
nova list --all-tenants --fields name,OS-EXT-SRV-ATTR:host

```
### Does the command `openstack host show disk name` show the actual hard disk usage of the physical host?

No. It shows info about the flavors of the instances that run on hosts. At this time, swap usage information is not included. The section that follows shows what is included as of the Mitaka release.

Also see https://derpops.bike/2016/10/07/openstack-nova-and-hypervisor-disk-consumption/

To help answer this question, we need to turn to the OpenStack documentation: http://docs.openstack.org/admin-guide/common/nova-show-usage-statistics-for-hosts-instances.html

 * The `disk_gb` column [in the `openstack host show` output] shows the sum of the root and ephemeral disk sizes (in GB) of the instances that run on the host. [This value is] computed by using information about the flavors of the instances that run on the hosts. This command does not query the ... hard disk usage of the physical host.
 * You can see the actual flavor calculation in https://github.com/openstack/nova/blob/c521ba7fa679b6e9c790d84ea22f04fb999987db/nova/notifications/base.py#L448-L454 `disk_gb = root_gb + ephemeral_gb`
 * ephemeral_gb = Specifies the size of a secondary ephemeral data disk. This is an empty, unformatted disk that exists only for the life of the instance. The default value is 0. 
 * root_gb = Amount of disk space (in gigabytes) to use for the root (/) partition.
 * Nova's `disk_gb` does NOT currently include swap information. (That is, optional swap space allocation for the instance. The default value is 0.)

Work is proposed for the OpenStack Newton release that would start including this optional swap space, as per this spec  https://specs.openstack.org/openstack/nova-specs/specs/newton/implemented/resource-providers-allocations.html: 

"When the compute node utilizes local storage for instance disks OR was booted from volume, the value used should be the sum of the `root_gb`, `ephemeral_gb`, and `swap` field values of the flavor. The `resource_provider_uuid` should be the compute node’s UUID. Note that for instances that were booted from volume, the `root_gb` value will be 0." 

### How can I create a volume from a snapshot and remove dependencies?

When you create a volume from a snapshot, the original snapshot can hold dependent (meta)data that the volume(s) need.  You can run `openstack volume show $volumeid` to find the parent snapshot_id.  When you then try to delete the volume, you may run into an error due to the dependent snapshot needing to be deleted first:

`Failed to delete snapshot with name or ID ...`

A way around this is to create an image from the volume and then create a volume from that image:

**Step 1:** Create a temporary image from a volume:

```
openstack image create --volume $volumeid $image_name
```

**Step 2:** Create a volume from the temporary image:

```
openstack volume create --image $imageID --size $x
```

You can then delete the temporary image and you will have an independent volume.

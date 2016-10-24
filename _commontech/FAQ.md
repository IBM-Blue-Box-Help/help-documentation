---
layout: page
title:  "Technical FAQ"
featured: true
weight: 8
tags: [getting started, faq, resize, instance, admin, project]
author: Eric French
dateAdded: April 9th, 2015
updated: March 18, 2016
editor: Leslie Lundquist
---

### How can I resize an existing instance?

Although the `Resize Instance` option does appear in **Horizon**, this functionality currently is not supported. If you need to extend an instance's size, the recommended path is to take a snapshot of the instance and redeploy that snapshot into a new, larger flavor.


### How can I start up an instance on a specific host?
This functionality is supported through the **OpenStack API**.  Please see [How to deploy an instance to a specific hypervisor node](http://ibm-blue-box-help.github.io/help-documentation/nova/deploy-to-specific-hypervisor/) for more details.


### I have a new cloud, and there are already two projects in place. What are these?

The `admin` and `service` projects are created to support the underlying operation of your **IBM Bluemix on OpenStack**. These projects should be left in place. Do not modify or deploy them.


### Which ports/URLs etc are publicly accessible on my Bluemix on OpenStack, and for what purpose?

The ports that are open through the firewall to your IBM Bluemix on OpenStack are:

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

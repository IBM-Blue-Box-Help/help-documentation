---
layout: page
title:  "How can I get hypervisor statistics?"
featured: true
weight: 8
tags: [nova, hypervisor, statistics]
dateAdded: June 23rd, 2015
dateUpdated: February 3, 2017
---

** How can I get hypervisor statistics? **

A hypervisor creates and runs virtual machines (VMs).  Sometimes it's useful to get statistics on the state of your hypervisors across all compute nodes.  You can do so by running the command `nova hypervisor-stats` as a user with the cloud_admin role:

{% highlight bash %}
$ nova hypervisor-stats
+----------------------+--------+
| Property             | Value  |
+----------------------+--------+
| count                | 3      |
| current_workload     | 3      |
| disk_available_least | 761    |
| free_disk_gb         | 1139   |
| free_ram_mb          | 103396 |
| local_gb             | 3294   |
| local_gb_used        | 2155   |
| memory_mb            | 386020 |
| memory_mb_used       | 282624 |
| running_vms          | 18     |
| vcpus                | 96     |
| vcpus_used           | 83     |
+----------------------+--------+
{% endhighlight %}


** Box Panel Hypervisor Stats vs. Nova Compute Hypervisor Stats **
When looking at the Box Panel UI, you may see a discrepancy among the reported resource values for the hypervisors. For example, in Box Panel, you might see a node with 96 CPUs and 3TB of storage.  But if you look at the statistics for the same node in the statistics portion of the UI, you might only see, say, 63 CPUs and 1.9TB of storage.

This is due to a known bug in the Box Panel where the number of CPUs/Disk reported for each individual server may be higher than what is actually available to Nova Compute.

So how do you tell which statistic is usable?  Use the lower of the two values.  The statistics UI reports the amount of CPUs and Disk that is actually available to Nova Compute.  If you would like to verify the numbers, open a ticket with our support team and request a hypervisor usage report.  We will be happy to send you a concise summary snapshot of your currently available resources.

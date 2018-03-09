---
layout: page
title:  "Why Can't I See My New vCPUs Listed in Horizon?"
dateAdded: August 1st, 2016
featured: false
weight: 4
tags: [troubleshooting, horizon, nova, overcommit, hypervisor, vcpu]
---

**Q.** After you enabled 2x CPU overcommit on my cluster, why aren't the new vCPUs listed in Horizon's Hypervisor Summary Screen?

**A.** The `cpu_allocation_ratio` (overcommit) is internally factored in to the decisions made by the **Nova** scheduler. As a result, while the API (Horizon) only lists, for example, 283 vCPUs total, as shown in the figure below, you will find that you are able to concurrently schedule new instances that require significantly more, up to the expected total (in this example) of 566. This is handled by the CoreFilter filter in the scheduler.

![Hypervisor Summary Screen]({{site.baseurl}}/img/Hypervisor_Summary.png)

**Q.** How do I view the Hypervisor Summary Screen?

**A.** Login to **Horizon** as a user with the `cloud_admin` role.  Select **System** on the left, and then select **Hypervisors** to see the summary.

**Q.** Why don't my currently running virtual machines show the extra CPUs after overcommit was enabled?

**A.** Enabling overcommit does not affect any currently running virtual machines.  It only affects new virtual machines you create after overcommit is enabled.

**Q.** Why does my vCPU quota look so low?

**A.** Are you perhaps looking at the *Limit Summary* instead of the *Hypervisor Summary*?  Under *Limit Summary* in Horizon, the top graph is actually showing the *quota limits* for the project you're currently looking at. In each cloud, when you're looking at the Limits graphs in Horizon, you're viewing the quota limits for the project you're currently under, not total CPUs across the cluster and across all projects.

You can update quotas using the command line by following the examples at http://ibm-blue-box-help.github.io/help-documentation/openstack/userdocs/quotas/#compute-quotas

**Q.** How does overcommitting CPU work?

**A.** Turning on overcommitment of CPU affects how the nova scheduler places new instances across your hypervisors. It limits on which compute node you can place new instances. If you were trying to place a new VM on your cluster before and didn't have enough CPU resources to do so, overcommit gives you that room. Existing VMs will use the resources they were assigned with. For example, a VM with 16 vCPUs will continue to use 16 vCPUs.

The performance of existing VMs doesn't suddenly decrease when you turn on overcommit. Overcommit affects the number of vCPUs that are presented to nova scheduler internally when scheduling new instances to be placed on hypervisors. Also, an instance will never overcommit against itself, only against other instances. As long as you are not running every single instance on one compute node at 100% at the same time, performance will not be significantly degraded and the linux scheduler will efficiently balance the load between VMs.

To maximize performance, allocate the minimum amount of virtual processors necessary for each guest operating system to successfully operate. Do not allocate virtual processors to guest operating systems that the guest operating systems do not need.

**Q.** What's the difference between leaving overcommitment of CPU off and leaving it on?

**A.** Without overcommit, each VM gets its own cores, and nova won't place them on top of each other. So one spiky VM won't necessarily impact another VM on the same hypervisor, barring whatever base operating system processes get slowed down by one or more cores being spiked.

With overcommit, VMs on the same hypervisor share cores when spikes happen, so you may want to avoid placing multiple known spiky VMs on the same compute node. You wouldn't want, for example, two DB servers in a master-master configuration on the same node. You can place them on separate nodes via anti-affinity groups, as described at https://raymii.org/s/articles/Openstack_Affinity_Groups-make-sure-instances-are-on-the-same-or-a-different-hypervisor-host.html Note that you can only do this with new VMs. Existing VMs that you want on different compute nodes would have to be re-deployed to take advantage of anti-affinity placement.

For more information, see:

* https://bugs.launchpad.net/horizon/+bug/1202965
* https://ask.openstack.org/en/question/12699/nova-compute-question-about-cpu_allocation_ratio/?answer=24673#post-id-24673 (Thanks to _sgordon_ on ask.openstack.org for this information.)

---
layout: page
title:  "How can I define flavor vCPU topology?"
tags: [nova, compute, vCPU]
dateAdded: December 16th, 2015
featured: true
weight: 4
---

You can define flavor vCPU topology, for example, you can prevent a flavor from exceeding 2 sockets but still have 4 cores, on any **Juno** or higher stack, as noted at [Virt driver guest vCPU topology configuration](https://specs.openstack.org/openstack/nova-specs/specs/juno/implemented/virt-driver-vcpu-topology.html).

Use these commands:

{% highlight bash %}
nova flavor-create m1.windowsdesktop auto 8192 40 4
nova flavor-key m1.windowsdesktop set hw:cpu_max_sockets=2
nova flavor-list --extra-specs
{% endhighlight %}

The virtualization driver will calculate the exact number of cores/sockets/threads based on the flavor vCPU count and this maximum sockets constraint.

You can define:

* `hw:cpu_sockets=NN` - preferred number of sockets to expose to the guest
* `hw:cpu_cores=NN` - preferred number of cores to expose to the guest
* `hw:cpu_threads=NN` - preferred number of threads to expose to the guest
* `hw:cpu_max_sockets=NN` - maximum number of sockets to expose to the guest
* `hw:cpu_max_cores=NN` - maximum number of cores to expose to the guest
* `hw:cpu_max_threads=NN` - maximum number of threads to expose to the guest

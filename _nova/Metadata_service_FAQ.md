---
layout: page
title: Metadata Service in OpenStack Neutron and Nova
author: Ulysses Kanigel
dateAdded: December 2, 2016
weight: 5
featured: true
tags: [metadata, service, timeout, config drive]
---
## Table of Contents
 * [**Why would you want to use the Nova/Neutron metadata service?**](#q-why-would-you-want-to-use-the-novaneutron-metadata-service)
 * [**What do I need in my guest OS to make use of the metadata service?**](#q-what-do-i-need-in-my-guest-os-to-make-use-of-the-metadata-service)
 * [**Why would you NOT want to use the Nova/Neutron metadata service?**](#q-why-would-you-not-want-to-use-the-novaneutron-metadata-service)
 * [**What can I do when it times out?**](#q-what-can-i-do-when-it-times-out)
 * [**Is there a simpler, more reliable alternative?**](#q-is-there-a-simpler-more-reliable-alternative)
 * [**What are the caveats to using ConfigDrive?**](#q-what-are-the-caveats-to-using-configdrive)
 * [**What's the difference between metadata and userdata?**](#q-whats-the-difference-between-metadata-and-userdata)
 * [**I want to use userdata with Heat, but my data is over the 16K limit. What should I do?**](#q-i-want-to-use-userdata-with-heat-but-my-data-is-over-the-16k-limit-what-should-i-do)
 * [**What are the 4 types of metadata and how can I use them?**](#q-what-are-the-4-types-of-metadata-and-how-can-i-use-them)
 * [**Where can I find out more about the OpenStack Metadata Service?**](#q-where-can-i-find-out-more-about-the-openstack-metadata-service)

#### Q. Why would you want to use the Nova/Neutron metadata service?

**A.** The Nova/Neutron metadata service is a way to inject customizations into instances via the network.  You may want to add SSH keys, passwords, hostnames, and custom scripts, for example.  The metadata service runs on 169.254.169.254 and it proxies the commands it receives to Nova.

#### Q. What do I need in my guest OS to make use of the metadata service?

The guest OS must run a software package called `cloud-init` so that metadata can work automatically on boot up. During boot, `cloud-init` calls into the metadata service to customize the instances, based on metadata that the user passes in during the creation of the instance.

#### Q. Why would you NOT want to use the Nova/Neutron metadata service?

**A.** Because it's implemented in a complex way that sometimes fails.  Neutron does not really run the metadata service.  Instead, it runs a proxy for metadata. The actual metadata service is owned by Nova.  You can see a diagram of how the service works at: 

![Openstack_metadata.png]({{site.baseurl}}/img/Openstack_metadata.png)

(Image credit: Matt Dorn)

If you really want to see how complicated it gets, check out [https://www.suse.com/communities/blog/vms-get-access-metadata-neutron/](https://www.suse.com/communities/blog/vms-get-access-metadata-neutron/). Problems can occur anywhere along the data flow. Most often, you'll get an error in `nova console-log` similar to:

```
2016-11-30 17:09:33,599 - url_helper.py[WARNING]: Calling 'http://169.254.169.254/2009-04-04/meta-data/instance-id'
failed [50/120s]: request error [HTTPConnectionPool(host='169.254.169.254', port=80): Read timed out.
(read timeout=50.0)]
```

**or**

```
checking http://169.254.169.254/2009-04-04/instance-id
failed 1/20: up 1.13. request failed
...
failed 20/20: up 229.58. request failed
failed to read iid from metadata. tried 20
```

If you see it trying to connect to an IP like 192.168.0.2 instead of 169.254.169.254, this means it's trying to get metadata from the DHCP agent if 169.254.169.254 is timing out.


#### Q. What can I do when it times out?

**A.** From inside the instance, try manually accessing the metadata service with `curl http://169.254.169.254/latest/meta-data/`.  To help narrow it down further, try temporarily relaxing your security group rules, and your SELinux settings.  You can also try a different image, preferably one of the official IBM provided images.

If that doesn't work, open a support ticket and request a restart of these services on both of your controller (network) nodes.

 * neutron-metadata-agent (on both network nodes)
 * neutron-l3-agent (on both network nodes)
 * neutron-dhcp-agent (on both network nodes)
 * neutron-linuxbridge-agent (on the compute node that the instance is on)

After these agents are restarted, the technician also should scan for stuck Neutron ports, and fix them if he sees any.  In most cases, a `neutron-metadata-agent` restart followed by an instance reboot resolves the problem.

#### Q. Is there a simpler, more reliable alternative?

**A.** Yes!  It's ConfigDrive.  It eliminates all the complexity of dealing with the Neutron metadata agent.  ConfigDrive brings your data closer to your instance by putting it on a virtual CD-ROM / ISO that is mounted and unmounted during `cloud_init`.  Use it like so:

```
nova boot --config-drive true --image my-image-name --flavor my-flavor myinstance
```

Read more at: [http://docs.openstack.org/user-guide/cli-config-drive.html](http://docs.openstack.org/user-guide/cli-config-drive.html)

#### Q. What are the caveats to using ConfigDrive?

**A.** The main caveat is that, with ConfigDrive, live migration is forbidden due to a bug in `libvirt` of copying a read-only disk. There is a patch at [https://bugs.launchpad.net/nova/+bug/1246201/comments/65](https://bugs.launchpad.net/nova/+bug/1246201/comments/65) that fixes this problem, but only when block migration is used.  Since block migration isn't supported yet in our current release, we will not be adding this patch.

As an aside, also note that live migration itself is restricted to support technician use in one rare circumstance: when evacuating a host when a planned maintenance is going to happen that would otherwise disrupt customer workload.  Even in this one use case, it is only supported for instances that are boot from volume.

#### Q. What's the difference between metadata and userdata?

**A.** Instance metadata is mainly consumed by Nova instances, and it usually includes instance hostnames, SSH keys, etc.

User data is mainly consumed by Heat, and it usually includes instance root passwords and startup scripts.

#### Q. I want to use userdata with Heat, but my data is over the 16K limit. What should I do?

**A.** Use an include in your userdata to fetch the script and bypass the size limitation:

```
#include
http://example.com/yourscript.txt
```

#### Q. What are the 4 types of metadata and how can I use them?

The 4 types are: *meta-data*, *user-data*, *vendor-data*, and *network-data*.  Read more about these types and how to use them at [http://www.madorn.com/openstack-metadata-types.html#.WEHS63eZMl4](http://www.madorn.com/openstack-metadata-types.html#.WEHS63eZMl4)

#### Q. Where can I find out more about the OpenStack Metadata Service?

**A.** Check out Matt Dorn's excellent video workshop from the Austin OpenStack Summit: [http://www.madorn.com/openstack-metadata-service.html](http://www.madorn.com/openstack-metadata-service.html)

Direct link to video: [https://www.youtube.com/watch?v=YGUG8vU5KuQ](https://www.youtube.com/watch?v=YGUG8vU5KuQ)

Credit and thanks for some of the information in this article goes to:

 * Jacob Cherkas [https://ask.openstack.org/en/users/9244/sfcloudman/](https://ask.openstack.org/en/users/9244/sfcloudman/)
 * Matt Dorn [http://www.madorn.com/](http://www.madorn.com/)
 * [http://docs.openstack.org/admin-guide/compute-networking-nova.html](ttp://docs.openstack.org/admin-guide/compute-networking-nova.html)
 
Keywords: metadata, timeout, timeouts, neutron-metadata-agent, configdrive, config_drive, user_data, user-data

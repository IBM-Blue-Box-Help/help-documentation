---
layout: page
title:  "How do I set up DNS records pointing to OpenStack instances?"
tags: [neutron, configuring dns, instances, hostname, dns]
dateAdded: November 24th, 2015
dateUpdated: June 1, 2017
featured: false
weight: 4
---

You can set up DNS for the floating IP associated with your instance using your current DNS server.  For example, [**DNSimple**](https://dnsimple.com), etc.

As for DNS for the private IPs of instances, OpenStack does not currently provide DNS services, aside from the `dnsmasq` daemon, which lives on `nova-network` hosts and manages DHCP.  You can set up an internal DNS server, or `/etc/hosts` file, if you prefer.

You can also set a fully qualified domain name (fqdn), and pass it via cloud-init via the metadata server.  For example:

```
#cloud-config
hostname: test-vm
fqdn: abc.example.com
ssh_pwauth: False
password: correcthorsebatterystaple
```

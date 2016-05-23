---
layout: page
title:  "How to Isolate Tenants (Projects)"
featured: true
weight: 8
tags: [userdocs, tenants, projects, networks]
author: Ulysses Kanigel
dateAdded: May 13th, 2016
editor: Leslie Lundquist
---

### How can I isolate tenants (projects) from each other?

If you wish to isolate tenants, you can create additional networks, subnets, and routers per tenant. There is no requirement to use only the "internal" shared network/subnet that is created by default.

However, since the "internal" network is shared, all tenants will still be able to use it. This being the case, the best way to secure instances on the internal network is through the use of security groups. For example, you could create a security group called "web", which allows all traffic from other members of the security group, but only ports 80 and 443 from other sources.

More details on configuring and using security groups can be found in the [OpenStack.org Operations Guide](http://docs.openstack.org/openstack-ops/content/security_groups.html).

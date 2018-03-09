---
layout: page
title:  "Error: No valid host was found"
tags: [troubleshooting, no valid host, no valid host was found, resize, launch]
dateAdded: July 31st, 2015
featured: false
weight: 4
---

**When launching an instance, I sometimes get an error "No valid host was found.  Exceeded max scheduling attempts ..."  How do I resolve this?**

Sometimes this error can be due to exceeding a quota.  For example, if we check the logs on the hypervisor for this error, we might see

`PortLimitExceeded: Maximum number of ports exceeded`

To resolve this problem, you can increase the quota by running the command

`neutron quota-update --tenant-id [TENANT-ID] --port 200`

If that doesn't work, `https://bugs.launchpad.net/nova/+bug/1247844` might apply, and you may need to delete any instances with conflicting fixed IP addresses.

**When resizing an instance, I get an error "No valid host was found.  No valid host found for resize ..."  How do I resolve this?**

This can happen for several different reasons, but if you ask our support team to check the logs and we find a "Filter AvailabilityZoneFilter returned 0 hosts" error in the nova-scheduler log, this can occasionally be due to a mismatch between the availability zone reported by nova and the availability zone listed in the database.  This can be resolved on our end by having one of our engineers run a command similar to the following:

`mysql> update instances set availability_zone="compute_enterprise" where uuid="8e53979f-76d8-47cf-ba9d-e6c594112683";`

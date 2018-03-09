---
layout: page
title:  "Horizon Troubleshooting FAQ"
featured: true
weight: 8
tags: [troubleshooting, faq, server, cookie, timezone, quotas, filter, volume limit]
author: Leslie Lundquist, Ulysses Kanigel
dateAdded: December 16, 2016
dateUpdated: January 9, 2017

---

**Q. Why am I getting the error "Can't create server" in Horizon?**

**A.** You might be running low on one of your project quotas, potentially the port quota.  You can view quotas by running `neutron quota-show --tenant-id <UUID>`  Try adjusting your project quotas.

**Q. Why don't my timezone settings stick in Horizon after I clear my cookies?**

**A.** Horizon stores your timezone in a cookie on your computer that persists for 1 year.  It does not store the timezone on the server.  If you clear your cookies or use a new browser, the timezone will be set to UTC, and you will need to recreate the cookie by reconfiguring your timezone in Horizon.

**Q. When I filter my volumes or projects list, why does Horizon only show results from the current page?**

**A.** This is due to an upstream bug; please see https://bugs.launchpad.net/horizon/+bug/1333240 and consider adding your vote to it to get it fixed.

Two workarounds exist:

1. Increase your items shown per page in your Horizon user settings to a number greater or equal to the amount of volumes you have, for example, 120.  The caveat here is that if you have a long list of say 120 volumes, it's going to take around ~39 seconds to load the list.  But the filtering will work across the whole set of 120 volumes instead of just the first 20 displayed.

2. A much faster way of displaying / searching / filtering volumes is to run `openstack volume list --all | grep NAME` (as cloud_admin) or `openstack volume list | grep NAME` (as a user of the project the volumes are in).  You can get more help on managing volumes quickly via the command line at http://docs.openstack.org/user-guide/common/cli-manage-volumes.html

#### Q. What does this error mean? "Error: Unable to retrieve volume limit information."

Often when I load a page in the Horizon dashboard, I see a little red pop-up that says, "Error: Unable to retrieve volume limit information." What is this error?

This error is harmless, but it happens because you do not have any Cinder block storage in your deployment.

The error can be resolved by removing the Cinder endpoint from the Keystone service. This could require an update to your automation config files, and the Support team will need to check. Please open a support ticket if you need help to resolve this error message.

Here is an example of the steps that the support technician would need to follow:

```
# openstack endpoint list | grep cinder 
| 19a90853883049ed92cf4af82a24c0db | RegionOne | cinderv2     | volumev2       | True    | name  | https://... | 
| 2c3e8d0a15304788a9dc1806917b61ee | RegionOne | cinderv2     | volumev2       | True    | other     | https://... | 
| 39434faf90484a208b61a517926042b2 | RegionOne | cinderv2     | volumev2       | True    | name2    | https://... | 

# openstack endpoint delete 19a90853883049ed92cf4af82a24c0db 
# openstack endpoint delete 2c3e8d0a15304788a9dc1806917b61ee 
# openstack endpoint delete 39434faf90484a208b61a517926042b2 

# openstack service list | grep cinder 
| ef7a982aaf224c62a09c6e813ac66141 | cinderv2   | volumev2       | 

# openstack service delete ef7a982aaf224c62a09c6e813ac66141
```
Check that automation is correct:

```
$ grep -A2 ^cinder ../all.yml 
cinder:  
  enabled: False 
cinderv2:  
  enabled: False
```


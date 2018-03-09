---
layout: page
title: Using Horizon for Snapshots
author: Leslie Lundquist
dateAdded: December 12, 2016
tags: [Horizon, snapshots, OpenStack, Cinder, image, error, token expires, glance, slow]
featured: true
weight: 4
---

When running either the 3.0 or 3.1 release using Horizon, snapshot errors can occur if there is not sufficient space to store volumes.  

**Best Practice:**
 When using Horizon it is best to detach the data volume, perform the instance snapshot, and then reattach the data volume.

Here’s why:

**Using Horizon:** When creating an instance snapshot, ensure there is enough storage capacity for all the attached volumes. If there is not enough quota available to store snapshots of all attached volumes, the instance snapshot fails. The quota problem may not be visible as the root cause of the problem. The workaround is to detach the data volume, perform the instance snapshot, and reattach the data volume.  

![instance_snapshot_error.png]({{site.baseurl}}/img/Instance_Snapshot_Error.png)

If you think you are having this problem, you can also [open a support ticket](http://ibm-blue-box-help.github.io/help-documentation/gettingstarted/commonadmin/report-issue/), and our support team will help you diagnose it by looking at logs.

**Using the Command Line:** When using the `cinder-snapshot-create command`, you can perform the snapshot on a single volume only, for example, the root volume. In this case, the snapshot is likely to be successful because the quota would be able to accommodate the volume capacity of a single volume.

### Errors may occur when creating multiple lengthy instance snapshots in parallel and switching projects or logging out

If you switch projects or log out in the middle of creating instance snapshots in parallel, you may notice the process never ends with a status of "Saving".  

If our support team checks the Glance API logs at the time of the snapshot creation, they will notice something similar to "Could not find token".  

This happens because your user token can expire during project switching and logging out.  Nova will call Glance to update the final bits and that request will be invalidated by Keystone due to expired user token.  As of this writing, OpenStack upstream has a fix for this for Cinder and Neutron and that is going into the OpenStack Ocata release.  The final Glance fix is deferred until OpenStack Pike.  You can check the status of the complete fix at https://blueprints.launchpad.net/nova/+spec/use-service-tokens-pike

### Is there a way I can determine how long my image/snapshot will take, or at least see a completion progress bar?

Yes, but you'll need to use the command line/  You can see the percentage of the snapshot that is complete by using the `--poll` option, as per the following example:

```
# nova image-create --poll 7501bff7-0ac9-412f-82ef-9b52fb626191 test

Server snapshotting... 25% complete
```

You can also test with a small image how long it takes by adding the `time` command to the command, then use that timing to extrapolate how long it would take to snap a bigger VM:

```
# time nova image-create --poll 7501bff7-0ac9-412f-82ef-9b52fb626191 test

Server snapshotting... 100% complete
Finished

real	0m57.822s
user	0m0.903s
sys	0m0.072s
```

This was run twice, and in each case, it took a little over 57 seconds to snapshot a test VM that was using 1.1G of disk space.

Based on this limited test on a lab cluster, it could take roughly 3.6 hours to snapshot, for example, a much larger VM with 216G of disk usage.  Results will vary - it could be slower, it could be faster, depending on your cluster load.

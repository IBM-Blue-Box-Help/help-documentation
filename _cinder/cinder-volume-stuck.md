---
layout: page
title:  "Cinder Volume Stuck"
tags: [troubleshooting, cinder volume stuck, snapshot, delete]
dateAdded: November 19th, 2015
featured: true
---

**Q. Why am I getting "ERROR: Unable to delete any of specified volumes." when trying to delete a Cinder volume?**

**A.** Please check to see if the volume has any snapshots, with the command `cinder snapshot-list --all`. If so, you'll need to delete the snapshots prior to deleting the volume.

**Q. How can I find out whether my snapshot has any child volumes?**

**A.** If you want to inspect a snapshot using the API and find out whether it has child volumes, you can back into it this way:

{% highlight bash %}
cinder show [VOLUME-ID] 2>/dev/null | grep snapshot_id | awk '{print $4}'
{% endhighlight %}

**Q. Why can't I attach my Cinder volume?**

**A.** If you are unable to attach a Cinder volume, or if nothing happens in the Horizon dashboard when you try to do so, the `open-iscsi` service daemon may need to be restarted on your Cinder volume host.  Please [**open a support ticket**](http://ibm-blue-box-help.github.io/help-documentation/gettingstarted/commonadmin/report-issue/) to have us check whether this restart needs to be done.

In older versions of OpenStack, there's a small chance the `cinder-volume` service may be wedged. Contact support if this is the case, and we can restart the `cinder-volume` service on the affected node. In all cases, when you contact support, please include your Cinder Request ID so we can quickly trace what happened when you tried to delete the volume.

**Q. Why is my Cinder volume not responding?**

**A.** Occasionally, you may run across a Cinder volume that becomes stuck.  In this example, two volumes were stuck in a "creating" state:

{% highlight bash %}
$ cinder list --all-tenants | egrep "1439ebc1|47405ffa"
| 0589360d-2d0b-49fc-9069-8f68a614fb03 | creating | volume-47405ffa-acbc-4382-a7c4-ebfe9c2998aa | 4 | None | false | |
| 8654f34f-22a2-4f43-b8cd-002b2ff85375 | creating | volume-1439ebc1-1acf-4aeb-9839-d86577700696 | 4 | None | false | |
{% endhighlight %}

If this happens to you, you can reset the state of these volumes, like so:

{% highlight bash %}
$ cinder reset-state 0589360d-2d0b-49fc-9069-8f68a614fb03
$ cinder reset-state 8654f34f-22a2-4f43-b8cd-002b2ff85375
{% endhighlight %}

After resetting their states, you'll see that they're now in an available status:

{% highlight bash %}
$ cinder list --all-tenants | egrep "1439ebc1|47405ffa"
| 0589360d-2d0b-49fc-9069-8f68a614fb03 | available | volume-47405ffa-acbc-4382-a7c4-ebfe9c2998aa | 4 | None | false | |
| 8654f34f-22a2-4f43-b8cd-002b2ff85375 | available | volume-1439ebc1-1acf-4aeb-9839-d86577700696 | 4 | None | false | |
{% endhighlight %}

You can then delete the volumes:

{% highlight bash %}
$ cinder delete 0589360d-2d0b-49fc-9069-8f68a614fb03
$ cinder delete 8654f34f-22a2-4f43-b8cd-002b2ff85375
{% endhighlight %}

If the volumes cannot be deleted even after resetting the state as shown above, you may need one of our support technicians to investigate further. 

**Q. What can the support team do to address this problem?**

**A.** If the methods above do not work, and you're still unable to delete the volume, you will need to contact our support team.  Our team will then perform the following from the controller node for your cluster:

1: Query to determine the current state:

```
# cinder list --all-tenants | grep 033aa8e1-560d-4614-b4bc-93da9feeab32
| 033aa8e1-560d-4614-b4bc-93da9feeab32 | 406add559dcc42e6ba89ea3731e267f6 | in-use | testbackupvols-volume_backend_node_2_0-krf6r45mkpgv | 80 | CEPH_SSD | true | 8385a0c6-c433-4e03-8c49-33444fb8e8d2,240ef26e-a807-43de-914d-a5d76a6817ff |
```

2: Reset the state:

```
cinder reset-state --state available 033aa8e1-560d-4614-b4bc-93da9feeab32
# cinder list --all-tenants | grep 033aa8e1-560d-4614-b4bc-93da9feeab32
| 033aa8e1-560d-4614-b4bc-93da9feeab32 | 406add559dcc42e6ba89ea3731e267f6 | available | testbackupvols-volume_backend_node_2_0-brf6r45mkpgv | 80 | CEPH_SSD | true | 8385a0c6-c433-4e03-8c49-33444fb8e8d2,240ef26e-a807-43de-914d-a5d76a6817ff |
```

3: Force an `attach_status change` in the database, to be able to delete the volume:

```
mysql> update volumes set attach_status='detached' where id='033aa8e1-560d-4614-b4bc-93da9feeab32';
```

4: Perform the deletion:

{% highlight bash %}
cinder delete 033aa8e1-560d-4614-b4bc-93da9feeab32
{% endhighlight %}

5: Confirm that the requested volume does not exist

{% highlight bash %}
cinder list --all-tenants | grep 033aa8e1-560d-4614-b4bc-93da9feeab32
{% endhighlight %}

**Q. What other types of problems could be making my Cinder volume unresponsive?**

**A.** Another problem that could cause a stuck volume is a process on the hypervisor end that's holding the volume open.  Our technicians can diagnose and repair this situation, if needed.

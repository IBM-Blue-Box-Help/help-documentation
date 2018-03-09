---
layout: page
title: "Alternative Method For Block Storage Volume Encryption (using an Ubuntu Guest VM)"
featured: false
weight: 2
tags: [cinder, block storage, encryption, ubuntu]
author: Ruben Orduz
editor: Leslie Lundquist
dateAdded: October 17, 2016
---

Certain situations and workloads require a higher level of data privacy and security, whether on the cloud or on premises. As of this writing, OpenStack compute (Nova) [does not](http://ibm-blue-box-help.github.io/help-documentation/cinder/Bug_Creating_Encrypted_Volumes/) support attachment of LUKS volumes -- which are required for OpenStack-managed, volume-level encryption. This article is focused on the use case of data encryption in the cloud, and more specifically, it provides a procedure for self-service volume encryption in Linux.

Before we begin, there are some _very important_ caveats the reader should be aware of:

 * If an encrypted volume becomes corrupted or otherwise unstable, there's a high risk of data loss.
 * There's a performance "tax" for encryption, although it might be negligible in many cases.
 * Once encrypted, things like snapshots or backups might not have predictable behavior.
 * IBM Blue Box does not provide support on encrypted volumes or file systems.
 * The approach explained herein is for new/blank volumes. Do *not* try these commands on volumes with existing data, it'll be erased and lost forever.

This article also assumes the following pre-requisites:

 * Ubuntu 14.04 or newer
 * The user can create and attach block storage volumes in their cloud.
 * The user has administrator privileges in the virtual machine they're going to use for this procedure.

### Procedure
_Step 1_) The first step is to provision an instance (it can be small) with Ubuntu 14.04 or newer, if you haven't done so already, by using either the API or the Horizon dashboard.

_Step 2_) The second step is to create a block-storage volume. Again, this task can be accomplished via CLI or the Horizon dashboard. No special parameters are needed, just select a descriptive name, select the desired capacity, and make sure it's accessible to and in the same availability zone of the VM you just spun up in the previous step.

_Step 3_) After the block storage volume has been provisioned successfully, attach it to the VM you created in Step 1.

_Step 4_) Log into the VM you created in Step 1.

_Step 5_) Here's some basic house-keeping that's a good idea to do now, just to make sure you have the latest bug-fixes and software lists:

{% highlight bash %}
sudo aptitude update
sudo aptitude safe-upgrade
{% endhighlight %}

_Step 6_) Now install the package that will help you perform the encryption/decryption:

{% highlight bash %}
sudo install cryptsetup
{% endhighlight %}

_Step 7_) Check to be sure that the volume you created in Step 2 has been attached properly:

{% highlight bash %}
sudo fdisk -l
{% endhighlight %}

You should see an output similar to this one:

{% highlight bash %}
Disk /dev/vdb: 3221 MB, 3221225472 bytes
16 heads, 63 sectors/track, 6241 cylinders, total 6291456 sectors
Units = sectors of 1 * 512 = 512 bytes
Sector size (logical/physical): 512 bytes / 512 bytes
I/O size (minimum/optimal): 512 bytes / 512 bytes
Disk identifier: 0x00000000

Disk /dev/vdb doesn't contain a valid partition table
{% endhighlight %}

Notice that `/dev/vdb` could be different, and the capacity shown _should_ reflect the capacity you requested in Step 2.

The last line of the output is completely expected, because you have not yet formatted, partitioned, or mounted the device.

The next couple of steps take a considerable amount of time (maybe hours, depending on volume size), so you might want to run these commands through `nohup` or a similar utility, just to make sure it completes even if the shell session goes down.

_Step 8_) Before you encrypt/lock the volume, you'll need to write random data to the volume. The method recommended here is going to err on the side of safety--it is the most robust approach:

{% highlight bash %}
nohup sudo shred -v --random-source=/dev/urandom --iterations=2 /dev/vdb
{% endhighlight %}

You could increase or decrease the number of iterations, but bear in mind that adding more iterations invariably results in longer processing times.

You can check to see whether the command completed successfully by checking the `nohup.out` file, as follows:

{% highlight bash %}
tail -5 nohup.out
{% endhighlight %}

The output should look something along the lines of the one that follows:

{% highlight bash %}
shred: /dev/vdb: pass 2/2 (random)...2.6GiB/3.0GiB 86%
shred: /dev/vdb: pass 2/2 (random)...2.7GiB/3.0GiB 90%
shred: /dev/vdb: pass 2/2 (random)...2.8GiB/3.0GiB 93%
shred: /dev/vdb: pass 2/2 (random)...2.9GiB/3.0GiB 96%
shred: /dev/vdb: pass 2/2 (random)...3.0GiB/3.0GiB 100%
{% endhighlight %}

_Step 9_) Now that you've wiped and randomized the volume, you can encrypt it:

{% highlight bash %}
sudo cryptsetup --verbose --key-size 512 --hash sha512 --iter-time 2000 --use-random luksFormat /dev/vdb
{% endhighlight %}

This command will bring up the following prompt and data erasure warning:

{% highlight bash %}
WARNING!
========
This will overwrite data on /dev/vdb irrevocably.

Are you sure? (Type uppercase yes):
{% endhighlight %}

After typing 'YES' you will be prompted for a passphrase. REMEMBER IT. You will need it to be able to use/mount the volume, and there's no way to recover it. Make sure you store it somewhere safe and protected.

{% highlight bash %}
Enter passphrase:
Verify passphrase:
System is out of entropy while generating volume key.
Please move mouse or type some text in another window to gather some random events.
{% endhighlight %}

Depending on the volume size, this process will take a while. After it's done, you should see output something like the one below on your terminal:

{% highlight bash %}
Generating key (93% done).
Generating key (93% done).
Generating key (93% done).
Generating key (100% done).
Command successful.
{% endhighlight %}

The two preceding steps will be performed once only, on every volume you encrypt. Next, you can use `cryptsetup` to partition and format the volume, so that you can read and write to it.

_Step 10_) Now "unlock" the volume you just encrypted:

{% highlight bash %}
cryptsetup open --type luks /dev/vdb data
{% endhighlight %}

You will be prompted for the passphrase that you provided in Step 9.

_Step 11_) Write a file system to the device mapping `cryptsetup` you created in the previous step:

{% highlight bash %}
mkfs.ext4 /dev/mapper/data
{% endhighlight %}

_Step 12_) Mount the device:

{% highlight bash %}
mount -t ext4 /dev/mapper/data /mnt
{% endhighlight %}

_Step 13_) Do a sanity check to make sure you can read and write to the mounted volume:

{% highlight bash%}
sudo chmod 0667 /mnt
echo "1,2,3. Test" > /mnt/test.txt
cat /mnt/test.txt
{% endhighlight %}

If all steps are successful up to this point, it means you're good to go. You can now read and write to the encrypted volume.

_Step 14_) When you're done using the volume, you'll need two additional steps: **unmount** and, more importantly, **close** the encryption mapping.

{% highlight bash %}
sudo umount /mnt
sudo cryptsetup close data
{% endhighlight %}

From here on, you can detach and attach the volume with other Ubuntu VMs, if they have `cryptsetup` installed. You only need to open the volume (Step 10), mount the volume (Step 12) and then, as needed, unmount and close (Step 14).

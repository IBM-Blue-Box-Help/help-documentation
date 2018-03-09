---

layout: page
title: Resizing an Instance (Non-live)
featured: False
weight: 12
tags: [getting started, instances, resize, migration, volume]
dateAdded: May 23, 2016
author: Jesse Keating, Sina Sadeghi
editor: Leslie Lundquist

---

### How Can I Resize my Instances?

**Feature:** Instance Resize (up)

**Description:** Starting with the 1.3 Release of Bluemix Private Cloud, we have supported instance resizing (up). The resize operation is not live: it _does_ stop and re-start the instance. A resize can happen on the same host, which is helpful in small environments.

Instance resizing lets an instance change its flavor to a larger flavor. An instance can be resized to a larger flavor **only**. This change incurs a small amount of interruption while the instance is stopped, migrated to a larger-sized flavor, and started again. This resize may also relocate the instance to a new hypervisor.  

Please **DO NOT** update the target flavor (which the instance will be resized to) while the resize process is in progress, otherwise the resize operation may fail and the instance might be put into an ERROR state.

Resizing large instances can be tricky, because it can cause failure if there isn’t enough disk space for the new disk image.

**Note:** There may be a short delay until networking resumes once an instance has been resized or migrated and is in `VERIFY_RESIZE` state.

For more information, please see http://docs.openstack.org/user-guide/enduser/cli_change_the_size_of_your_server.html for documentation on how to perform a resize.

### Troubleshooting

If your resize operation takes a very long time for large instances (for example, some logs have shown an operation starting at 09:30 and the authentication error appearing at 14:41), the authentication token used by Nova to complete this operation could actually expire during this period.

It's very likely that if you attempt to initiate a new resize the same error will occur again. In that case, we suggest a different approach. If your cluster has block storage enabled, we suggest the following steps:

1.  Shut down the target VM.
2.  Take a snapshot of the target VM with `nova image-create`.
3.  Make a volume from that snapshot using `cinder create --image-id <SNAPSHOT UUID>`.
4.  Delete the snapshot with OpenStack `image delete` or `glance image-delete`.
5.  Boot a new VM from the volume with `nova boot --boot-volume`.

If you want to retain the same IP addresses you can:

 1. Get the port UUID of the volume booted VM using: `neutron port-list | grep <IP of new VM>` (the first column is the port UUID).

 2. Remove the port from the old VM using `nova interface-detach`

 3.  Update the port on the new VM to use the old VM IP with: `neutron port-update --fixed-ip ip_address=<old VM IP> <port UUID>`

Once you're happy with this switch you can clean up the old VM with `nova delete`.

This process is more convoluted than you probably prefer. However, switching to block storage as your guest backend comes with multiple benefits:

 * Flavor resize will happen much quicker because the disk resize is skipped.
 * The migration to a new hypervisor is very fast using block storage (the new hypervisor simply connects to the block storage cluster).
 * You can extend the disk of your VM on the fly with `cinder extend` command.


If you don't have Block Storage, and you want to resize to a smaller or bigger flavor, you can create a new instance with the size flavor you want and `rsync` the data you need from the old to the new instance.

### Why doesn't OpenStack allow you to resize an instance down?

You can see why at https://blueprints.launchpad.net/nova/+spec/no-downward-resize - Essentially, allowing a resize-down operation could impact data integrity and is therefore not permitted.  As a safe workaround, you can still create a new VM  with the smaller size flavor, and rsync the data you need from the larger instance to the smaller instance.

### When I resize my instance booted from a volume, the flavor changes but the size remains the same.  Why?

This behavior is expected.  The disk size of the flavor is not the disk size of the root disk when booting from a volume.  You can check out this invalid OpenStack bug https://bugs.launchpad.net/nova/+bug/1412993 that explains this further.

To resize the disk, please refer to https://docs.openstack.org/user-guide/dashboard-manage-volumes.html#edit-a-volume to resize the volume.  If for some reason this doesn't work, you can also try the steps listed at  https://mcwhirter.com.au/craige/blog/2014/Resizing_a_Root_Volume_for_an_Openstack_Instance/

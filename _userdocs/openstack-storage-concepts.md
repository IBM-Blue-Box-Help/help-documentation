--- 

layout: page 

title: "OpenStack Storage Concepts" 

featured: false 

weight: 2

tags: [OpenStack, concepts, volume, ephemeral, swap, disk usage, physical, hypervisor, openstack host show] 

Author: Ying Tang, Ulysses Kanigel

Editor: Leslie Lundquist

dateAdded: May 20, 2016

dateUpdated: Jan 2, 2017

--- 

## Basic Concepts

| **Concept**   |  **Description**                                      																																																																											|
|---------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Volume**    |  Volumes are block storage devices that you attach to instances to enable persistent storage. Persistent storage is not deleted when you terminate an instance. You can attach a volume to a running instance or detach a volume and attach it to another instance at any time. You can also delete a volume. Only administrative users can create volume types.  |
| **Ephemeral** |  The disks associated with the instances are ephemeral, meaning that the data is deleted when the instance is terminated. Snapshots created from a running instance will remain, but any additional data added to the ephemeral storage since last snapshot will be lost.                                                                                         |


The following table compares three OpenStack storage concepts:

|                            | **Ephemeral storage**                                      |	**Block storage**                                                                  |	**Object storage**                  |
|----------------------------|------------------------------------------------------------|------------------------------------------------------------------------------------|----------------------------------------|
| Used to:                   | Run operating system and scratch space                     | Add additional persistent storage to an instance                                   | Store data, including instance images  |
| Accessed through:          | A file system 	                                          | A block device that can be partitioned, formatted, and mounted (such as, /dev/vdc) | REST API                               |
| Accessible from:           | Within an instance                                         | Within an instance 	                                                               | Anywhere                               |
| Managed by: 	             | OpenStack Compute (nova)                                   |	OpenStack Block Storage (cinder)                                                   | OpenStack Object Storage (swift)       |
| Persists until:            | Instance is terminated                                     |	Deleted by user                                                                    | Deleted by user                        |
| Sizing determined by:      | Administrator configures size settings, known as flavors   | Specified by user in initial request 	                                           | Amount of available physical storage   |
| Example of typical usage   | 10 GB first disk, 30 GB second disk                        |  1 TB disk                                                                         | 10s of TBs of dataset storage          |
	 	 	

**Swap space**
* Swap space is provisioned on the same compute host machine that the virtual machine using the swap runs on.
* Swap space is exposed in the virtual machine as a device mounted - for example, on /dev/vdb, by udev.

**Why does `openstack host show` not show the actual hard disk usage of the physical host?**

`openstack host show` only shows info about the flavors of the instances that run on hosts. One of our customers had a question about whether swap usage was included. At this time, it is not included. Here's what is included as of the Mitaka release, as per http://docs.openstack.org/admin-guide/common/nova-show-usage-statistics-for-hosts-instances.html 

The `disk_gb` column [in the openstack host show output] shows the sum of the root and ephemeral disk sizes (in GB) of the instances that run on the host. ... [This value is] computed by using information about the flavors of the instances that run on the hosts. This command does **not** query the ... hard disk usage of the physical host.

You can see the actual flavor calculation at  https://github.com/openstack/nova/blob/c521ba7fa679b6e9c790d84ea22f04fb999987db/nova/notifications/base.py#L448-L454 

`disk_gb` = `root_gb` + `ephemeral_gb`

`ephemeral_gb` = The size of a secondary ephemeral data disk. This is an empty, unformatted disk and exists only for the life of the instance. Default value is 0. 
`root_gb` = Amount of disk space (in gigabytes) to use for the root (/) partition.

Nova's `disk_gb` does NOT currently include swap (Optional swap space allocation for the instance. Default value is 0.)

There is work proposed for Newton that would start including this optional swap space, as per https://specs.openstack.org/openstack/nova-specs/specs/newton/implemented/resource-providers-allocations.html : "When the compute node utilizes local storage for instance disks OR was booted from volume, the value used should be the sum of the `root_gb`, `ephemeral_gb`, and `swap` field values of the flavor. The resource_provider_uuid should be the compute node’s UUID. Note that for instances that were booted from volume, the `root_gb` value will be 0."

Also see https://derpops.bike/2016/10/07/openstack-nova-and-hypervisor-disk-consumption/

---
layout: page
author: Ulysses Kanigel
title: Difference Between Image and Snapshot
dateAdded: January 27, 2017
tags: [glance, image, snapshot, versus, base image, images, snapshots]
weight: 5
featured: FALSE
---

A common point of confusion in OpenStack is the difference between images and snapshots.  Images are typically uploaded to the environment, rather than created from existing resources within the environment.  Once either one is created, they can be used in much the same way.

The documentation at http://docs.openstack.org/ops-guide/ops-user-facing-operations.html says:

"The dashboard interface for snapshots can be confusing because the snapshots and images are displayed in the Images page. However, an instance snapshot **is** an image. The only difference between an image that you upload directly to the Image Service and an image that you create by snapshot is that an image created by snapshot has additional properties in the glance database. These properties are found in the image_properties table and include:"

```
Name	Value
image_type	snapshot
instance_uuid	<uuid of instance that was snapshotted>
base_image_ref	<uuid of original image of instance that was snapshotted>
image_location	snapshot
```

So for example, if you want to confirm a snapshot really is a snapshot, you can grep for these properties:

```
# glance image-show a810f03f-feea-4fa5-9951-68fca7da5759 | egrep "image_type|instance_uuid|base_image_ref|image_location"
| base_image_ref   | 9ead296c-55c7-4187-b645-34b73065b17e                                             |
| image_location   | snapshot                                                                         |
| image_type       | snapshot                                                                         |
| instance_uuid    | 8d098596-fea4-43ba-8743-8be3b2157975                                             |
```

Whereas, an image that is just an image will not have the above extra properties:

```
# glance image-show e79935d3-beb5-491f-aa17-d2f380a30b1b | egrep "image_type|instance_uuid|base_image_ref|image_location"
# [no output]
```

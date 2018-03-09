---
layout: page
title:  "Is there a list of official OpenStack-compatible images that I can download for use with Glance? (CentOS, Ubuntu, etc.)"
tags: [glance, images, vmdk, qcow2, conversion, vmware]
dateAdded: November 17th, 2015
updated: May 10, 2017
featured: false
weight: 4
---

There is.  

It includes `CentOS`, `Cirros`, `Ubuntu`, `Red Hat Enterprise Linux`, `openSUSE`, and `Debian`.  

Please see [this OpenStack document](http://docs.openstack.org/image-guide/obtain-images.html) for more details.

See also the topic [User's Guide to Cloud Images](http://ibm-blue-box-help.github.io/help-documentation/gettingstarted/userguides/Cloud_Images_Provided_by_IBM/). 

General information about working with images and OpenStack is available in the OpenStack community documentation: https://docs.openstack.org/image-guide/

### Converting Third-Party Images

If you are trying to upload a third-party image to your cluster, such as a VMDK image, you may find that your process will hang or fail, because the image is not in QCOW2 format, and/or because the image does not have the `cloud-init` packages installed that are required for operation on OpenStack. 

Please see [https://docs.openstack.org/image-guide/ubuntu-image.html](https://docs.openstack.org/image-guide/ubuntu-image.html) for an example of how to create an image that is compatible with OpenStack. More examples for other operating systems are on the left side of the page.

### Regarding VMDK Images

VMDK is a VMWare format, so it won't work directly under a KVM hypervisor, as QCOW2 will.  There has to be a conversion somewhere along the way, either by the customer or by Glance.

You can convert a VMDK image to QCOW2 with `qemu-img convert -O qcow2 example.vmdk example.qcow2`(see [https://docs.openstack.org/image-guide/convert-images.html#qemu-img-convert-raw-qcow2-qed-vdi-vmdk-vhd](https://docs.openstack.org/image-guide/convert-images.html#qemu-img-convert-raw-qcow2-qed-vdi-vmdk-vhd) for reference), but you need to make sure the image contains the proper `cloud-init` packages as well, before uploading. 

Glance tries to do a basic conversion when a VMDK image is uploaded, but it is not guaranteed to work - see [https://etherpad.openstack.org/p/kilo-glance-image-conversion](https://etherpad.openstack.org/p/kilo-glance-image-conversion) "when using qemu-img, converting vmdk->qcow2 is likely to work (but not guaranteed since VMDK support may be incomplete)"

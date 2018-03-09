---
layout: page
title:  "Creating a volume from the Horizon dashboard"
tags: [horizon, volume, Ceph]
dateAdded: Sep 20, 2016
author: Ying Tang
featured: false
weight: 4
---

## Creating a volume from the Horizon dashboard

### Steps
1. Log in to the Horizon dashboard.
2. Under the **Project** topic, expand **Compute** and click **Volumes**. If you have existing volumes, you can view a list of your volumes with their details, such as name, description, size, and status. 
3. Click **Create Volume** on the upper right portion of the Horizon dashboard. The **Create Volume** dialog is displayed.

![Create a volume]({{site.baseurl}}/img/create_volume.png)

Provide the following details about the volume. 

* Volume Name: Type the name of your volume.
* Description: Type a description of your volume.
* Volume Source: *No source, empty volume* or *Image*. If you choose an empty volume, an empty volume does not contain a file system or a partition table. If you choose the image option, a new field for **Use image as a source** displays and you can select the image from the list.
* Type: *Ceph_SSD* or *Ceph_Hybrid*. 
* Size (GiB): Select the size of the volume in gibibytes(GiB), for example, 1. 
* Availability Zone: Choose the availablity zone, for example, *nova*. 

Click **Create Volume** when complete. 

## Managing your volumes

Under the **Project** topic, expand **Compute** and click **Volumes**.

The dashboard displays the list of volumes for the current project. In the Actions column, a drop-down list displays your options, as shown below:

![Manage your volume]({{site.baseurl}}/img/manage_volume.png)

* **Edit Volume**: changes the volume name or description.
* **Manage Attachments**: attaches the volume to an instance.
* **Create Snapshot**: creates a snapshot of the volume.
* **Create Backup**: creates a backup of the volume.
* **Change Volume Type**: changes the type of the volume.
* **Upload to image**: uploads the volume to the Image Service as an image.
* **Create Transfer**: creates volume transfer in this project so that it can be "accepted" by a recipient project.
* **Delete Volume**: deletes the volume.

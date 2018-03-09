---
layout: page
title: How to Upload an Image
tags: [commontech, userguides, image, rhosp, red hat]
dateAdded: March 28, 2017
author: Leslie Lundquist
---


## How to Upload an Image

1. In the dashboard, select **Project > Compute > Images**.
2. Click **Create Image**.
3. Fill out the values, and click **Create Image** when finished.

If you need to obtain a Red Hat image, here is a link where you can log in to your Red Hat account and obtain an image:

[https://access.redhat.com/downloads/content/69/ver=/rhel---7/7.3/x86_64/product-software](https://access.redhat.com/downloads/content/69/ver=/rhel---7/7.3/x86_64/product-software)

**Table: Image Options**


| Field      | Notes     |
|------------|-----------------------------------|
| Name | Name for the image. The name must be unique within the project.  |
| Description    | Brief description to identify the image.   |
|Image Source   | Image source: Image Location or Image File. Based on your selection, the next field is displayed.    | 
| Image Location or Image File       | Select the **Image Location** option to specify the image location using its URL. Select the **Image File** option to upload an image from your local disk.  |
| Format     | Image format (for example, `qcow2`).    |
| Architecture   |Image architecture. We support `x86_64` for a 64-bit architecture.  |
| Minimum Disk (GB)    | Minimum disk size required to boot the image. If this field is not specified, the default value is 0 (no minimum).   |
| Minimum RAM (MB) | Minimum memory size required to boot the image. If this field is not specified, the default value is 0 (no minimum). |
| Public | If selected, makes the image public to all users with access to the project. |
| Protected | If selected, ensures only users with specific permissions can delete this image. |

When the image has been uploaded successfully, its status is changed to *active*, which indicates that the image is available for use. The Image service can handle  large images that take a long time to upload, possibly longer than the lifetime of the Identity service token which was used when the upload was initiated. The Image service first creates a trust with the Identity service so that a new token can be obtained and used when the upload is complete, and the status of the image is to be updated.

**Note:** You can also use the `glance image-create` command with the `property` option to upload an image. More values are available on the command line. For a complete listing, see [Image Configuration Parameters](http://ibm-blue-box-help.github.io/help-documentation/glance/RHOSP_Image_Configuration_Parameters/).

## Update an Image

1. In the dashboard, select **Project > Compute > Images**.
2. Click Edit Image from the dropdown list. **Note:** The **Edit Image** option is available only when you log in as an `admin` user. When you log in as a `demo` user, you have the option to **Launch an instance** or **Create Volume**.
3. Update the fields and click **Update Image** when finished. You can update the following values - `name`, `description`, `kernel ID`, `ramdisk ID`, `architecture`, `format`, `minimum disk`, `minimum RAM`, `public`, `protected`. (Options are given in the preceding table.)
4. Click the drop-down menu and select **Update Metadata** option.
5. Specify metadata by adding items from the left column to the right one. In the left column, there are metadata definitions from the **Image Service Metadata Catalog**. Select **Other** to add metadata with the key of your choice and click **Save** when you've finished.

**Note:** You can also use the `glance image-update` command with the `property` option to update an image. More values are available on the command line; for a complete listing, see [Image Configuration Parameters](http://ibm-blue-box-help.github.io/help-documentation/glance/RHOSP_Image_Configuration_Parameters/s).

## Delete an Image

1. In the dashboard, select **Project > Compute > Images**.
2. Select the image you want to delete and click **Delete Images**.

### Purge Your Deleted Image Data

Information about an image is kept in the OpenStack Image Service database even after the image has been deleted. As a consequence, the database can grow in size over time and become slow to use and hard to upgrade. Contact the Support team for help in removing deleted images.

---
layout: page
title:  "Configuring multiple network interfaces for your own cloud images"
dateAdded: December 2, 2016
author: Ying Tang
featured: true
weight: 4
tags: [neutron, muliple NICs]
---

You don't have to configure the multiple network interfaces (NICs) normally, since the IBM Bluemix Private Cloud images are by default pre-configured with multiple NICs.

If you create your own image on IBM Bluemix Private Cloud, or bring an image from elsewhere, your image may not automatically bring up all network interfaces. 

In these occasions, if you want to create multiple private networks, after an instance is booted from your image, you must configure additional network interface (*eth1* as an example).

1. Log on to your instance using SSH.
2. Run the following commands:

        $ echo $'auto eth1\niface eth1  inet dhcp' >> interfaces
        $ sudo ifup eth1
3. Verify that eth1 is running:
        
        $ ifconfig eth1
4. You should be able to see eth1 in the "up broadcast running" state and more importantly, a valid IP address in the returned output.
 

For information about creating additional networks, refer to [Creating Additional Networks in OpenStack Using the Horizon Panel](http://ibm-blue-box-help.github.io/help-documentation/horizon/creating-additional-networks-with-horizon/).

For information about uploading your own image, refer to [User's Guide to Cloud Images](http://ibm-blue-box-help.github.io/help-documentation/gettingstarted/userguides/Cloud_Images_Provided_by_IBM/).


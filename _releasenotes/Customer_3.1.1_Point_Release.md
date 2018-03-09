---
layout: page
title: Customer 3.1.1 Point Release Notes
author: Leslie Lundquist
featured: false
dateAdded: December 16, 2016
tags: [release notes, 3.1.1]

---

### IBM Bluemix Private Cloud Customer

### Point Release 3.1.1.0

**December 16, 2016**


This 3.1.1.0 Point Release is created primarily to fix some bugs that were affecting a few of our customers. Here are the changes that may affect your customer experience:

 * The Urban Code Deploy [UCD] Heat plug-in was made current in the 3.1.1.0 release.
 
 * Our customer-facing RBAC documentation has been [updated.](http://ibm-blue-box-help.github.io/help-documentation/keystone/Managing_Users_and_Projects/)
 
 * We fixed our curated image for CentOS 6.8: previously, only 2.1G of disk space was seen in the VM while the flavor had 10G of disk space. Now this error is corrected.
 
 * Windows images previously assumed that the hardware clock was set to the customer's local timezone instead of UTC. The defect is corrected, and no workaround is needed for new VMs provisioned from the updated images. To fix older VMs, set the 'RealTimeIsUniversal' registry entry [as documented here.](http://ibm-blue-box-help.github.io/help-documentation/troubleshooting/FAQ_Working_with_Windows_Images/)

 * We created a new document to assist with [using Nova Metadata service.](http://ibm-blue-box-help.github.io/help-documentation/nova/Metadata_service_FAQ/)

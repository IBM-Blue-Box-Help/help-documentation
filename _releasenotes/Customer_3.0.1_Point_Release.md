---
layout: page
title: Customer 3.0.1 Point Release Notes
author: Leslie Lundquist
featured: false
dateAdded: August 15, 2016
tags: [release notes, 3.0.1]
---


### IBM Bluemix Private Cloud Customer

### Point Release 3.0.1

**August 17, 2016**


This 3.0.1 Point Release is created primarily to fix some bugs that were affecting a few of our customers. Here are the changes that may affect your customer experience:

 * The command `neutron net-list` no longer lists subnet information for the `external` network. Starting in this release, you can use the command `neutron net-ip-availability-show external` to get that information.

 * Customers now can update their own passwords in Horizon by selecting the "Change Password" dropdown item. Additional method: You also can change the password by selecting **Settings -> Change Password**.

 *  Customers currently are unable to update user information in Horizon (such as description or email address) by using the **Edit** button. Workaround: The name, description, and email information can be updated by clicking the **pencil icon** that appears when your mouse is hovering to the upper right side of the column you'd like to update. To confirm your edit, click the check mark that appears.

 * Previously, customers have been unable to set quotas in **Horizon**. This is a known upstream limitation, already given in the Known Limitations section of the [3.0.0 Release Notes](http://ibm-blue-box-help.github.io/help-documentation/gettingstarted/commontech/Customer_3.0.0_Release_Notes/), which we are now overriding to resolve for you in our deployments. 

 * We’ll be giving earlier notifications to customers who are reaching their capacity in Ceph. We will warn you via ticket if your overall cluster capacity reaches or exceeds 75%, and if any single logical disk exceeds 70%.


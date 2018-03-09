---
layout: page
title: Release Notes 3.1.0
featured: false
weight: 5
tags: [commontech, release, features, gettingstarted]
dateAdded: October 14, 2016
author: Leslie Lundquist
---

## IBM Bluemix Private Cloud Customer

## Release Notes 3.1.0

#### October 14, 2016


This document offers a basic description of the 3.1.0 IBM Bluemix Private Cloud and IBM Bluemix Private Cloud Local offerings. Links to further documentation can be found in each section.

### Summary of the Latest Release

Release 3.1.0 of **IBM Bluemix Private Cloud** and **IBM Bluemix Private Cloud Local** , includes some new capabilities and performance improvements. It is still based on the OpenStack Mitaka release.

**Every IBM Bluemix Private Cloud has these new features in 3.1.0:**

1.) **Federated Keystone–Customer Identity Provider (IdP)**: Customers now can utilize their existing Identity Infrastructure federation protocols, such as Security Assertion Markup Language (SAML) or OpenIDConnect, to use the identities stored in their own identity directories (such as LDAP, RADIUS, and Active Directory). A single, customer-managed credential can be used to manage multiple OpenStack clouds.

*Here are some related documents:*

 * [K2K Federation](http://ibm-blue-box-help.github.io/help-documentation/keystone/k2k-federation/)
 * [SAML Federation](http://ibm-blue-box-help.github.io/help-documentation/keystone/saml-federation/)
 * [OIDC Federation](http://ibm-blue-box-help.github.io/help-documentation/keystone/oidc-federation/)       

2.) **Storage Pools**: Customers with diverse storage performance requirements can now direct workloads optimally, to high-performance SSD and cost-effective Hybrid storage pools in the same cloud. The minimum number of OSD nodes for a new deployment remains at 3, and for hybrid expansion a minumum of 3 nodes must be added. After that, you may expand your storage one node at a time.

*Here are some related documents:*

 * [Supported volume types](http://ibm-blue-box-help.github.io/help-documentation/cinder/supported_volume_types/) 
 * [Creating a volume from Horizon](http://ibm-blue-box-help.github.io/help-documentation/horizon/create-volume-from-horizon/)
 * [Creating a volume from the command line](http://ibm-blue-box-help.github.io/help-documentation/cinder/cli-create-volume/)

3.) **Storage Performance Improvements**: **Ceph** deployments have been upgraded to the Jewel release with Jemalloc enabled, to provide a performance improvement.


**IBM Bluemix Private Cloud Image Updates**

**An update for IBM Bluemix Private Cloud Images**: Our library of available Cloud Images has been updated. The [Cloud Image User Guide]( http://ibm-blue-box-help.github.io/help-documentation/gettingstarted/userguides/cloud_images/image_patch_list_20160910/Image_Release_Notes_2016-09-10/) has the latest information. 

**IBM Bluemix Private Cloud 3.1.0 features (in IBM Cloud Data Centers):**

 * Bluemix Private Cloud, in IBM Cloud Data Centers, is now ISO27001 and 270018 compliant, plus SOC 2 and 3.

**IBM Bluemix Private Cloud Local 3.1.0 features:**

 * **Support for Lenovo**: In addition to the current Cisco UCS platform, a Lenovo-curated bill of materials is now supported.  
 * **Support for Bluemix Local System**: IBM Bluemix Private Cloud Local (PCaaS) Private Cloud as a Service is now supported on Bluemix Local Systems.

### Known Limitations of this Release

On Horizon, Federated users have a page on which they can change their password. An error occurs when
attempting to change the password, because their identity information is not stored. (Defect #236958)

On Horizon, a user with `project_admin` access granted through groups may not see any users in **Identity->Projects**. (Defect #237038)

For specific information about the limitations of **LBaaS**, please refer to [Limitations of LBaaS v2](http://ibm-blue-box-help.github.io/help-documentation/neutron/Limitations_of_LBaaSv2/).

For additional user documentation, please refer to the [main Customer Help page](http://ibm-blue-box-help.github.io/help-documentation/), available online anytime at [_help.blueboxcloud.com_](http://ibm-blue-box-help.github.io/help-documentation/).

For new users of IBM Bluemix Private Cloud, a **General Product Overview** for IBM Bluemix Private Cloud version 2.0 and later [is available](http://ibm-blue-box-help.github.io/help-documentation/gettingstarted/commontech/general_product_overview/).

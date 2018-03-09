---
layout: page
title: Release Notes 2.1
featured: false
weight: 5
tags: [getting started, releasenotes, features]
dateAdded: March 31, 2016
author: Leslie Lundquist
---

# **IBM Bluemix Private Cloud Customer**

# Release Notes

#### Release 2.1.0    created     March 31, 2016

# **Summary of New Features in Latest Release**

This document offers a basic technical description of the latest IBM Bluemix Private Cloud offerings, specifically the Dedicated and Local Cloud offerings.  The new capabilities of IBM Bluemix Private Dedicated and Local Cloud include:  

1.  [Additional types of Expansion Compute Nodes are available.](http://ibm-blue-box-help.github.io/help-documentation/gettingstarted/commontech/release_notes_for_customers/#optional-expansion-compute-nodes-now-available)

2.  [Hybrid Block Storage Cluster and Expansion Nodes are available.](http://ibm-blue-box-help.github.io/help-documentation/gettingstarted/commontech/release_notes_for_customers/#optional-hybrid-block-storage-nodes-now-available)

3.  [Direct Link is available on IBM Bluemix Private Dedicated Cloud, in three varieties, and for hybrid cloud applications.](http://ibm-blue-box-help.github.io/help-documentation/gettingstarted/commontech/release_notes_for_customers/#direct-link-now-available-in-softlayer-data-centers)

4.  [IBM Cloud data center Private Network access is available.](http://ibm-blue-box-help.github.io/help-documentation/gettingstarted/commontech/release_notes_for_customers/#softlayer-private-network-access)

5.  [Use of Role-Based Access Control (RBAC) to define permissions.](http://ibm-blue-box-help.github.io/help-documentation/gettingstarted/commontech/release_notes_for_customers/#role-based-access-control-rbac)

6.  [Additional cloud images are provided by IBM Bluemix.](http://ibm-blue-box-help.github.io/help-documentation/gettingstarted/commontech/release_notes_for_customers/#additional-cloud-images-available)

7.  [HIPAA-compliant options are now available for IBM Bluemix Private Dedicated Cloud.](http://ibm-blue-box-help.github.io/help-documentation/gettingstarted/commontech/release_notes_for_customers/#hipaa-and-ibm-blue-box-dedicated-cloud)

For additional user documentation, please refer to the [main Help page.](http://ibm-blue-box-help.github.io/help-documentation/) 

[A **General Product Overview** for IBM Bluemix Private Cloud version 2.0 and later is available in this document](http://ibm-blue-box-help.github.io/help-documentation/gettingstarted/commontech/general_product_overview/).

A summary of features from previous releases that will affect users of this release is available [at the end of this document.](http://ibm-blue-box-help.github.io/help-documentation/gettingstarted/commontech/release_notes_for_customers/#summary-of-new-features-from-previous-releases-that-will-affect-customer-use-of-this-release)

#### **IBM Bluemix Private Cloud Building Blocks**

Every IBM Bluemix Private Cloud 2.1.0, Dedicated or Local, starts with a cluster of controller and compute nodes:

**IBM Bluemix Private Cloud:**

	• A cloud can start as a three-node cluster with two hyper-converged (controller + compute nodes) and one compute-only node.
	• A cloud can start as a five-node cluster with a pair of dedicated controller-only nodes and three compute-only nodes. 

**IBM Bluemix Private Cloud Local:**

	• Each cloud must have at least one dedicated controller-only node and three compute-only nodes.  
	
From any of these starting places (e.g., 3-node hyper-converged, or 5-node with dedicated controllers), you can add compute nodes of any type, along with block storage (Ceph), and/or object storage (Swift).

**Additional building blocks:**

	• For a Standard Capacity Dedicated cloud, Dedicated Gateway Firewalls are included by default
	• Enterprise Capacity includes double the resources and 10 Gbps of network connectivity 
	• Dedicated controller nodes (or additional ones)
	• Compute nodes (or additional ones): Standard or Enterprise, IO or High Storage (new)

#### **Optional Expansion Compute Nodes Now Available**

Optionally, you can select from the following compute node extensions to add to your standard or enterprise cloud:

	• You can select specialized expansion compute nodes: IO, or HIGH STORAGE (New in this release)
	• You can select additional standard or enterprise compute nodes: STANDARD COMPUTE, or ENTERPRISE COMPUTE

Expansion compute nodes address your requirements for faster IO ephemeral, more RAM, and an order of magnitude larger ephemeral storage.  Both types of expansion nodes—IO optimized and high storage capacity—allow better coverage of instance types and workloads. With this 2.1.0 release, compute types are grouped into Availability Zones for easy targeting of workloads to the appropriate compute type.

#### **Optional Hybrid Block Storage Nodes Now Available**

Hybrid Block Storage nodes provide lower cost and higher density Block Storage.  

	• You can select Block Storage: SSD or HYBRID
	• You can select Object Storage 

#### **Direct Link now Available in IBM Cloud Data Centers**

For Dedicated Cloud, you have the additional network option of selecting **Direct Link** connectivity:

	• You can select an access method  (Public, VPN, or Direct Link)

Direct Link is available in IBM Cloud data centers. It lets you connect to the IBM Cloud data center's private network backbone or network, bypassing the public Internet to connect to your Dedicated cloud(s). 

Direct Link can be utilized to create a _hybrid cloud_, if you want to link your Local cloud to a Dedicated cloud that is running in an IBM Cloud data center. It is available in 1Gbps and 10Gbps increments. 

Available:

	• IBM Bluemix Private Direct Link Cloud Exchange 1 Gbps
	• IBM Bluemix Private Direct Link Cloud Exchange 10 Gbps
	• IBM Bluemix Private Direct Link Colocation 1 Gbps
	• IBM Bluemix Private Direct Link Colocation 10 Gbps
	• IBM Bluemix Private Direct Link Network Service Provider (NSP) 1 Gbps
	• IBM Bluemix Private Direct Link Network Service Provider (NSP) 10 Gbps


#### **IBM Cloud Data Center Private Network Access**

IBM Cloud Data Center Private Network access lets you set up connectivity between two IBM Bluemix Private clouds, using the IBM Cloud Data Center private network capability, when both of the IBM Bluemix Private clouds that will be connected are deployed under the same IBM Cloud account. You would select this service to enable _low-latency, un-metered, private network traffic_ between your IBM Bluemix Private clouds.

For more information, please refer to [the main document on this topic.](http://ibm-blue-box-help.github.io/help-documentation/gettingstarted/commontech/Connecting_Clouds_with_SoftLayer/)

For a known limitation, please look [here](http://ibm-blue-box-help.github.io/help-documentation/keystone/RBAC_Definitions/).

#### **Role-Based Access Control (RBAC)**

Several roles are created by default that give you specific access capabilities within your cloud. This version of IBM Bluemix Private Cloud introduces the concept of **groups**. For more information about users, roles, and groups, please refer to [this document](http://ibm-blue-box-help.github.io/help-documentation/keystone/Managing_Users_and_Projects/).

#### **Additional Cloud Images Available**

IBM Bluemix Private Cloud 2.1.0 comes pre-populated with Cirros 0.3.3 x86_64 images. Additional cloud images are available, provided as a customer courtesy by IBM Bluemix. These include:

	• CentOS 6.7 x86_64
	• CentOS 7.2 x86_64
	• Ubuntu Server 12.04 LTS x86_64
	• Ubuntu Server 14.04 LTS x86_64
	• Windows Server 2008 R2 SP1 Datacenter
	• Windows Server 2008 R2 SP1 Enterprise
	• Windows Server 2008 R2 SP1 Standard
	• Windows Server 2012 R2 Datacenter
	• Windows Server 2012 R2 Standard

To use any of these images, additional information is provided in [this document](http://ibm-blue-box-help.github.io/help-documentation/gettingstarted/userguides/Cloud_Images_Provided_by_IBM/).

#### **HIPAA and IBM Bluemix Private Cloud**

	• You can select HIPAA Enablement for your IBM Bluemix Private Cloud

A HIPAA-enabled cloud has the same configuration and expansion options as any other IBM Bluemix Private Cloud offering, but we are enabling _over 50 additional information-security controls_ that support our customers who must store personal health information (PHI). Because of this increased information security capability, a HIPAA-enabled cloud must be HIPAA-enabled from its inception: you cannot upgrade an existing cloud to enable HIPAA protocol. Also, you cannot downgrade from an IBM Bluemix Private HIPAA cloud: the existing HIPAA cloud must be wiped—per HIPAA protocol—and you must order a new cloud with non-HIPAA controllers.

Essentially, an IBM Bluemix Private HIPAA cloud resembles any other IBM Bluemix Private cloud, with these exceptions:

	1.  Every IBM Bluemix Private HIPAA cloud must have Dedicated Controllers (not converged controllers).
	2.  Additional HIPAA monthly recurring charges accrue per cluster and per asset under management.
	3.  Additional (50+) controls are enabled, and responsibility for those controls is shared between you and IBM Blue Box.

IBM Bluemix Private HIPAA clouds can be deployed in any IBM Cloud data center that is ready to deploy IBM Bluemix Private Cloud.

**Pre-requisite:** A BAA must be signed before a of IBM Bluemix Private HIPAA cloud order can be initiated. You must initiate your cloud order using the minimum configuration for HIPAA customers. No HIPAA enablement can be done after service initiation.

#### **Summary of New Features from Previous Releases that will affect Customer Use of this Release**

This section briefly lists features from previous IBM Bluemix Private releases, primarily the 2.0.1 release, that will have an effect on your experience when using this 2.1.0 release, especially if you are upgrading from a 1.x release. For more information about these features, please contact your IBM Bluemix Private Cloud support team.


#### _Features that will affect Users, Groups, and Roles in this release:_

**Hide Host Aggregates panel from `cloud_admin`**: This Horizon panel has been removed from visibility from `cloud_admin` users. We no longer allow `cloud_admin` to manipulate Host Aggregates, so it was improper to display this panel in Horizon.

**Disallow `cloud_admin` from managing Host Aggregates**: Covered above in discussion of the Host Aggregates panel for Horizon.

**Expose more `admin` panels to `cloud_admin`**: We've enabled more admin panels for the `cloud_admin` users in Horizon. These include "Overview," "Hypervisors," "Instances," "Volumes," "Flavors," "Images," and "Defaults."

**Fix user management by name on the command line**: We've fixed a defect that prevented the management of users by name from the command line. Previously, many attempts to reference a user by name would result in an error.

**Allow `cloud_admin` to make Glance images public**: The `cloud_admin` role now has the privileges to make Glance images public.


#### _Features that will affect Horizon, Glance, Nova, and Heat in this release:_

**Refresh Horizon code base to fix bugs with volume backups**: A defect in Horizon that prevented creation of Cinder volume backups has been resolved.

**Refresh Horizon code base to allow image upload from Swift URL (curated IBM Bluemix image delivery)**: A defect in Glance preventing uploading images via a URL has been resolved, allowing URLs from Box Panel to be used to upload images into Glance.

**Add DiskFilter for Nova scheduling**: We've resolved a defect that would lead to Nova scheduling builds on Hypervisors that did not have enough free disk space to satisfy the build.

**Tune Heat for large template support:** `bugs.launchpad.net/heat/+bug/1491185` : We've resolved a defect that would hinder Heat stack deployments with large templates.

**Instance resizing (up) is enabled:**  Instance resizing lets an instance change its flavor to a larger flavor. The resize operation is not live: it will stop and re-start the instance. More information is available [in this document](http://ibm-blue-box-help.github.io/help-documentation/gettingstarted/commontech/Instance_Resize/).

**Future Release Notes**

Release Notes will be published periodically that give details about what has changed and how it could influence your experience with your IBM Bluemix Private Cloud offering. For instance, when a new version of OpenStack is installed that might enable new features, you’ll receive Release Notes containing the details.

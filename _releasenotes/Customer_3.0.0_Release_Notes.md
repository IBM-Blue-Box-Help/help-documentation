---
layout: page
title: Release Notes 3.0.0
featured: false
weight: 5
tags: [commontech, releasenotes, features, mitaka, "Unable to get Nova services list", hypervisor]
dateAdded: April 22, 2016
author: Leslie Lundquist
---

## IBM Bluemix Private Cloud Customer

## Release Notes 3.0.0

#### June 30, 2016


This document offers a basic technical description of the latest IBM Bluemix Private Cloud offerings, including specifics of the Dedicated and Local offerings. Links to detailed documentation can be found in each section.

### Summary of the Latest Release

Release 3.0.0 of IBM Bluemix Private Cloud includes many updates to the underlying OpenStack platform upon which every Bluemix Private Cloud is built, as well as upgrades to infrastructure and features of Bluemix Private Cloud and Bluemix Private Cloud Local. Most notable is the move to the **OpenStack Mitaka** release, which enables many new capabilities. We’ve included some general product improvements such as performance benchmarks and an updated Rally test suite, designed to facilitate smoother operation and deployment. This release also includes many improvements to documentation.

Every IBM Bluemix Private Cloud, Version 3.0.0, has these new features:

1. [Openstack Mitaka Support.](#openstack-mitaka)
2. [Keystone-to-Keystone federated identity across multiple Bluemix Private clouds.](#federated-keystone)
3. [Updated Documentation Website now accessible through Box Panel.](#new-docs-site)
4. [Regular updates for IBM Bluemix Private Cloud Images.](#regular-updates)

IBM Bluemix Private Cloud 3.0.0 (in IBM Cloud Data Centers) features:

1. [Support for IBM Cloud Data Center VLAN spanning and connectivity to customer Bare Metal hardware.](#transit-vlan)
2. [Vyatta with 10G networking.](#10gb-vyatta)

IBM Bluemix Private Cloud Local 3.0.0 features:

1. [Hybrid Block Storage Nodes.](#block-storage)
2. [New Compute Node Types.](#expansion-compute)
3. [HIPAA-enabled IBM Bluemix Private Cloud Local.](#hipaa)
4. [Support for IBM Bluemix Private Cloud Local on Bluemix Local System platform (Beta release).](#pure-app)

[**Known Limitations of this Release**](#known-limitations-of-this-release)

For additional user documentation, please refer to the [main Customer Help page](http://ibm-blue-box-help.github.io/help-documentation/), available online anytime at [_help.blueboxcloud.com_](http://ibm-blue-box-help.github.io/help-documentation/).

A **General Product Overview** for IBM Bluemix Private Cloud version 2.0 and later [is available](http://ibm-blue-box-help.github.io/help-documentation/gettingstarted/commontech/general_product_overview/).

### Every IBM Bluemix Private Cloud 3.0.0 has these new features:

<a name="openstack-mitaka"></a>**Openstack Mitaka Support:**
Several features are now available based on our move to OpenStack Mitaka.

 * It is now possible to set up autoscaling groups and LBaaS (v2) using Heat templates and the Horizon dashboard.
 * The Mitaka release introduces the new **aodh** alert service, which will be installed on any environment that has Ceilometer enabled.
 * For more information, please refer to the [OpenStack Mitaka Release Notes](http://releases.openstack.org/mitaka/).

**Specific OpenStack Services Enabled for every IBM Bluemix Private Cloud, Version 3.0.0, in Mitaka Release:**

 * Block Storage API & Extensions (Cinder v2.0)
 * Compute API & Extensions (Nova v2.1)
 * Dashboard (Horizon ) API N/A
 * Identity API & Extensions (Keystone v3.0)
 * Image Service API (Glance v2.2)
 * Networking API & Extensions (Neutron v2.0, Neutron LBaaS v2)
 * Object Storage API & Extensions (Swift v1.0)
 * Orchestration API (Heat v1.0)
 * Telemetry API (Ceilometer v2.0) (plus aodh)

<a name="federated-keystone"></a>**Keystone-to-Keystone federation across multiple IBM Bluemix Private clouds:**
Keystone-to-Keystone (K2K) federation lets you log in to multiple clouds using your user credentials stored on one Keystone Identity Provider. [We've created a K2K setup article for you.](http://ibm-blue-box-help.github.io/help-documentation/keystone/k2k-federation/)

<a name="new-docs-site"></a>**Updated Documentation Website now accessible through Box Panel:** We've updated and redesigned our customer documentation website, now available at help.blueboxcloud.com, and easily accessible through your Box Panel interface. See the [Box Panel User Guide](http://ibm-blue-box-help.github.io/help-documentation/gettingstarted/userguides/Box_Panel/) for more information.

<a name="regular-updates"></a>**Regular updates for IBM Bluemix Private Cloud Images:** Regular updates for our supported IBM Bluemix Private Cloud Images are available through your Box Panel interface. The customer release notes for all individual image updates are published [here](http://ibm-blue-box-help.github.io/help-documentation/gettingstarted/userguides/Image_Release_Notes/). We've also created a [User Guide for Working with Cloud Images](http://ibm-blue-box-help.github.io/help-documentation/gettingstarted/userguides/Cloud_Images_Provided_by_IBM/).

### IBM Bluemix Private Cloud 3.0.0 (in IBM Cloud Data Centers):

<a name="transit-vlan"></a>**Support for IBM Cloud Data Center VLANs spanning and customer-managed Bare Metal hardware connections:** This feature is designed for any IBM Bluemix Private Cloud customer for whom the performance of Bare Metal servers is a strict requirement, but who also need access to secure communication over the IBM Cloud Data Centers' private network, between their Bare Metal infrastructure and an OpenStack cloud-instance network. **Note:** To use this feature, the Bare Metal hardware must be in a separate, customer-owned and managed SoftLayer account.

<a name="10gb-vyatta"></a>**Vyatta with 10G networking:** This feature is designed for customers with high bandwidth requirements for cloud egress and ingress. 

### IBM Bluemix Private Cloud Local 3.0.0:
<a name="expansion-compute"></a>**New Compute Node Types:** Expansion compute nodes address your requirements for faster IO ephemeral, more RAM, and an order of magnitude larger ephemeral storage.  Expansion nodes allow better coverage of instance types and workloads. With this release, compute types are grouped into Availability Zones for easy targeting of workloads to the appropriate compute type.
You can select from the following compute node extensions to add to your IBM Bluemix Private Cloud Local:

 * You can select specialized expansion compute nodes: IO, or HIGH STORAGE (New in this release)
 * You can select additional standard or enterprise compute nodes: STANDARD COMPUTE, or ENTERPRISE COMPUTE (Previously available)
 * You can select POWER Compute Nodes (Habañero): These nodes particularly support IBM Watson applications, and others.

<a name="block-storage"></a>**Hybrid Block Storage Nodes:** Hybrid Block Storage nodes provide lower-cost and higher-density Block Storage. We've added a Hybrid Ceph Storage node type, which provides lower-cost and higher-density Block Storage. It's 4x the capacity for the same price point as SSD, with an identical software stack and reference architecture. Note that only one type of Block Storage can be used per cluster: SSD Block Storage and Hybrid Block Storage cannot be mixed in the same cluster.

 * You can select Block Storage: SSD or HYBRID

<a name="hipaa"></a>**HIPAA-enabled Cloud:** A HIPAA-enabled cloud has the same configuration and expansion options as any other IBM Bluemix Private Cloud offering, but we are enabling _over 50 additional information-security controls_ that support our customers who must store personal health information (PHI). Because of this increased information security capability, a HIPAA-enabled cloud must be HIPAA-enabled from its inception: you cannot upgrade an existing cloud to enable HIPAA protocol. Also, you cannot downgrade from a HIPAA-enabled Bluemix Private Cloud Local: the existing HIPAA cloud must be wiped—per HIPAA protocol—and you must order a new Local cloud with non-HIPAA controllers.

 * You can now select HIPAA Enablement for IBM Bluemix Private Cloud Local.

<a name="pure-app"></a>**Support for Bluemix Private Cloud on Bluemix Local System (Beta release):** Bluemix Local is an existing IBM system for hardware management (formerly called PureApp). With its Beta release, we are making it available as a platform for IBM Bluemix Private Cloud Local, in addition to the Cisco hardware already available.

### Known Limitations of This Release
**Horizon Dashboard and LBaaS v2:**

 * The LBaaS v2 Horizon dashboard will not let you create `https` listeners.
 * Pool sharing is not available through the Horizon interface.
 * You cannot set the weight of a member to 0 through Horizon.
 * L7 content switching is not available with the default driver. (HaproxyOnHostPluginDriver)
 * TLS Termination is not supported.
 
**OpenStack Community Open Issues for LBaaS v2:**

 * LBaaS VIP is associated with Default security group by default. A workaround is to open the required ports in the default group. https://bugs.launchpad.net/neutron/+bug/1295424
 * Deleting LBaaSv2 does not delete the LBaaS namespace. https://bugs.launchpad.net/neutron/+bug/1495430
 * Health monitor status does not reflect whether health monitor is successful or has failed. https://bugs.launchpad.net/neutron/+bug/1464229
 * PING monitor sends HTTP requests. When the LBaaS v2 health monitor is configured for Ping, it sends HTTP requests. https://bugs.launchpad.net/neutron/+bug/1463816
 * Unable to delete LBaaSv2 health monitor if its listener has been deleted. A workaround is to delete the orphan health monitor from the command line. https://bugs.launchpad.net/neutron/+bug/1571097
 * Can delete `lbaas-pool` with `lbaas-hm` still attached. When this happens, even `admin` cannot delete the remaining Health Monitor, except by going into the database directly. https://bugs.launchpad.net/neutron/+bug/1526964
 
**Horizon Dashboard and projects:**

 * On the Horizon dashboard the quotas edit page is not seen by `cloud_admin` in the Project Edit modal window. Quota modification by `cloud_admin` still is allowed, using the OpenStack CLI or APIs.
 * On the Horizon dashboard Identity Panel, when creating a new project as role `cloud_admin`, an error pop-up menu is displayed (Unable to set project quotas). However, the project is created and it receives the default quota. A user with a `cloud_admin` role can subsequently update the quota, by using the OpenStack CLI or API.
 * On the Horizon dashboard Identity Panel, when modifying an existing project as a user with `cloud_admin` role, an error pop-up menu is displayed (`Unable to modify project`). The project, in fact, will be updated. The pop-up menu is shown because the project quotas could not be set.

**Horizon Dashboard and Admin panel:**

 * On the Horizon dashboard Admin Panel, when clicking on the Hypervisors as a user with `cloud_admin` role, an error pop-up menu is displayed: "Unable to get Nova services list." This behavior is expected because a user with the `cloud_admin` roles is not permitted to do operations on those items. 

**Other Known Limitations:**

 * Neutron RBAC-create: The CLI command `neutron rbac-create` returns a "500" error status code unless `--target-tenant` is specified at the point of initial creation.
 * Block storage performance limitation exists, when tested in the 30-node performance test environment with a hybrid Ceph configuration (HDD + SSD bcache)
 * Keystone-to-Keystone Federation: An issue currently exists with the creation of trust-for-trust delegation by a federated user. To work around this issue, the `heat_stack_owner` role needs to be assigned explicitly to the federated user.

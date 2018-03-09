---
layout: page
title: IBM Bluemix Private Cloud with Red Hat - Product Overview
featured: false
weight: 10
tags: [getting started, release, features, overview]
dateAdded: March 31, 2017
author: Leslie Lundquist
---

**IBM Bluemix Private Cloud with Red Hat** provides a managed private cloud that is deployed on a Red Hat Enterprise Linux (RHEL) 7.3 operating system. It uses downstream OpenStack packages provided by Red Hat OpenStack Platform (RHOSP) and based on [RHOSP 10](https://access.redhat.com/documentation/en/red-hat-openstack-platform/?version=10), which utilizes the [OpenStack Newton release](https://releases.openstack.org/newton/index.html#).

### Table of Contents
 * [Features](#features)
 * [Customer Experience](#customer-experience)
 * [OpenStack Components](#openstack-components)
 * [Box Panel](#box-panel)


### Features

IBM Bluemix Private Cloud with Red Hat, **release 4.0.0.0r**, offers the following high-level cloud features:

 * OpenStack cloud, based on RHOSP 10 (that is, the OpenStack Newton Release)
 * Different types of compute nodes to suit different workloads
 * Nova availability zone customization, which allows aggregation of different compute nodes for workload placements
 * Ability to customize the Glance image store to be Object Storage, Ceph Storage, or local File System on Dedicated Controllers
 * Cinder support with Ceph backend
 * Network customizations such as:
  - Transit VLAN
  - IPSec VPN or OpenVPN
  - BYOIP into OpenStack overlay network
  - Private Network Access between two SoftLayer accounts
  - SoftLayer Direct Link connectivity
 * Load Balancing as a Service (LBaaS v2 using HAProxy Driver)
 * Role-based user identity and cloud management using OpenStack Keystone
 * Ceph backend storage services, with SSD Block Storage available
 * Orchestration with Heat and IBM Urban Code Deploy
 * A catalog of bootable public Images with customer BYOL

For general information about the features that IBM Bluemix Private Cloud provides, see this [General Product Overview](http://ibm-blue-box-help.github.io/help-documentation/gettingstarted/commontech/general_product_overview/).

The following figure illustrates the overall product architecture:

![RHOSP_architecture_overview]({{site.baseurl}}/img/RSHOSP_Product_Overview.png)


### Customer Experience

**IBM Bluemix Private Cloud with Red Hat** provides the same customer experience as [IBM Bluemix Private Cloud](http://ibm-blue-box-help.github.io/help-documentation/gettingstarted/commontech/general_product_overview/), except for the following things:

<table>
    <tr>
        <td>Option</td>
        <td>IBM Bluemix Private Cloud with Red Hat</td>
        <td>IBM Bluemix Private Cloud</td>
    </tr>
    <tr>
        <td>Operating system</td>
        <td>RHEL 7.3</td>
        <td>Ubuntu 14.04</td>
    </tr>
    <tr>
        <td>OpenStack Release</td>
        <td>RHOSP 10 based on OpenStack Newton</td>
        <td>OpenStack Mitaka</td>
    </tr>
</table>

Because the customer experience is so similar, you can refer to customer documentation on our help site, even if it is not specifically labelled for **IBM Bluemix Private Cloud with Red Hat** clusters.

If you want to view a hardware Bill of Materials for your cloud environment, contact your service team. The configuration may vary depending on SoftLayer data center locations and the current inventory.

### OpenStack Components

The following table summarizes the OpenStack components in IBM Bluemix Private Cloud with Red Hat, their API versions, the port numbers, and the relevant user documentation. 

| Service    | Version   | API Version | Port    | Related Documentation  |
|------------|-----------|-------------|---------|----------------|
| Horizon    | 10.0.1    |  N/A    | 80, 443 | [Using the Horizon Dashboard](http://ibm-blue-box-help.github.io/help-documentation/horizon/) |
| Keystone   | 10.0.0    |  v3     | 5000    | [Managing Users and Identity](http://ibm-blue-box-help.github.io/help-documentation/nova/) |
| Nova       | 14.0.2   |   v2.1   | 8774    | [Working With Virtual Machine Instances](http://ibm-blue-box-help.github.io/help-documentation/keystone/) |
| Glance     | 13.0.0    |   v2   | 9292    | [Using Images](http://ibm-blue-box-help.github.io/help-documentation/glance/) |
| Cinder     | 9.1.1    |   v3  | 8776    | [Block Storage Concepts](http://ibm-blue-box-help.github.io/help-documentation/cinder/) |
| Neutron    | 9.1.1    |  v2   | 9696    | [Networking Concepts](http://ibm-blue-box-help.github.io/help-documentation/neutron/) |
| Heat       | 7.0.1    |  v1   | 8004    | [Autoscaling with Heat Templates](http://ibm-blue-box-help.github.io/help-documentation/heat/) |
| Heat-cfn   | 7.0.1     |  v1  | 8000    |
| Ceilometer | 7.0.1     |  N/A  | 8777    |
| Aodh       | 3.0.1     |  N/A  | 8042    |
| Swift      | 2.10.1    |   v1 | 8080    | [Object Storage Concepts](http://ibm-blue-box-help.github.io/help-documentation/openstack/userdocs/openstack-storage-concepts/) |
 

See also the [IBM Bluemix Private Cloud components](http://ibm-blue-box-help.github.io/help-documentation/gettingstarted/commontech/blue-box-cloud-components/).

### Box Panel

The Box Panel application suite gives you a single, consolidated view of assets deployed in your cloud environment. 

Box Panel is built for deploying and operating a private cloud infrastructure throughout its life cycle, including management of software and services from setting up the rack, to billing, and customer support interaction.

The Box Panel suite includes several applications that handle different areas of its functionality:

* Box Panel—the information storehouse for managing machines, rack schematics, IP addresses, network deployments, and associated information.
* Box Panel Auth—the app that authorizes users and allows management of users and projects through role-based access control (RBAC).
* Box Panel Support—the app that handles customer ticketing and related support features.
* Box Panel Chat—the app that provides live chat interactions for customers.
* Box Panel Messenger Service—the app that interacts with Site Controller and Ursula to provide automated deployment, expansion, and updating capabilities through an architecture based on services and workers.

For more information about Box Panel, see the following articles:

* [Box Panel User's Guide for IBM Bluemix Private Cloud](http://ibm-blue-box-help.github.io/help-documentation/gettingstarted/userguides/Box_Panel/)
* [Box Panel, Site Controller, and IBM Bluemix Private Cloud Local](http://ibm-blue-box-help.github.io/help-documentation/gettingstarted/userguides/Eternal_Blue-ish_Triangle/)
* [Common Adminstrative Questions](http://ibm-blue-box-help.github.io/help-documentation/gettingstarted/)

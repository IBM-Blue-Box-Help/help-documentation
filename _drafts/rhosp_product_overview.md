---
layout: page
title: IBM Bluemix Private Cloud using RHOSP Product Overview
featured: false
weight: 10
tags: [getting started, release, features, overview]
dateAdded: March 29, 2016
author: Leslie Lundquist
---

## IBM Bluemix Private Cloud using Red Hat OpenStack Platform (RHOSP)

IBM Bluemix Private Cloud using Red Hat OpenStack Platform (RHOSP) provides a managed private cloud that is deployed on a Red Hat Enterprise Linux (RHEL) 7.3 operating system. It uses downstream OpenStack packages provided by RHOSP and based on [RHOSP 10](https://access.redhat.com/documentation/en/red-hat-openstack-platform/?version=10), which utilizes the [OpenStack Newton release](https://releases.openstack.org/newton/index.html#).


### Features

IBM Bluemix Private Cloud using RHOSP offers the following high-level cloud features:

 * OpenStack cloud, based on RHSOP 10 (that is, the OpenStack Newton Release)
 * Different types of compute nodes to suit different workloads
 * Nova availability zone customization allows aggregation of different compute nodes for workload placements
 * Ability to customize the Glance image store to be Object Storage, Ceph Storage, or local File System on Dedicated Controllers
 * Cinder with multi-backend support
 * Network customizations such as:
  * IP address management
  * Transit VLAN
  * IPSec VPN or OpenVPN
  * BYOIP into OpenStack overlay network
  * Private Network Access between two SoftLayer accounts
  * SoftLayer Direct Link connectivity
 * Load Balancing as a Service (LBaaS v2 using HAProxy Driver)
 * Federated identity service through Keystone
 * Role-based user identity and cloud management
 * Ceph backend storage services, SSD and hybrid storage pools
 * Orchestration with Heat and IBM Urban Code Deploy
 * A catalog of bootable public Images with customer BYOL

IBM Bluemix Private Cloud using RHOSP provides the same customer experience as [IBM Bluemix Private Cloud](http://ibm-blue-box-help.github.io/help-documentation/gettingstarted/commontech/general_product_overview/), except for the following things:

<table>
    <tr>
        <td>Option</td>
        <td>IBM Bluemix Private Cloud using RHOSP</td>
        <td>IBM Bluemix Private Cloud</td>
    </tr>
    <tr>
        <td>Operating system</td>
        <td>RHEL 7.3</td>
        <td>Ubuntu 14.04 or Cirros 0.3.3 x86_64</td>
    </tr>
    <tr>
        <td>OpenStack Release</td>
        <td>RHOSP 10 based on OpenStack Newton</td>
        <td>OpenStack Mitaka</td>
    </tr>
</table>

For more information about the features that IBM Bluemix Private Cloud provides, see its [General Product Overview](http://ibm-blue-box-help.github.io/help-documentation/gettingstarted/commontech/general_product_overview/).

If you want to view a Bill of Materials of your cloud environment, contact your service team. The configuration may vary depending on SoftLayer data center locations and the current inventory.

### Components

<table>
    <tr>
        <td>Service</td>
        <td>API version</td>
        <td>Port</td>
        <td>RHOSP documentation</td>
    </tr>
    <tr>
        <td>Horizon (customized for role-based access control)</td>
        <td>N/A</td>
        <td>80,443</td>
        <td><a href="https://access.redhat.com/documentation/en/red-hat-openstack-platform/10/single/introduction-to-the-openstack-dashboard/">Introduction to the OpenStack Dashboard</a></td>
    </tr>
    <tr>
        <td>Nova</td>
        <td>N/A</td>
        <td>8774</td>
        <td><a href="https://access.redhat.com/documentation/en/red-hat-openstack-platform/10/single/instances-and-images-guide/#ch-manage_instances">Virtual Machine Instances</a></td>
    </tr>
    <tr>
        <td>Keystone</td>
        <td>N/A</td>
        <td>5000</td>
        <td><a href="https://access.redhat.com/documentation/en/red-hat-openstack-platform/10/single/users-and-identity-management-guide">Users and Identity Management Guide</a></td>
    </tr>
    <tr>
        <td>Glance</td>
        <td>N/A</td>
        <td>9292</td>
        <td><a href="https://access.redhat.com/documentation/en/red-hat-openstack-platform/10/single/instances-and-images-guide/#ch-image-service">Images Service</a></td>
    </tr>
    <tr>
        <td>Cinder</td>
        <td>N/A</td>
        <td>8776</td>
        <td><a href="https://access.redhat.com/documentation/en/red-hat-openstack-platform/10/paged/storage-guide/">Storage Guide</a></td>
    </tr>
    <tr>
        <td>Neutron</td>
        <td>N/A</td>
        <td>9696</td>
        <td><a href="https://access.redhat.com/documentation/en/red-hat-openstack-platform/10/single/networking-guide/">Networking Guide</a></td>
    </tr>
    <tr>
        <td>Ceilometer</td>
        <td>N/A</td>
        <td>8777</td>
        <td><a href="https://access.redhat.com/documentation/en/red-hat-openstack-platform/10/single/auto-scaling-for-compute/">Autoscaling for compute</a></td>
    </tr>
    <tr>
        <td>Swift</td>
        <td>N/A</td>
        <td>8080</td>
        <td><a href="https://access.redhat.com/documentation/en/red-hat-openstack-platform/10/single/storage-guide/#ch-manage-containers">Object storage</a></td>
    </tr>
</table>


See also the [IBM Bluemix Private Cloud components](http://ibm-blue-box-help.github.io/help-documentation/gettingstarted/commontech/blue-box-cloud-components/).

### Box Panel

Box Panel is built for deploying and operating a private cloud infrastructure throughout its life cycle, including management of software and services from setting up the rack, to billing, and customer support interaction.

The Box Panel Suite includes several applications that handle different functional areas of its functionality:

* Box Panel—the information storehouse for managing machines, rack schematics, IP addresses, network deployments, and associated information.
* Box Panel Auth—the app that authorizes users and allows management of users and projects through role-based access control (RBAC).
* Box Panel Support—the app that handles customer ticketing and related support features.
* Box Panel Chat—the app that provides live chat interactions for customers.
* Box Panel Messenger Service—the app that interacts with Site Controller and Ursula to provide automated deployment, expansion, and updating capabilities through an architecture based on services and workers.

For more information about Box Panel, see the following articles:

* [Box Panel User's Guide for IBM Bluemix Private Cloud](http://ibm-blue-box-help.github.io/help-documentation/gettingstarted/userguides/Box_Panel/)
* [Box Panel, Site Controller, and IBM Bluemix Private Cloud Local](http://ibm-blue-box-help.github.io/help-documentation/gettingstarted/userguides/Eternal_Blue-ish_Triangle/)
* [Common Adminstrative Questions](http://ibm-blue-box-help.github.io/help-documentation/gettingstarted/)


 









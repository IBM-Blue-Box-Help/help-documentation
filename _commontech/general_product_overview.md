---
layout: page
title: General Product Overview
featured: false
weight: 10
tags: [getting started, release, features, overview]
dateAdded: March 29, 2016
author: Leslie Lundquist
---

### General Product Overview

All offerings of **IBM Bluemix Private Cloud**, Dedicated and Local, or **IBM Bluemix Private Cloud with Red Hat** are deployed automatically through a **Site Controller** machine, which serves as a storehouse for the **Ursula/Ansible playbooks** we use to create your cloud. You can view the [Ursula playbooks](https://github.com/blueboxgroup/ursula) on **GitHub**. They are open source documents.

**Site Controller**

To deploy any **IBM Bluemix Private Cloud** or **IBM Bluemix Private Cloud with Red Hat** offering, a physical **Site Controller** machine must be located in an **IBM Cloud Data Center** within the same geographical region in which your new cloud is deployed.

To deploy the **IBM Bluemix Private Cloud Local** offering, a Site Controller logical machine must be co-located within your IBM Local Cloud data center, and it will communicate with a Central Site Controller machine at your IBM Cloud Data Center.

Each version of **Ursula** on the Site Controller is tailored to initialize and run a specific version of OpenStack and IBM Cloud product, by setting up the proper environment variables and other aspects of your customized cloud configuration. The next section describes the environment that Ursula creates for your cloud.

**Software Environment Created by Ursula**

IBM Bluemix Private Cloud software is based on **Ubuntu 14.04** and the **Mitaka** release of OpenStack. The IBM Bluemix Private Cloud with Red Hat software is based on **RHEL 7.3** and the **Newton** release of OpenStack. Both offerings specifically include these OpenStack modules:

 * Nova, 
 * Glance (backend points to Swift), 
 * Swift, 
 * Cinder (data storage backed by Ceph clusters), 
 * Neutron L3 HA, 
 * Neutron LBaaS v2, 
 * Keystone, 
 * Horizon, 
 * Heat, 
 * Ceilometer (+MongoDB). 
 
Your cloud also will include some third-party software monitoring tools that work along with the OpenStack modules: Grafana, ELK, and Sensu.

Upon request, IBM will enable some additional enhanced features:

* OpenStack software load balancer (LBaaS) that is managed through Neutron (it requires the Dedicated Controller feature)
* VLAN support for spanning between clouds
* Integration with Urban Code Deployer (UCD) through an OpenStack Heat (Orchestration) plug-in.

**Hardware Environment and Monitoring**

The IBM Bluemix Private Cloud hardware substrate varies by offering. You can get more information about the Bill of Materials (BOM) from your IBM Bluemix Private Cloud service team.

You can use the **OpenStack Horizon** interface to monitor your cloud’s performance, or you can use our customized product, **Box Panel**, to view your cloud as well as your resource usage, your network configurations, and other features of your cloud.

You can find more information about how to use Box Panel in the [Box Panel User Guide.](http://ibm-blue-box-help.github.io/help-documentation/gettingstarted/userguides/Box_Panel/)

**Support**

Your purchase of IBM Bluemix Private Cloud includes 24/7 technical support. The Box Panel product provides an interface for opening a support ticket. You also can call Bluemix Private Cloud Support at 1-800-613-4305 or email us at *support@bluebox.net*.

For more detailed information about your cloud configuration, please refer to these documents;

 * [Building Blocks for IBM Bluemix Private Cloud](http://ibm-blue-box-help.github.io/help-documentation/gettingstarted/commontech/Building_Blocks/)

 * [Building Blocks for IBM Bluemix Private Cloud with Red Hat](http://ibm-blue-box-help.github.io/help-documentation/gettingstarted/commontech/RHOSP_Building_Blocks/)

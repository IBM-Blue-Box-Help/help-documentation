---
layout: page
title: Using IBM Urban Code Deploy with IBM Bluemix Private Cloud
featured: no
weight: 10
tags: [heat, deploy, UCD, UCDP]
author: Ying Tang, Pan Xia Zou
dateAdded: June 7, 2016
---

**IBM Urban Code Deploy with Patterns** (UCDP) is an environment management and deployment solution that you can use to deploy applications to multiple clouds, and manage their lifecycles. 

Whereas UCDP provides a graphic and text editor for you to design, test, and promote your full-stack environments, **IBM Urban Code Deploy** (UCD) is a more complete solution that helps you fully configure your components.

The Heat engine with IBM Bluemix Private Cloud can interact with UCDP and UCD. If you have UCDP and UCD installed on your instance, you can establish a secured connection from your instance to the Heat engine, and then deploy an application quickly on your instance through UCDP and UCD.

You can either install the UCDP and UCD servers on instances in the same IBM Bluemix Private Cloud environment that you want to integrate with, or on external servers outside IBM Bluemix.

The following sections cover both cases by introducing the steps to install UCDP and UCD and then integrate them with IBM Bluemix Private Cloud.

The following sections uses UCD 6.1.1 and UCDP 6.1.1 as examples. Information about different versions can be found in [IBM Knowledge Center](http://www.ibm.com/support/knowledgecenter/).

## Prerequisites

1. Download the UCDP and UCD installation packages from [IBM Fix Central](http://www-933.ibm.com/support/fixcentral/).

2. If you want to install UCD or UCDP on instances in a cloud environment, these instances must have public floating IPs.

3. To install UCDP and UCD on external servers, ensure that your servers meet the system requirements of UCDP and those of UCD. For more details, see [UCDP system requirements](http://www-01.ibm.com/support/knowledgecenter/SSWS3W_6.1.1/com.ibm.edt.doc/topics/install_sysreqs.html) and [UCD system requirements](https://www-01.ibm.com/support/knowledgecenter/SS4GSP_6.1.1/com.ibm.udeploy.install.doc/topics/sysRequire.html?cp=SS4GSP_6.1.1%2F3-0).



## Installing UCDP

Follow these steps to install UCDP:

1. Install a database. Refer to the [Installing the database chapter](http://www-01.ibm.com/support/knowledgecenter/SSWS3W_6.1.1/com.ibm.edt.doc/topics/install_database_ov.html) in the IBM UCDP Knowledge Center.
2. Install the design server in the interactive mode. Refer to the [Installing the design server chapter](http://www-01.ibm.com/support/knowledgecenter/SSWS3W_6.1.1/com.ibm.edt.doc/topics/install_server.html) in the IBM UCDP Knowledge Center.

**Notes:**

* Only the default ports (8080 and 8443) are supported. If you want to use different ports, open a support ticket.
* During installation, accept the default trial license path `27000@localhost` unless you have your own license. You can update the license after installation.
* When prompted with the question "What host name will users access the web UI at?", if your host name is not registered, specify the IP address instead of the host name.
* It is best practice to make the versions of the database server and the database driver consistent.

For the complete UCDP documentation, see [IBM UCDP Knowledge Center](http://www-01.ibm.com/support/knowledgecenter/SSWS3W_6.1.1/com.ibm.edt.doc/edt61_welcome.html).

## Installing UCD

Follow these steps to install UCD:

1. Install a database. Refer to the [Installing the database chapter](https://www-01.ibm.com/support/knowledgecenter/SS4GSP_6.1.1/com.ibm.udeploy.install.doc/topics/DBinstall.html) in the IBM UCD Knowledge Center.
2. Install the server in the interactive mode. Refer to the [Install the server chapter](https://www-01.ibm.com/support/knowledgecenter/SS4GSP_6.1.1/com.ibm.udeploy.install.doc/topics/serverInstall.html) in the IBM UCD Knowledge Center.

For the complete UCD documentation, see [IBM UCD Knowledge Center](https://www-01.ibm.com/support/knowledgecenter/SS4GSP_6.1.1/com.ibm.udeploy.doc/ucd61_welcome.html).

**Note:**

* Only the default ports (7918, 8080, and 8443) are supported. If you want to use different ports, open a support ticket.
* It is best practice to make the versions of the database server and the database driver consistent.

## Integrating UCD with UCDP

Integrate your UCD with UCDP by following the instructions in [Connecting to IBM UrbanCode Deploy](http://www-01.ibm.com/support/knowledgecenter/SSWS3W_6.1.1/com.ibm.edt.doc/topics/integrate_ucd.html).

## Connecting to IBM Bluemix Private Cloud with UCDP and UCD

1. For UCD and UCDP installed on external servers only: Use an OpenVPN client to connect to the cloud environment that you want to integrate with. For more information about accessing the environment, see [Setting up OpenVPN server on your instance](http://ibm-blue-box-help.github.io/help-documentation/gettingstarted/commontech/openvpn-setup/).

2. Connect the UCDP server to IBM Bluemix Private Cloud by following the instructions in [Connecting to OpenStack-based clouds with Keystone authentication](http://www-01.ibm.com/support/knowledgecenter/SSWS3W_6.1.1/com.ibm.edt.doc/topics/cloud_connect_openstack_keystone.html).

**Note:** When connecting the UCDP server to IBM Bluemix Private Cloud, create an authentication realm that points to the Keystone server, and keep the **Use default orchestration engine** check box checked when configuring the realm.


With the connection established, you can now deploy applications to IBM Bluemix Private Cloud within IBM Urban Code Deploy and IBM Urban Code Deploy with Patterns.

**Note:** If you use an image that has a period (.) in the image name, update the VM name created in Blueprint in the Properties field to remove the period (.). Otherwise, the name of the VM created will contain a period (.) by default, which causes software deployment to fail.

For more information about IBM Bluemix Private Cloud and UCD, watch [this video](https://developer.ibm.com/urbancode/videos/deploy-your-apps-with-ibm-bluebox-ibm-urbancode-deploy/) about deploying your applications with IBM Bluemix & IBM Urban Code Deploy.

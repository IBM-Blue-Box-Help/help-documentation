---
layout: page
author: IBM Bluemix Private Cloud Support
title: Using the CLI to Set Up Security Groups
dateAdded: October 12, 2016
tags: [neutron, security groups, ports, flags]
featured: false
weight: 6
---


Need to set up security groups in Neutron using the command line interface? You can find the command line usage here: http://docs.openstack.org/cli-reference/neutron.html#neutron-port-update 

This `neutron port-update` lets you append security groups to existing ports by specifying with a `--security-group` flag. You also can find the commands to operate on the security groups in the same doc, and listed below:

```
security-group-create
#Create a security group.

security-group-delete
#Delete a given security group.

security-group-list
#List security groups that belong to a given tenant.

security-group-rule-create
#Create a security group rule.

security-group-rule-delete
#Delete a given security group rule.

security-group-rule-list
#List security group rules that belong to a given tenant.

security-group-rule-show
#Show information of a given security group rule.

security-group-show
#Show information of a given security group.

security-group-update
#Update a given security group.
```

Yet another walk-through doc for your reference is available at: http://docs.openstack.org/user-guide/cli-nova-configure-access-security-for-instances.html

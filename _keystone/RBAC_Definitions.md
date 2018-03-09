---
layout: page
title: Role-Based Access Control
featured: false
tags: [keystone, users, roles, failover, RBAC, cloud_admin, migration, live migration, cold migration, affinity]
dateAdded: March 11th, 2016
dateUpdated: February 17th, 2017
---

### Role-Based Access Control (RBAC) and access to OpenStack services

Currently, these roles are defined:

• `admin`: allows full access across all projects. (Reserved for IBM Bluemix operations team)
	
• `cloud_admin`: allows cloud-level access control. This role lets you perform API execution tasks, irrespective of your project.
	
• `project_admin`: allows project-level access control.
	
• `_member_`: allows the user to use the resources (such as instances and volumes) that are allocated for the project.
	
• `heat_stack_owner`: lets you deploy a Heat stack (always used along with other roles).

None of these roles provides the level of granularity required to restrict access only to a particular OpenStack service.
However, assuming that you are interested in automating updates to Neutron port binding as part of your load balancer failover solution, this may be possible by creating an ID with the **member** role in the desired tenant. Looking at `/etc/neutron/policy.json`, it appears that a port can be updated by any **member** of the tenant (as defined in the "is_owner" rule):

{% highlight bash %}
"is_owner": "project_id:%(tenant_id)s or project_id:%(project_id)s"
"admin_or_owner": "rule:cloud_admin_privilege or rule:is_owner or rule:project_admin_privilege"
"update_port": "rule:admin_or_owner or rule:context_is_advsvc"
{% endhighlight %}

If you would like to see more granular roles in a future release, we can [open a feature request](https://support.bluebox.net/) to our product team.

#### Known Problem with Horizon Can Create Confusion for Cloud Admins

A Cloud Admin may see a "Live Migration" option when looking at instances in the Admin panel of Horizon. However, the Live Migration functionality is policy restricted to the "admin" role, which IBM Bluemix retains and does not provide to customers. Horizon will present an error if a non-admin attempts to live migrate an instance.
 
This is a small UI/UX problem in Horizon, in that it offers to do things that Policy will prevent.

Both live and cold migration are not supported for customer use, in part due to unreliability. It is possible these features will become more reliable in a future release of OpenStack, in which case they will be re-evaluated.

The alternative, which works well, is to snapshot and re-provision the instances using anti-affinity groups.  See http://ibm-blue-box-help.github.io/help-documentation/nova/deploy-to-specific-hypervisor/ for more information on doing this.

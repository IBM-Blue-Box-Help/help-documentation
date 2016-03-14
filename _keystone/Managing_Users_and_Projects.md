---
layout: page
title: Managing Users and Projects
featured: false
tags: [users, roles, Keystone]
date: February 29th, 2016
author: Adelia Wong
---

#Managing users and projects

##Basic concepts

**Users**: A user is an individual or a service with login credentials to the OpenStack environment. A user has one or more roles and belongs to one or more projects.

**Projects**: Projects are organizational units in the cloud, and are also known as tenants or accounts. Each user is a member of one or more projects. Within a project, a user creates and manages resources such as instances and volumes. Administrators can set limits to how many resources (instances, vCPU, volumes, and more) that a project is allowed to create.

**Roles**: A role is a group of privileges that allow a user to perform a specific set of operations.

**Groups**: Groups work as the link between users and roles. A user can be a member of one or more groups and a group can have one or more roles associated with it.

Your IBM Blue Box Cloud installation comes with four predefined roles: **cloud_admin**, **project_admin**, **\_member\_**, and **heat_stack_owner**.

- **cloud_admin** allows cloud level access control. This allows you to perform API execution irrespective of the project you belong to. This role can create and manage quotas, groups, users and projects, and perform administrative volume actions. 
- **project_admin** allows project level access control. This user can perform user and project mangement within the specified project.
- **\_member\_** allows the user to use the resources (like instances and volumes) that are allocated for the project.
- **heat_stack_owner** allows the user to create heat stacks in the project. This role must be manually assigned, and should never be assigned to a user that is also assigned the **heat_stack_user** role.
- **heat_stack_user** is a role automatically assigned by Heat to the users it creates. This role is restricted from all API access and should never be explicitly assigned to any user. 

The cloud_admin role is restricted to cloud and project management actions. A higher set of privileges is granted exclusively to the **admin** role, which includes administrative actions for services, domains and roles, networks, and identity providers. The **admin** role is restricted to IBM and is not granted to the customer. 

With your IBM Blue Box Cloud installation you receive one user with cloud_admin privileges who can create other projects and users. The cloud_admin can grant users cloud_admin and lower privileged roles.


Identity Feature | cloud_admin | project_admin (within project) |  \_member\_
---------------- | ----------- | ------------------------------ | -----------
**Users** |||
Create user     | Y | Y | N
Update user     | Y | Y | Y (Self)
Get user        | Y | Y | Y (Self)
Delete user     | Y | Y | N
Change password | Y | Y | Y (Self)
List user       | Y | Y | N
**Roles** |||
Create role     | N | N | N
Update role     | N | N | N
Get role        | Y | Y | N
Delete role     | N | N | N
List role       | Y | Y | N
**Projects** |||
Create project  | Y | N | N
Update project  | Y | Y | N
Get project     | Y | Y | Y
Delete project  | Y | N | N
List projects   | Y | Y | N
List user projects  | Y | Y | Y (Self)
List users within projects  | Y | Y | N
**Groups** |||
Create, update, or delete group | Y | N |  N
Get group       | Y | Y | Y
List groups     | Y | Y | N
List groups for user  | Y | Y | Y (Self)
List users in group | Y  | Y | Y
Add or remove user from group | Y | Y| N

Compute Feature | cloud_admin | project_admin (within project) |  \_member\_
--------------- | ----------- | ------------------------------ | -----------
Create instance | Y | Y | Y
Delete instance | Y | Y | Y
Attach network  | Y | Y | Y
Attach volume   | Y | Y | Y
Start/Stop instance | Y | Y | Y (owner)
List instance   | Y | Y | Y 
Lock/Unlock instance    | Y | Y | N
Create flavor   | Y | N | N
Update flavor   | Y | N | N
Delete flavor   | Y | N | N
Update quotas   | Y | N | N
Delete quotas   | Y | N | N
List quotas     | Y | Y | Y

Volume Feature | cloud_admin | project_admin (within project) |  \_member\_
--------------- | ----------- | ------------------------------ | -----------
**Volumes** |||
Create volume   | Y | Y | Y
Extend volume   | Y | Y | Y
Get volume      | Y | Y | Y
List volumes    | Y | Y | Y
Delete volume   | Y | Y | Y
Add project access  | Y | N | N
Remove project access | Y | N | N
**Snapshots** |||
Create snapshot | Y | Y | Y
List snapshots    | Y | Y | Y
Delete snapshot | Y | Y | Y
**Transfers** |||
Create transfer | Y | Y | Y
Accept transfer | Y | Y | Y
Delete transfer | Y | Y | Y
List transfer s | Y | Y | Y
**Backups** |||
Create backup | Y | Y | Y
Delete backup | Y | Y | Y
List backups  | Y | Y | Y
Import backup | Y | N | N
Export backup | Y | N | N

Image Feature | cloud_admin | project_admin (within project) |  \_member\_
--------------- | ----------- | ------------------------------ | -----------
Create image    | Y | Y | Y
Delete image    | Y | Y | Y
List images     | Y | Y | Y
Download image  | Y | Y | Y
Upload image    | Y | Y | Y
Publicize image | N | N | N
Manage image cache | N | N | N

Network Feature | cloud_admin | project_admin (within project) |  \_member\_
--------------- | ----------- | ------------------------------ | -----------
Create network  | Y | Y | Y
Create shared network | N | N | N
Update network  | Y | Y | Y (owner)
Delete network  | Y | Y | Y (owner)
Create port     | Y | Y | Y
Update port     | Y | Y | Y (owner)
Delete port     | Y | Y | Y (owner)
Create router   | Y | Y | Y 
Update router   | Y | Y | Y (owner)
Delete router   | Y | Y | Y (owner)
Create subnet   | Y | Y | Y (network owner)
Update subnet   | Y | Y | Y (owner)
Delete subnet   | Y | Y | Y (owner)
Create floating IP  | Y | Y | Y
Delete floating IP  | Y | Y | Y

Object Storage Feature | cloud_admin | project_admin (within project) |  \_member\_
---------------------- | ----------- | ------------------------------ | -----------
**Accounts** |||
Create account | Y | N | N
Delete account | Y (enabled) | N | N
**Containers** |||
Create container | Y | Y | N
Update container | Y | Y | N
Delete container | Y | Y | N
**Objects** |||
Create object    | Y | Y | Y
Update object    | Y | Y | Y
Download object  | Y | Y | Y
Delete object    | Y | Y | Y


##Requirements
This role structure requires Keystone API v3 to run. Using API v2.0 will result in a loss of privileges for the cloud_admin and project_admin, in addition to erratic permissions behavior for \_member\_ users.


Making API calls through the Horizon dashboard do not require any special action, but performing command line calls necessitates changes to the RC file. Currently, the dashboard-generated RC files enables Keystone v2.0. Switching to v3 requires changes to the standard RC file. The `OS_AUTH_URL` must be changed from `v2.0` to `v3`, and the `OS_IDENTITY_API_VERSION` must be created and set to `3`. A sample RC file is shown below.

{% highlight bash %}

export OS_PASSWORD=pass
export OS_AUTH_URL=https://example.ibm.com:5000/v3
export OS_USERNAME=cloud_admin
export OS_TENANT_NAME=demo
export OS_CACERT=/opt/stack/ssl/openstack.crt
export OS_NO_CACHE=True
export OS_VOLUME_API_VERSION=2
export OS_COMPUTE_API_VERSION=2
export OS_IDENTITY_API_VERSION=3
{% endhighlight %}

Additionally, Keystone functions must be performed using the new `python-openstackclient` CLI. This can be installed by running `sudo pip install python-openstackclient`.

###Using the Keystone v3 group function 
The version 3 of the Keystone API with IBM Blue Box Cloud introduces the concept of groups. You can use groups to quickly and easily make multiple assignments simultaneously.

For example, you might have a support team which needs access to every project in your environment. Instead of individually adding each member to every project, you can create a group called Support, give the group the \_member\_ role on all of your projects, and then add all of your support staff to the group.

Another common use case would be to create a cloud_admin group that is given the cloud_admin role on every project on the environment. This allows the cloud_admin to easily elevate a user’s privileges by temporarily adding them to the cloud_admin group and could be used in situations like vacation coverage.

You can see the difference in approach by these two illustrations.

![User Management With Roles](http://open.ibmcloud.com/documentation/_images/UserManagementWithRoles.gif)

This figure shows an example of traditional role assignments as supported by Keystone v2 API. The cloud_admin User has the cloud_admin role for Project 1, Project 2, and Project 3. User 1 has the project_admin role for Project 2. User 2 and Support User 1 have the \_member\_ role for Project 2. Support User 1 also has the \_member\_ role for Project 3.

![User Management with Groups](http://open.ibmcloud.com/documentation/_images/UserManagementWithGroups.gif)

###Consequences of disabling projects
Users with the cloud_admin role can enable and disable projects. When you disable a project, it has these consequences:

- In the dashboard, users can no longer access the project from the CURRENT PROJECT list on the Project tab.
- Users who are members of only the disabled project can no longer log in.
- You cannot launch instances for a disabled project. Instances that are already running are not automatically terminated. You must stop them manually.
- The data for a disabled project is maintained so that you can enable the project at any time.

##Using the dashboard
###Adding a project
1. In the navigation bar, open the Identity panel and click on **Projects**.
2. Click **Create Project**.
3. On the Project Information tab in the Create Project window, enter a name and description for the project. By default, the project is enabled.
4. On the Project Members tab, add members to the project and assign the appropriate roles.
5. On the Project Groups tab, add groups of users to the project and assign the appropriate roles.
6. On the Quota tab, edit quota values.
7. Click **Create Project**.
The Projects list shows the project, including its assigned ID.

###Updating a project
You can update a project to change its name or description, and to enable or temporarily disable it.

1. In the navigation bar, open the Identity panel and click on **Projects**.
2. Select the project that you want to update.
3. Select **Edit Project** from the drop down list under the Actions column.
4. In the Edit Project window, you can update a project to change its name or description, and to enable or temporarily disable it. By default, the project is enabled. To temporarily disable it, clear the **Enabled** check box. To enable a disabled project, select the **Enabled** check box.
5. Click **Save**.

###Modifying user assignments for a project
If you have the cloud_admin role you can assign roles on any project. If you have the project_admin role you can modify assignments on projects where you have the project_admin role applied.

1. In the navigation bar, open the Identity panel and click on **Projects**.
2. Click the **Manage Members** button for the project that you want to modify.

The Edit Project window shows these lists of users:
- **All Users**: Users that are available to be assigned to the current project.
- **Project Members**: Users that are assigned to the current project.
You can also assign groups of users in the Project Groups tab.

###Deleting projects
1. In the navigation bar, open the Identity panel and click on **Projects**.
2. Select the projects that you want to delete.
3. Click **Delete Projects** to confirm the deletion.

###Creating a user account
If you have the cloud_admin or project_admin roles you can create new user accounts. When you create a user account, you must assign the account to a primary project. You also have the option of assigning the account to additional projects. 

1. In the navigation bar, open the Identity panel and click on **Users**.
2. Click **Create User**.
3. In the **Create User** window, enter a user name, email, and preliminary password for the user. Confirm the password. Select a project from the Primary Project list. Choose a role for the user from the Role list. Default is \_member\_.
4. Click **Create User** to confirm your changes.
The dashboard assigns an ID to the user, and the user appears in the Users category.

###Disabling or enabling a user
If you have the cloud_admin or the project_admin role you can enable and disable user accounts. When you disable a user account, the user can no longer log in. However, the data for the user is maintained so that you can enable the user at any time.

1. In the navigation bar, open the Identity panel and click on **Users**.
2. Locate the user that you want to disable or enable in the Users list.
3. Select **Disable User** or **Enable User** from the drop down list under the Actions column.
In the Enabled column, the enabled value updates to either Yes or No.

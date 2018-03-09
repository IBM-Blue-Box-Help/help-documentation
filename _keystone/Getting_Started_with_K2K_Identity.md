---
layout: page
title: Getting Started with Keystone Federated Identity
author: Elvin Tubillara
tags: [keystone, federation, k2k, groups]
dateAdded: March 6, 2017
featured: true
weight: 4
---

Keystone-to-Keystone (K2K) Federated Identity uses the OpenStack Keystone v3 component, which is commonly used for authentication. If you're just getting started with OpenStack, you can learn more about Keystone and other OpenStack core components in another article, [The Power of OpenStack](https://www.ibm.com/blogs/bluemix/2016/07/the-power-of-openstack/).

Our team of experts automatically sets up K2K Federated Identity upon request. Once set up, an administrator, or `cloud_admin` user, can manage federated identities by managing permissions through groups, and by managing mappings from remote users, from the Identity Provider to local groups on the Service Providers. Service Providers use mappings to select the OpenStack user attributes from the Identity Provider, and then they use those attributes to map the user to a local group. Once the user logs in using K2K Federated Identity, the user is granted the roles assigned to the group, automatically.

The following examples show how federated users that belong to a demo project on the Identity Provider have access to the demo project on the service provider.

### Creating groups for federated users

Let’s create a group called `demo_member_group` and assign it the `_member_` role on the demo project.

Run the following commands as the Service Provider `cloud_admin` user:

```
$ openstack group list
$ openstack group create demo_member_group --or-show
$ openstack project list
$ openstack role list
$ openstack role add _member_ --project demo --group demo_member_group
```

The `demo_member_group` will now have access to the demo project.

### Creating mappings for federated users

Once a group is created, you can create mappings to map remote users from the Identity Provider to a local group on the Service Provider.

The following example shows how to create a mapping file that maps Identity Provider users, assigned the `_member_` role on the demo project, to the `demo_member_group` on the Service Provider.

First, you'll need to create a file called `federated_demo_mapping.json`:
```
[
  {
    "local": [
      {
        "user": {
          "name": "{0}"
        }
      },
      {
        "group": {
          "domain": {
            "name": "Default"
          },
          "name": "demo_member_group"
        }
      }
    ],
    "remote": [
      {
        "type": "openstack_user"
      },
      {
        "type": "openstack_project",
        "any_one_of": [
          "demo"
        ]
      },
      {
        "type": "openstack_roles",
        "any_one_of": [
          "_member_"
        ]
      }
    ]
  }
]
```

Next, set the mapping by running the following commands as the Service Provider `cloud_admin` user:

```
$ openstack mapping list
$ openstack mapping set mapping-for-k2k-federation --rules federated_demo_mapping.json
$ openstack mapping show mapping-for-k2k-federation --format json
```

After performing these steps, you have now mapped rules for federated users.

### Trying it out on Horizon

IBM Bluemix Private Cloud customers can use Keystone-to-Keystone Federated Identity to sign into Horizon, the OpenStack dashboard. By signing into the Identity Provider, you’re able to use the services on the Service Provider.

It’s important to make sure there is a user on the Identity Provider for federated login. In the context of our demo project, this is the user with the `_member_` role.

The Identity Provider `cloud_admin` user should run the following commands:

```
$ openstack user create demo_member_user --project demo --password &lt;secure password&gt; --or-show
$ openstack role add _member_ --user demo_member_user --project demo
$ openstack role assignment list --name --user demo_member_user
```

**Users are now able to log into the Horizon dashboard.**

From Horizon, you have easy access to your OpenStack services, managed by the Service Provider's Keystone.


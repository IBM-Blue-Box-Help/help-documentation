---
layout: page
title: Keystone SAML Federation on IBM Bluemix Private Cloud
featured: false
tags: [federation, keystone, saml]
dateAdded: September 26, 2016
author: Elvin Tubillara
editor: ##WHO WHO WHO?
---

* [What is SAML Federation?](#what_is_saml?)
* [Integrating the IDP and Keystone](#integrating_idp_and_keystone)
* [Managing Groups](#managing_groups)
* [Managing Mappings](#managing_mappings)
* [Using Horizon](#using_horizon)
* [Using the CLI](#using_the_CLI)
* [Additional Notes](#additional_notes)

## <a name="what_is_saml"></a>What is SAML Federation
Security Assertion Markup Language (**SAML**) is a protocol that allows
a user to use Single Sign On (**SSO**) with an Identity Provider (**IDP**)
and a Service Provider (**SP**). When a user logs in, they give their
credentials to the IDP. The IDP checks their credentials and a SAML
Assertion with the user's attributes is created. That assertion is then
passed to the SP and the SP verifies that it was sent by the IDP.
Since the SP trusts assertions from the IDP, the user never has
to send their credentials to the SP.

Keystone will act as the SP and will authenticate users by receiving
assertions from an IDP. In this documentation, we will use a fictitious
SAML IDP called `Company XYZ IDP`.

**Please note that any administrative commands on this page requires
the user to have `cloud_admin` access.**

## <a name="integrating_idp_and_keystone"></a>Integrating the IDP and Keystone
A Bluemix Private Cloud operator will need to work with a `Company XYZ IDP` integration
engineer to setup both systems to work together.

A Bluemix Private Cloud operator will need the following:

 * IDP Metadata URL Endpoint (We currently only support retrieving Metadata through an URL and not a file)
 * IDP entity ID from the IDP Metadata
 * User attributes - This is the SAML user attributes that get passed by the IDP. This can be found in the IDP documentation or IDP server side logs.
 * Default/Inital Mapping - The documentation on mappings can be found here: http://docs.openstack.org/developer/keystone/federation/federated_identity.html#mapping-combination

The `Company XYZ IDP` integration engineer may need the following from the Bluemix Private Cloud Operator:

 * Service Provider Metadata URL
 * Service Provider redirect URL  (Also known as the **callback url**, this is a whitelisted value that the IDP will allow the redirect to go to)

The Bluemix Private Cloud operator should work with the integration engineer to create the initial/default mapping. The mapping is how the remote users on the IDP are mapped to local groups on the SP. The rest of this document may help clarify what a mapping is and how it's used. The integration engineer will also need cloud_admin access. This may be the `cloud_admin` user or a user with the role of the same name.

The user attributes should be given with the mapping name. For example the attributes may be given as:

```
attributes:
- name: http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress
  id: email
- name: http://schemas.xmlsoap.org/claims/Group
  id: group
```

The name given is what the name is inside the SAML assertion. The id is what will
be used in the Keystone mappings.

After the Bluemix Private Cloud operator is finished integrating `Company XYZ IDP` with
Keystone, a mapping called `mapping-for-company-xyz-idp` should be
created (or a similar mapping name with the IDP name in it).

The steps for managing the mapping is:

**1. Manage groups (Federated users will the same access rights as the group**
**2. Manage the mappings**

## <a name="managing_groups"></a>Managing Groups

Keystone Federation works by federating Identity Provider users to a group on the Service Provider. The group is granted access by assigning that group a role on a project. The available roles are as follows:

 * `project_admin` - The `admin` role for the project.
 * `cloud_admin` - The `admin` role for the cloud instance.
 * `_member_` - A member of a project.
 * `heat_stack_owner` - An owner for heat stacks.

**To list groups**:

```
$ openstack group list
```

**To create a group**:

```
$ openstack group create --help
$ openstack group create <new group name here>
```

**To list roles**:

```
$ openstack role list
```

**To list role assignments**:

```
$ openstack role assignment list --name
```

**To list projects**:

```
$ openstack project list
```

**For help looking at adding role assignment**:

```
$ openstack role add --help
```

**To add a role assignment for a group to have a role on a project**:

```
$ openstack role  add <role> --project <project> --group <group>
```

Federated users are mapped into groups on the Service Provider.

Here's the order of operations for granting access for groups:

**1. First, create or edit the group.**
**2. Then, create or edit the role assignments for groups on projects.**

**Example 1.** Creating a `company_xyz_admin_group` group.

```
$ source cloud_adminrc # Your openstack credentials file
$ openstack group list
$ openstack group create company_xyz_admin_group --or-show
$ openstack role assignment list --name --group company_xyz_admin_group
```

Next, create the role assignment if it doesn't exist.
**These commands add the role `cloud_admin` for the group `cloud_admin` for the "demo" project.**

```
$ openstack role add cloud_admin --group company_xyz_admin_group --project demo
$ openstack role assignment list --name --group company_xyz_admin_group
```
After executing the `openstack role assignment list` command you should see an output similar to this one:

```
+-------------+------+---------------------------------+--------------+--------+-----------+
| Role        | User | Group                           | Project      | Domain | Inherited |
+-------------+------+---------------------------------+--------------+--------+-----------+
| cloud_admin |      | company_xyz_admin_group@Default | demo@Default |        | False     |
+-------------+------+---------------------------------+--------------+--------+-----------+
```

**Example 2.** Creating a group with member access.

```
$ source cloud_adminrc #Your openstack credentials file
$ openstack group list
$ openstack group create company_xyz_member_group --or-show
$ openstack role assignment list --name --group company_xyz_member_group
$ openstack role add _member_ --group company_xyz_member_group --project demo
$ openstack role assignment list --name --group company_xyz_member_group
```

After entering the `openstack role assignment list` command you should see an output similar to this one:

```
+----------+------+----------------------------------+--------------+--------+-----------+
| Role     | User | Group                            | Project      | Domain | Inherited |
+----------+------+----------------------------------+--------------+--------+-----------+
| _member_ |      | company_xyz_member_group@Default | demo@Default |        | False     |
+----------+------+----------------------------------+--------------+--------+-----------+
```

## <a name="managing_mappings"></a>Managing Mappings

Below we are using the `Company XYZ IDP` and a mapping for it already exists.
A user with `cloud_admin` access (user or role) will be able to edit
the mapping. The user will not be able to create or delete mappings.

**Mappings can be managed on Horizon in the Identity Dashboard -> Federation -> Mappings -> Edit**

The `openstack mapping list` command shows a list of mappings. It should show the `mapping-for-company-xyz-idp` mapping.

The `openstack mapping show mapping-for-company-xyz-idp -f json` command shows the details of the given mapping. It should contain a `json` listing of the rules for the mapping.

The `openstack mapping set mapping-for-company-xyz-idp --rules newmappings.json` command updates and sets the mapping.

The mappings file should follow the format given here:

```
[
   {
      "local": [
        <group>
      ],
      "remote": [
        <condition>
      ]
   }
]
```

The **rules file** should contain a list of rules that map the remote users to a local group.
The local section contains a rule specifying the group that the remote users should map to. **The local group is required.**

```
{
  "group": {
    "domain": {
      "name": "Default"
    },
    "name": "company_xyz_admin_group"
  }
}
```

The remote section includes rules that specify which remote users should be allowed access.

```
{
    "type": "group",
    "any_one_of": [
        "admin_group"]
}
```

The possible user attributes types that can be given in the remote rules are these:

The possible actions to filter on remote attributes are:

```
empty
any_ony_of
not_any_of
blacklist
whitelist
```

To set the username we can use **{0}** in the local section to indicate to use a field from the remote section. Then we can additional information to the new federated username. We can reference the remote section in the local section by index ("{i}", where i is the index of the remote field):

```
[
  {
    "local": [
      {
        "user": {
          "name": "CompanyXYZ/{0}"
        }
      },
               ...
    ],
    "remote": [
      {
        "type": "email"
      },
               ...
    ]
  }
]
```



Here are some example scenarios:

**Example 1.**
Here we are mapping users from the CompanyXYZ IDP and allowing any user
from the `admin_group`. The user's email address will be used to create
a user on Keystone. If the user's email is `test@test.ibmcloud.com`, then
the resulting username would be `CompanyXYZ/test@test.ibmcloud.com`.

```
[
  {
    "local": [
      {
        "user": {
          "name": "CompanyXYZ/{0}"
        }
      },
      {
        "group": {
          "domain": {
            "name": "Default"
          },
          "name": "company_xyz_admin_group"
        }
      }
    ],
    "remote": [
      {
        "type": "email"
      },
      {
        "type": "group",
        "any_one_of": [
          "admin_group"
        ]
      }
    ]
  }
]
```

**Example 2.** Multiple Groups

In the following example we are using 

```
[
  {
    "local": [
      {
        "user": {
          "name": "CompanyXYZ/{0}"
        }
      },
      {
        "group": {
          "domain": {
            "name": "Default"
          },
          "name": "company_xyz_admin_group"
        }
      }
    ],
    "remote": [
      {
        "type": "email"
      },
      {
        "type": "group",
        "any_one_of": [
          "admin_group"
        ]
      }
    ]
  },
 {
    "local": [
      {
        "user": {
          "name": "CompanyXYZ/{0}"
        }
      },
      {
        "group": {
          "domain": {
            "name": "Default"
          },
          "name": "company_xyz_member_group"
        }
      }
    ],
    "remote": [
      {
        "type": "email"
      },
      {
        "type": "group",
        "any_one_of": [
          "member_group"
        ]
      }
    ]
  }
]
```

## <a name="using_horizon"></a>Using Horizon
The OpenStack dashboard on the Identity Provider should have a drop-down menu labeled **Authenticate with SSO**.

 * The dropdown should show a label for `Company XYZ IDP`. Select the IDP and click Connect.
 * You will then be redirected to the IDP log in page.
 * After successfully authenticating with the IDP, you should then redirected to the horizon page.

## <a name="using_the_CLI"></a>Using the CLI

**Note: The Command Line Interface (CLI) client can only work with IDPs that satisfy these conditions:**
  **1. The IDP supports the SAML ECP protocol**
  **2. The IDP supports basic authentication on a GET**

The CLI offers two types of plugins:
  **1. v3unscopedsaml (Grab an unscoped token)**
  **2. v3scopedsaml (Use a token to perform scoped actions)**

**1. Unscoped Example:**

Let's create a file that we can source in our environment to use SAML:

```
# This file is called companyxyz_saml_rc
export OS_IDENTITY_API_VERSION=3
export OS_PASSWORD=CompanyXYZPassword #replace this
export OS_AUTH_URL=https://<BB CLOUD FQDN>:5000/v3 #replace this
export OS_USERNAME=CompanyXYZUser #replace this
export OS_IDENTITY_PROVIDER=company-xyz-idp #replace this
export OS_PROTOCOL=saml2
export OS_AUTH_TYPE=v3unscopedsaml
export OS_IDENTITY_PROVIDER_URL=https://CompanyXYZ.example/idp/profile/SAML2/SOAP/ECP #replace this
```

After creating the file and editing the options we can run the following command to get an unscoped token and record the ID:

```
$ source companyxyz_saml_rc
$ openstack token issue
```

**2. Scoped Example:**

Now that we a have an unscoped token, we can scope to a project and list the servers on that project

```
openstack server list --os-auth-type v3scopedsaml --os-token <os-token-id> --os-project-id <project-id>
```

## <a name="saml"></a>Using the Python API Libraries

**Note: The Python API Libraries can only work with IDPs that satisfy these conditions:**
   **1. The IDP supports the SAML ECP protocol**
   **2. The IDP supports basic authentication on a GET**

The following code uses the SAML auth plugin to authenticate with the IDP,
send the SAML assertion to Keystone and retrieve an unscoped token.
The unscoped token is then used to get a project scoped token. Then the script
will list servers on that project.

This file is saml_list_servers.py:

{% highlight bash %}
#!/usr/bin/python

from keystoneauth1 import session
from keystoneauth1.identity.v3 import Token
from keystoneauth1.extras._saml2.v3.saml2 import Password as SAMLPassword
from keystoneclient.v3.client import Client

from novaclient import client
import os


# we get these variables from sourcing a file
OS_AUTH_URL = os.environ.get('OS_AUTH_URL')
OS_USERNAME = os.environ.get('OS_USERNAME')
OS_PASSWORD = os.environ.get('OS_PASSWORD')
OS_PROJECT_NAME = os.environ.get('OS_PROJECT_NAME')
OS_IDENTITY_PROVIDER = os.environ.get('OS_IDENTITY_PROVIDER')
OS_IDENTITY_PROVIDER_URL = os.environ.get('OS_IDENTITY_PROVIDER_URL')
OS_PROTOCOL = os.environ.get('OS_PROTOCOL', 'saml2')


def get_project_and_federated_session():
    # authenticate to the idp
    saml_auth = SAMLPassword(auth_url=OS_AUTH_URL,
                             identity_provider=OS_IDENTITY_PROVIDER,
                             identity_provider_url=OS_IDENTITY_PROVIDER_URL,
                             username=OS_USERNAME,
                             password=OS_PASSWORD,
                             protocol=OS_PROTOCOL)

    # get first available project and scoped auth
    sess = session.Session()
    unscoped_access_info = saml_auth.get_access(sess)
    unscoped_client = Client(session=sess, auth=saml_auth)

    # Get project with the given name
    target_project = None
    projects = unscoped_client.federation.projects.list()
    for project in projects:
        if project.name == OS_PROJECT_NAME:
            target_project = project

    if not target_project:
        raise SystemExit("Project %s was not found" % OS_PROJECT_NAME)

    # Create a session with a scoped token for the project
    unscoped_token = unscoped_access_info.auth_token
    scoped_token = Token(auth_url=saml_auth.auth_url,
                         token=unscoped_token,
                         project_id=target_project.id,
                         reauthenticate=False)
    federated_session = session.Session(auth=scoped_token)
    return target_project, federated_session


def main():
    project, scoped_session = get_project_and_federated_session()
    nova = client.Client(version=2, session=scoped_session)
    print "The servers running on project %s are: " % project.name
    for server in nova.servers.list():
        print server.name

if __name__ == '__main__':
    main()

{% endhighlight%}

We will need to source a file before running the script:

```
# This file is called companyxyz_saml_python_rc
export OS_AUTH_URL=https://<BB CLOUD FQDN>:5000/v3 #replace this
export OS_USERNAME=CompanyXYZUser #replace this
export OS_PASSWORD=CompanyXYZPassword #replace this
export OS_PROJECT_NAME=demo
export OS_IDENTITY_PROVIDER=company-xyz-idp #replace this
export OS_IDENTITY_PROVIDER_URL=https://CompanyXYZ.example/idp/profile/SAML2/SOAP/ECP #replace this
export OS_PROTOCOL=saml2
```

Then we can run the python script:
```
source companyxyz_saml_python_rc
python saml_list_servers.py
```

## <a name="additional_notes"></a>Additional Notes

Currently an issue exists with federated users and with the trustor/trustee feature in Keystone, which prevents
the federated Heat user from delegating their `heat_stack_owner` role.

You'll need to use a workaround for the trust delegation by assigning the `heat_stack_owner` role to the user directly. This is the user that is
created during federated log in. The user's domain is federated, and it could have the value of **None** (`Federation=None`).

```
$ openstack user list
```
The federated user should have a domain of None: `openstack user show <federated user>`

Here we require the user ID:

```
$ openstack role add heat_stack_owner --user <federated user ID> --project <project>
```

Another known issue is that a federated user is presented with the option to change
their password in the settings page. They will not be able to change their password.

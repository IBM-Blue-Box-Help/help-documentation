---
layout: page
title: OpenID Connect Federation on IBM Bluemix Private Cloud
featured: false
tags: [federation, keystone, oidc]
dateAdded: September 22nd, 2016
author: Nithya Renganathan
---

* [What is Keystone Federation?](#what_is_keystone_federation?)
* [What is OpenID Connect (OIDC)?](#what_is_openid-connect-oidc?)
* [How does OpenID Protocol work?](#how_does_oidc_work?)
* [Setting up OIDC](#setting_up_oidc)
* [Managing Groups](#managing_groups)
* [Managing Mappings](#managing_mappings)
* [Using Horizon](#using_horizon)
* [Using OAuth API](#using_oauth_api)
* [Using OAuth CLI](#using_oauth_cli)
* [Upgrading python-openstackclient package](#upgrade_package)
* [Additional Notes](#additional_notes)


## <a name="what_is_keystone_federation?"></a>What is Federation?
Keystone federation enables identities from an Identity Provider (IDP) to be used on a Service Provider (SP). The different protocols and formats supported are OpenIDConnect (OIDC) and Security Assertion Markup Language (SAML).

The IDP stores and manages the user's credentials and sends claims or assertions to the SP. This allows the customer to use their enterprise credentials to authenticate to a Bluemix Private Cloud without sending their password to their Bluemix Private Cloud. Keystone is usually always the SP since it consumes identities from external resources.


## <a name="what_is_openid-connect-oidc?">What is OpenID Connect (OIDC)?
`OpenID` is a protocol for authentication.
`OAuth` is a protocol for authorization.
`OpenID Connect` does both.

OpenID Connect is a simple identity layer on top of the OAuth 2.0 protocol. It lets Clients verify the identity of an End-User, based on the authentication performed by an Authorization Server. It also lets Clients obtain basic profile information about the End-User, in an interoperable and REST-like manner.

This document describes a mechanism for an OpenID Connect *relying party* to discover the End-User's OpenID Provider, and to obtain information needed to interact with it, including its OAuth 2.0 endpoint locations.

## <a name="how_does_oidc_work?"></a>How does OpenID Protocol work?
1. The relying party sends the request to the OpenID provider to authenticate the End-User.
2. The OpenID provider authenticates the user.
3. The OpenID provider sends the ID token and access token to the relying party.
4. The relying party sends a request to the user info endpoint with the access token received from OpenID provider.
5. The user info endpoint returns the claims.

## <a name="setting_up_oidc"></a>Setting up OIDC
A Blue Box operator will need to work with an IDP integration engineer from the customer's company (for example purposes, `Company XYZ`) to set up OIDC.

The Bluemix Private Cloud operator will need the following information:

* Authorized Redirect/Callback URL
* Client ID and Client Secret
* User Claim - OIDC Claim
* The *well-known/configuration URL* which provides all the information needed for access to the provider
* Default/initial Mapping - The documentation on mappings can be found here: http://docs.openstack.org/developer/keystone/federation/federated_identity.html#mapping-combination

The Bluemix Private Cloud operator should work with the integration engineer to create the initial/default mapping. The mapping provides the way in which the remote users on the IDP are mapped to local groups on the SP. The rest of this document may help clarify what a mapping is and how it's used.

After the Bluemix Private Cloud operator is finished integrating `Company XYZ IDP` with Keystone, a mapping called `mapping-for-company-xyz-idp` should be created (or a similar mapping name with the IDP name in it).

The steps for managing the mapping is:

**1. Manage groups (Federated users will have the same access rights as the group)**

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

Federated users are mapped into groups on the Service Provider. Here's the order of operations for granting access for groups:

1. First, create or edit the group.

2. Then, create or edit the role assignments for groups on projects.

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
After executing the `openstack role assignment list` command, you should see an output similar to this one:

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

Below, we are using the example of `Company XYZ IDP` and supposing that a mapping for it already exists. A user with `cloud_admin` access (user or role) will be able to edit the mapping. The user will not be able to create or delete mappings.

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

The **rules file** should contain a list of rules that map the remote users to a local group. The local section contains a rule specifying the group that the remote users should map to. **The local group is required.**

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

To set the username we can use **{0}** in the local section to indicate to use a field from the remote section. Then we can additional information to the new Federated username. We can reference the remote section in the local section by index ("{i}", where i is the index of the remote field):

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
        "type": "HTTP_OIDC_CLAIM_EMAIL"
      },
               ...
    ]
  }
]
```



### The section that follows contains some example scenarios:

**Example 1. Using an email address to create a username on Keystone**
In this example, we are mapping users from the Company XYZ IDP and allowing any user from the `admin_group`. The user's email address will be used to create a user on Keystone. If the user's email is `test@test.ibmcloud.com`, then the resulting username would be `CompanyXYZ/test@test.ibmcloud.com`.

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
        "type": "HTTP_OIDC_CLAIM_EMAIL"
      },
      {
        "type": "HTTP_OIDC_CLAIM_GROUP",
        "any_one_of": [
          "admin_group"
        ]
      }
    ]
  }
]
```

**Example 2. Multiple Groups**

In the following example we are using multiple groups.

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
        "type": "HTTP_OIDC_CLAIM_EMAIL"
      },
      {
        "type": "HTTP_OIDC_CLAIM_GROUP",
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
        "type": "HTTP_OIDC_CLAIM_EMAIL"
      },
      {
        "type": "HTTP_OIDC_CLAIM_GROUP",
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

1. The dropdown menu should show a label for the IdP. Select the IDP and click **Connect**.

2. You will then be redirected to the IDP log in page.

3. After successfully authenticating with the IDP, you should be redirected to the Horizon page.

## <a name="using_oauth_api"></a>Using OAuth API

User credentials are never sent to Keystone directly, but they are sent to the OAuth provider endpoints.

Steps to run the following code:

1. Install Pre-Requisites: `request-oauthlib`, Keystone client, and Nova client

2. Source *OIDC stackrc file*

3. python *filename*

**Example 3. OIDC stackrc**

```
export OS_AUTH_URL=https://<fqdn>:5000/v3
export OS_IDENTITY_PROVIDER=<identity_provider name>
export OS_PROTOCOL=<protocol_name>
export OS_REDIRECT_URI=https://<fqdn>:5000/v3/auth/OS-FEDERATION/websso/oidc/redirect
export OS_CLIENT_ID=<client_ID>
export OS_CLIENT_SECRET=<client_secret>
export OS_DISCOVERY_ENDPOINT=https://<FQDN-OP>/.well-known/openid-configuration
export OS_TOKEN_ENDPOINT=https://<FQDN-OP>/oauth/token
export OS_AUTHORIZATION_ENDPOINT=https://<FQDN-OP>/authorize
export OS_PROJECT_ID=<project_id>
```

#### Example 4. Using API for authorization code flow

This file is `oidc-authflow.py`

```
from keystoneauth1.identity.v3 import oidc
from keystoneauth1 import session
from requests_oauthlib import OAuth2Session
from keystoneauth1.identity.v3 import Token
from novaclient import client
import os

def main():

    auth_url = os.environ.get('OS_AUTH_URL')
    identity_provider = os.environ.get('OS_IDENTITY_PROVIDER')
    protocol = 'oidc'
    redirect_uri = os.environ.get('OS_REDIRECT_URI')
    scope = ['openid','profile','email']
    client_id = os.environ.get('OS_CLIENT_ID')
    client_secret = os.environ.get('OS_CLIENT_SECRET')
    discovery_endpoint = os.environ.get('OS_DISCOVERY_ENDPOINT')
    access_token_endpoint = os.environ.get('OS_TOKEN_ENDPOINT')
    authorization_endpoint = os.environ.get('OS_AUTHORIZATION_ENDPOINT')
    project_id = os.environ.get('OS_PROJECT_ID')

    oauth = OAuth2Session(client_id, redirect_uri=redirect_uri, scope=scope)
    authorization_url, state = oauth.authorization_url(authorization_endpoint,
                                                       access_type='offline',
                                                       approval_prompt='force')
    print( 'Please go to %s and authorize access' % authorization_url)
    authorization_code = raw_input('Enter the authorization code here: ')

    s = session.Session(verify=False)

    oidc_plugin = oidc.OidcAuthorizationCode(auth_url, identity_provider,
                                             protocol, client_id=client_id,
                                             client_secret=client_secret,
                                             access_token_endpoint=access_token_endpoint,
                                             discovery_endpoint=discovery_endpoint,
                                             access_token_type='access_token',
                                             redirect_uri=redirect_uri,
                                             code=authorization_code)

    unscoped_auth_token = oidc_plugin.get_unscoped_auth_ref(s)
    scoped_token = Token(auth_url=auth_url,
                         token=unscoped_auth_token._auth_token,
                         project_id=project-id,
                         reauthenticate=False)
    federated_session = session.Session(auth=scoped_token)
    nova = client.Client(version=2, session=federated_session)
    for server in nova.servers.list():
        print server.name

if __name__ == '__main__':
    main()
```



#### Using API for password flow

This file is `oidc-passflow.py`

```
from keystoneauth1 import session
from keystoneauth1.identity.v3 import oidc
from keystoneauth1.identity.v3 import Token
from keystoneclient.v3.client import Client

from novaclient import client
import os


auth_url = os.environ.get('OS_AUTH_URL')
identity_provider = os.environ.get('OS_IDENTITY_PROVIDER')
protocol = 'oidc'
redirect_uri = os.environ.get('OS_REDIRECT_URI')
scope = ['openid','profile','email']
client_id = os.environ.get('OS_CLIENT_ID')
client_secret = os.environ.get('OS_CLIENT_SECRET')
discovery_endpoint = os.environ.get('OS_DISCOVERY_ENDPOINT')
access_token_endpoint = os.environ.get('OS_TOKEN_ENDPOINT')
authorization_endpoint = os.environ.get('OS_AUTHORIZATION_ENDPOINT')
project_id = os.environ.get('OS_PROJECT_ID')

def get_project_and_federated_session():
    s = session.Session(verify=False)

    # get an access token
    payload = {'client_id': client_id, 'grant_type': 'password',
                'username': '<username>',
                'password': '<password>', 'scope': 'openid',
                'connection':'Username-Password-Authentication'}

    response = s.post('https://<FQDN-OP>/oauth/ro',
                            data=payload,
                            authenticated=False)
    print(response.json())
    access_token = response.json()['access_token']

    oidc_plugin = oidc.OidcAccessToken(auth_url, identity_provider, protocol, access_token)
    response = oidc_plugin.get_unscoped_auth_ref(s)
    scoped_token = Token(auth_url=auth_url,
                         token=response._auth_token,
                         project_id=project_id,
                         reauthenticate=False)
    federated_session = session.Session(auth=scoped_token)
    return  federated_session


def main():
    scoped_session = get_project_and_federated_session()
    nova = client.Client(version=2, session=scoped_session)
    for server in nova.servers.list():
        print server.name

if __name__ == '__main__':
    main()
```


## <a name="using_oauth_cli"></a>Using OAuth CLI


#### Authorization code flow for Command line

Required: version of python-openstackclient > 3.0.0
          Check the version by running the following command :
          ```  
          pip freeze | grep openstackclient
          ```  
            

Steps to use the OpenStack client with authorization code:

1. Create a file called `oidcrc`

2. Paste the following contents into the file. Update the parameters based on your environment.

    **OIDC stackrc**

    ```
    export OS_TOKEN_ENDPOINT=https://<replace>/oauth/token
    export OS_CLIENT_SECRET=<client secret>
    export OS_CLIENT_ID=<client_id>
    export OS_DISCOVERY_ENDPOINT=https://<replace>/.well-known/openid-configuration
    export OS_IDENTITY_PROVIDER=auth0
    export OS_REDIRECT_URI=<redirect_uri>
    export OS_IDENTITY_API_VERSION=3
    export OS_DOMAIN=Default
    export OS_PROTOCOL=oidc
    export OS_AUTH_URL=https://<FQDN>:5000/v3
    export OS_USERNAME=<username>
    export OS_AUTHORIZATION_ENDPOINT=https://<replace>/authorize
    ```
3. Get an authorization code from your Identity Manager.

4. The following command fetches a Keystone token that you can use to perform any command till it expires:

```
    openstack --os-auth-type v3oidcauthcode --os-code <auth-code> --os-project-name <project-name> --os-project-domain-name Default token issue
```


Example:

```
root@allinone-multiple:~# openstack --os-auth-type v3oidcauthcode --os-code 6LxfzO7GvCjmmcRa --os-project-name admin --os-project-domain-name Default token issue

```



```
      +------------+----------------------------------+
      | Field      | Value                            |
      +------------+----------------------------------+
      | expires    | 2017-01-18 17:02:32.432419+00:00 |
      | id         | 7c43310f774f4401b5ec6abee8aa3d77 |
      | project_id | 2abdd5e144ad490294f20f9efb9968e7 |
      | user_id    | 6f81cf8c63fc49d1a12f8fd4f75cab82 |
      +------------+----------------------------------+
```

Perform `user list` command using the token just generated.

```
openstack --os-auth-type v3token --os-token <token id from previous request> --os-project-name <project-name> --os-project-domain-name Default user list
```


**NOTE:**
Client ID and Secret can be passed as parameters in the OpenStack CLI instead of saving it in the `rc` file by using the parameters --os-client-secret and --os-client-id

## <a name="upgrade_package"></a>Upgrading python-openstackclient version
Run the following commands:

```
  sudo su
  pip install python-openstackclient --upgrade
```

## <a name="additional_notes"></a>Additional Notes

Currently an issue exists with federated users and with the trustor/trustee feature in Keystone, which prevents
the federated Heat user from delegating their `heat_stack_owner` role.

You'll need to use a workaround for the trust delegation by assigning the `heat_stack_owner` role to the user directly. This is the user that is created during federated log in. The user's domain is federated, and it could have the value of **None** (`Federation=None`).

```
$ openstack user list
```
The federated user should have a domain of None: `openstack user show *federated user*`

Here we require the user ID:

```
$ openstack role add heat_stack_owner --user *federated user ID* --project *project*
```

Another known issue is that a federated user is presented with the option to change their password in the settings page. They will not be able to change their password.

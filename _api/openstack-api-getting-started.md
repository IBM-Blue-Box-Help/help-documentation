---
layout: page
title:  "Getting Started with the OpenStack API"
featured: true
tags: [api, getting started, openstack]
author: Eric French
dateAdded: November 16th, 2015
---

Your **IBM Bluemix Private** Cloud was provisioned with API endpoints for all of the major OpenStack services running underneath.  Here is how to set up your system to access these services:

**On macOS:**

**Install Python**

**Note:** macOS El Capitan introduced a mechanisms to prevent damaging the operating system files. `/System/Library/Frameworks/Python.framework/Versions/2.7/share` is one of the protected locations. A normal user has no reason to put or write any files there. Therefore, we do not recommend the use of `sudo pip` to install Python.

Instead, install a Python package, such as IPython, locally to the home folder of your user. The easiest way is to create a virtual environment, activate it and then run `pip` in the virtual environment.

Example:

{% highlight bash %}
cd ~ # Go to home directory
virtualenv my-venv
source my-venv/bin/activate
pip install IPython
pip install python-novaclient
{% endhighlight %}

**Set up your local `stackrc` file**

A `stackrc` file defines the environment variables that will let your **Nova** client connect to the **Nova API**:

{% highlight bash %}
# ~/stackrc
export OS_IDENTITY_API_VERSION=3
export OS_PASSWORD=yoursecretpassword
export OS_AUTH_URL=https://example.openstack.blueboxgrid.com:5000/v3
export OS_USERNAME=yourname
export OS_PROJECT_NAME=projectname
export OS_TENANT_NAME=tenantname
export OS_USER_DOMAIN_NAME=domainname
export OS_PROJECT_DOMAIN_NAME=projectdomainname
export OS_CACERT=yourpathtocertificate
export OS_COMPUTE_API_VERSION=2.1
export OS_NO_CACHE=True
{% endhighlight %}

Create a `stackrc` for yourself, replacing the `OS_USERNAME`, `OS_PROJECT_NAME`, `OS_TENANT_NAME`, `OS_USER_DOMAIN_NAME`, `OS_PROJECT_DOMAIN_NAME`,`OS_CACERT` and `OS_PASSWORD` fields with your own.

**Note**: If you are concerned about storing your password in this file, leave the password field blank; you will be asked to enter a password after sourcing the `stackrc` file.

It is also possible to download an **OpenStack RC File** from **Horizon**. Log in to **Horizon**, navigate to the **Access & Security** page and select the **API Access** tab.  

![API Access Tab]({{site.baseurl}}/img/OpenStack_Access_Security.png)

Click the **Download OpenStack RC File** button and modify it as desired.

**Source the `stackrc` file**

{% highlight bash %}
source ~/tardis_stackrc
{% endhighlight %}

**Test the Nova client**

{% highlight bash %}
nova image-list
{% endhighlight %}

This command will return a list of images in your project that you can boot an instance (virtual machine) from.

### How to query the OpenStack API using cURL

**Q.** How can I get an OpenStack token via the v3 API?

**A.** You can use the cURL command:
{% highlight bash %} 
curl -si -X POST https://example.openstack.blueboxgrid.com:5000/v3/auth/tokens \
-H "Content-Type: application/json" \
-d '{ "auth": { "identity": { "methods": [ "password" ], \
"password": { "user": { "name": "'"$OS_USERNAME"'", "domain": { "id": "default" },\
"password": "'"$OS_PASSWORD"'" } } } } }' | awk '/X-Subject-Token/ {print $2}'

381d756c8bfa4a8cb4dff4fe44255991

{% endhighlight%}

**For more information:**

An API guide linked [here](http://developer.openstack.org/api-guide/quick-start/api-quick-start.html) includes examples of using cURL to get a list of servers.

Each service has its own port for API access. If you log in to the web GUI and go to the **Access & Security => API Access** tab, you can see which port corresponds to which service.

To query any of the other API services (Nova, Neutron, Cinder, etc) you must first get a token from the authentication service (Keystone). You can reuse that token to make as many API calls as you require until it expires.

For example, 9696 is Neutron, but to get a token (the command you're trying to run) requires a Keystone authentication request, which needs to be on port 5000.

So here are some steps:

1. Fetch a token from `$OS_AUTH_URL/tokens` with an HTTP POST (not a GET, because you need to POST your `$OS_USERNAME` and `$OS_PASSWORD, $OS_TENANT_NAME` to be able to retrieve a token). The response will include a token, and a catalog of the different services.

2. Retrieve that token and check that the token expiry date is in the future.

3. Retrieve from the returned catalog the URL of the service you want to make an API call against. In your case you will be looking for the entry in the catalog with the type `network`. It should have a name of `neutron`.

4. Include that token as an `X-Auth-Token` header when you make a different HTTP GET to that URL. You can run `neutron --debug security-group-list` to see what that POST should look like, it should be something like this: 

```
curl -g -i --cacert "/etc/ssl/certs/ca-certificates.crt" \
-X GET https://example.openstack.blueboxgrid.com:9696/v2.0/security-groups.json \
-H "User-Agent: python-neutronclient" \
-H "Accept: application/json" \
-H "X-Auth-Token: {SHA1}11111a1111aaa1a111aaaaaa1111aa1a111a1111"

```

**Further Reading**

[Installing OpenStack Command Line Clients](http://docs.openstack.org/user-guide/content/install_clients.html)

[API Versions Supported](https://www.openstack.org/marketplace/hosted-private-clouds/blue-box/ibm-blue-box---private-cloud-as-a-service)

[What To Do If You Get An ImportError: No module named xmlrpc_client When Running Nova Client on Mac OS X](https://github.com/major/supernova/issues/55#issuecomment-59891149">What To Do If You Get An ImportError: No module named xmlrpc_client When Running Nova Client on Mac OS X)

[Command Line Client Cheat Sheet](http://docs.openstack.org/user-guide/cli_cheat_sheet.html)

**Troubleshooting**

If you get an error **A true SSLContext object is not available**, run
`sudo easy_install requests[security]` or `pip install requests[security]`

If you get an error "No module named six.moves", run `pip install six`.

Also see what to do if you get the error [**AttributeError: '_socketobject' object has no attribute 'set_tlsext_host_name'**](http://stackoverflow.com/questions/31576258/attributeerror-socketobject-object-has-no-attribute-set-tlsext-host-name)

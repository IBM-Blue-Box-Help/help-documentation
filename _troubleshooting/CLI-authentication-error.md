---
layout: page
title:  "When using any of the OpenStack CLIs on Windows, I get authentication failure errors"
tags: [troubleshooting, authentication, windows]
dateAdded: December 9th, 2015
featured: false
weight: 4
---

Check your OpenStack environment variable settings for extraneous quotation marks (") and spaces.

Two common authentication error messages seen while using the OpenStack CLIs are:

{% highlight bash %}
nova image-list
ERROR (CommandError): Invalid OpenStack Nova credentials.
{% endhighlight %}

and

{% highlight bash %}
glance image-list
Authentication failure: The request you have made requires authentication. (HTTP 401)
{% endhighlight %}

These errors result when the tenant/project name, login, password information is not transmitted correctly to the OpenStack API endpoint server.

Typically these values are set in environment variables, so that they don't have to be repeated with every CLI invocation.

The best way to setcup these environment variables is to select **Download the OpenStack RC** file from the **Project -> Compute -> Access & Security -> API Access** tab in the Horizon web portal.

Then in a command shell window simply source this `*-openrc.sh` file to set up the necessary environment variables for the CLI tools.

For Windows-based client environments, you must manually translate the `*-openrc.sh` file into its equivalent `.bat` or `.cmd` file. Two common mistakes made in this translation are:

- Environment variable values have extra quotes in them.
- Environment variable values do not correctly escape embedded 'space' characters in tenant/project names.

See this example below:

**Incorrect .bat file content:**

{% highlight bash %}
set OS_TENANT_NAME="Demo Project"
set OS_USERNAME="rahul"
{% endhighlight %}

**The correct way is:**
{% highlight bash %}
set OS_TENANT_NAME=Demo\ Project
set OS_USERNAME=rahul
{% endhighlight %}

Note how the embedded space in the tenant name is escaped by the 'backslash' and the missing "double quotes" in the variable value. These characters are not needed in Windows.

So make these two changes, run the `.bat` file again, and retry your CLI usage. In most situations, it should work.

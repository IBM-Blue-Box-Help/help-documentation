---
layout: page
title:  "What do I do if the Cinder client returns 'ERROR: Unable to establish connection' message and fails to connect?"
tags: [troubleshooting, cinder, error]
dateAdded: November 12th, 2015
weight: 10
featured: false
---

Versions of `python-cinderclient` from 1.2.0 up and prior to 1.3.0 may give an error and fail when attempting to connect to a Cinder API service that is configured to use the HTTPS protocol.

For example:

{% highlight bash %}
$ cinder list
ERROR: Unable to establish connection to http://<cinderURL>:<cinderPort>/v1/<tenantID>/volumes/detail
{% endhighlight %}

This situation appears to be related to version discovery support that was added in version 1.2.0 and reverted in 1.3.0.
(See the release notes for more details: `http://docs.openstack.org/developer/python-cinderclient/`).

If you experience this issue, upgrade the `python-cinderclient` package to 1.3.0 or later by running

`pip install -U python-cinderclient`

or by upgrading the package that provides the client if using an OpenStack distribution.

For example:

`yum update python-cinderclient`

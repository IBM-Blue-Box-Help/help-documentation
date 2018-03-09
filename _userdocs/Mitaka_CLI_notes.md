---
layout: page
title:  "OpenStack Mitaka CLI Notes"
featured: true
weight: 2
tags: [OpenStack, mitaka, keystone]
author: Leslie Lundquist
dateAdded: September 7th, 2016
---

#### OpenStack command line interface: a few notes about helpful commands now (or still) available

Try these:

```
$ openstack catalog list

$ openstack server list  --all-projects     #just one example you might find handy

$ openstack help       #to get a list of all available commands and options
```

Also, these client commands still are available:

```
$ neutron net-list

$ cinder list

$ glance image -list
```

However, this client is no longer available due to Keystone v3 issue:

```
$ keystone net -list  #not working
```

Use the OpenStack client instead.

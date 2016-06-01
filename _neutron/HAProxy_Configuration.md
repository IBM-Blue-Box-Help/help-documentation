---
layout: page
title:  "HAProxy Configuration for Large Number of Networks"
featured: true
weight: 2
tags: [neutron, haproxy, configuration]
author: Peter Xiang Wang, Sangeetha Srikanth
dateAdded: June 1st, 2016
editor: Leslie Lundquist
---

## HAProxy Configuration for Large Number of Networks

When you connect to a large number of Neutron networks, the default HAProxy buffer size will not be large enough for the Neutron CLI to list such a large number. You will see the following error message:

```
root@100-node-controller1:~# neutron net-list

400 Bad request

Your browser sent an invalid request.
```

### Solution:
The HAProxy buffer size, called `tune.bufsize` is configured in `/etc/haproxy/haproxy.cfg`, which is configured by `ursula/roles/haproxy/defaults/main.yml` during Ursula deployment. To resolve the issue, this value can be doubled by overwriting it in your `all.yml` file.

Here’s how to edit your `all.yml` file to resolve the issue:

1) In your latest `openstack-envs` file, edit the `group_vars/all.yml` and
add the following section:

```
haproxy:
    bufsize: 16384
```

2) Next, reconverge Ursula with the `haproxy` tag set, using the command below:

```
ursula --ursula-sudo --ursula-user blueboxadmin ../openstack-envs/$ENV site.yml --tags haproxy
```

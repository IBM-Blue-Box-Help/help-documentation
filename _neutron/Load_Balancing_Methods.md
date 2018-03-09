---
layout: page
title: Load Balancing Methods
tags: [neutron, source_ip, session persistence, http_cookie, app_cookie]
dateAdded: October 3, 2016
author: Leslie Lundquist
weight: 4
featured: FALSE
---

This document gives a brief explanation of the different load balancing methods. The SOURCE_IP load balancing method determines which server gets the traffic of a _new_ session. The SOURCE_IP session persistence option determines the destination for an _existing_ session, based solely on the source IP rather than based on a cookie.

**Types of algorithms:**

*ROUND_ROBIN*

 * Each server is used in turn, according to their relative weights.

*SOURCE_IP*

 * The source IP address is hashed and divided by the total weight of the running servers to designate which server will receive the request.

*LEAST_CONNECTIONS*

 * The server with the lowest number of connections receives the connection.

Here's a figure showing the **Create Load Balancer** menu, where you can select an option. In this view, the user is selecting from the SOURCE_IP options.


![Create-Load-Balancer.png]({{site.baseurl}}/img/Create-Load-Balancer.png)

Here is an explanation of the session persistence options:

**Types of session persistence:**

*SOURCE_IP*

 * All connections that originate from the same source IP address are handled by the same member of the pool.

*HTTP_COOKIE*

 * The load-balancing function creates a cookie on the first request from a client. Subsequent requests that contain the same cookie value are handled by the same member of the pool.

*APP_COOKIE*

 * The load-balancing function relies on a cookie established by the back-end application. All requests with the same cookie value are handled by the same member of the pool.

For further information, please see: http://docs.openstack.org/admin-guide/networking-introduction.html#load-balancer-as-a-service-lbaas-overview

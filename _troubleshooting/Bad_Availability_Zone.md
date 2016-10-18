---
layout: page 
title: "Cloud Foundry: Invalid Availability Zone Error" 
featured: false 
weight: 2 
tags: [Openstack, troubleshooting, availability zone, cloud foundry] 
author: Bluemix on OpenStack Support Team
editor: Leslie Lundquist
dateAdded: May 11, 2016 
---

### Invalid Availability Zone Error in OpenStack API (for Bluemix or Cloud Foundry users)

As a Cloud Foundry user, I'm trying to deploy a VM and I am getting an error: OpenStack API Bad Request (`Invalid input received: Availability zone 'compute_enterprise' is invalid`)

This error will go away in the next few months after we upgrade you to OpenStack Mitaka, but until that happens, we recommend updating your microbosh YML file to ignore the volume availability zone, via the `ignore_server_availability_zone` parameter.

Here's a snippet of the `microbosh.yml` section where you'd add the `ignore_server_availability_zone: true` parameter.

``` 
cloud:
  plugin: openstack
  properties:
    openstack:
      auth_url: http://your.openstack.auth.url:5000/v2.0
      username: youropenstackusername
      api_key: youropenstackapikey
      tenant: CloudFoundry01
      default_security_groups: ["default", "default"]
      default_key_name: lv_microbosh
      private_key: /root/.ssh/lv_microbosh.pem
      ignore_server_availability_zone: true
```
 
**What does this parameter do?**
`ignore_server_availability_zone (optional)`
When creating a disk, do not use the availability zone of the server, fall back to OpenStack's default (`nova`). Commonly used if Ceph is used for block storage. Defaults to `false`.
 
**What happens in 3.0+?**
The Cinder `allow_availability_zone_fallback` option becomes available.  
This link has more details:  https://review.openstack.org/#/c/217857/


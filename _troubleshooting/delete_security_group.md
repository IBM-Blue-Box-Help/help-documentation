---
layout: page
title: "Why Can’t I Delete A Security Group?"
tags: [troubleshooting, neutron, security groups]
featured: false
weight: 5
author: Leslie Lundquist
dateAdded: June 24, 2016
---

### Q. Why can't I delete a security group?

Example: I've tried to delete a security group. Here's an (example) error message I received:

```
#TASK [Remove my_security_group from the environment] *********************
#Friday 24 June 2016 10:54:22 -0500 (0:00:00.101) 0:02:50.029 ***********
fatal: [localhost]: FAILED! => {"changed": false, "failed": true, "msg": "Error deleting security group 9ad11034-32a0-4b0b-86b3-49b775fa573b: Security Group 9ad11034-32a0-4b0b-86b3-49b775fa573b in use.\nNeutron server returns request_ids: ['req-3e0a34dc-7a99-497e-8f61-bfc2c8f9fd37']"}
```

**A. Your security group might be in use by a Neutron port.** To delete the security group, you'll first need to delete the port. If the port is in use by, for example, a load balancer, you'll need to delete the load balancer before deleting the security group.

Here's an example of the error message you might receive if you try to delete the port while it is in use by a load balancer:
```
$ neutron port-delete 0c3f5473-2b75-4eb4-9b30-d6652ad0336d
Port 0c3f5473-2b75-4eb4-9b30-d6652ad0336d cannot be deleted directly via
the port API: has device owner neutron:LOADBALANCERV2
```

If you find yourself in this situation, here are some example cleanup commands for your LBaaS (output not shown):

```
#First see if your instance is in the pool and if so, delete
$ neutron lbaas-pool-list | grep True | awk '{print $2}' | xargs -i  
$ neutron lbaas-pool-delete {}
#See if it's on the listener list and delete if so
$ neutron lbaas-listener-list | grep True | awk '{print $2}' | xargs -i 
$ neutron lbaas-listener-delete {} 
#See if it's in the list of active loadbalancers and delete if so
$ neutron lbaas-loadbalancer-list | grep ACTIVE | awk '{print $2}' | xargs -i 
$ neutron lbaas-loadbalancer-delete {} 
```

With the following commands, you can find and delete a port that might be in use. PORT is the ID of the port that is in use by the security group you want to delete.

```
$ neutron port-list
$ neutron port-delete PORT
```



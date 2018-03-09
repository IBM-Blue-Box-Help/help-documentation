---
layout: page

title: Attempt to Create a Router is Failing

tags: [troubleshooting, nova, router, IPs, availability]

dateAdded: October 24, 2016

weight: 3

featured: FALSE

author: Leslie Lundquist
---

**Q.** Why is my attempt to create a router failing? I get this error shown in the UI:
```
Error: Router `test-pavan-router was created but connecting to an external network failed. The created router has been deleted, as the overall operation failed.
```

**A.** Usually, when the error you're getting occurs, it's because you're out of IP addresses on one or more of the networks you're trying to attach the router to. You can check how many IPs are left on the network by running `neutron net-ip-availability-show`, as detailed [in this article](http://ibm-blue-box-help.github.io/help-documentation/neutron/Where_Are_These_IPs/). You may need to delete IPs that are assigned to projects that no longer exist, by using the command:

`nova floating-ip-delete`

If you do have plenty of IPs available, have you tried creating the router via the command line to see if it gives you a more informative error? Especially helpful would be an error message that includes a Request-ID, so the support team can search for that in the logs.

A step-by-step user guide on [how to create a router from the command line](http://docs.openstack.org/user-guide/cli-create-and-manage-networks.html) can be found on the OpenStack website. Hope this helps!

---
layout: page
title:  "How Can I Restrict Floating IPs?"
dateAdded: September 2nd, 2016
author: Bluemix Private Cloud Support
editor: Leslie Lundquist
featured: true
weight: 4
tags: [nova, horizon, allocate, users, floating ip]
---

**Q.** How can I restrict floating IP usage to users in one project?

**A.** As follows:

 * Create a project for privileged users and switch to it. Keep running the command `nova floating-ip-create` until you run out of floating IPs to create.

 * Create a separate project for unprivileged users and switch to it. Create an instance, click **Associate Floating IP**, and then try to allocate a floating IP to it.

 * In Horizon, as an unprivileged user, you will now get "Error: Unable to allocate Floating IP." From the command line, you will get "No more floating IPs available".

 * **Keep in mind:** If you release floating IPs back into the pool by using the command `nova floating-ip-delete` (for example) in the privileged project, that IP will become available to the unprivileged project. So you would need to educate your privileged team to not release IPs.

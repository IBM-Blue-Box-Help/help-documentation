---
layout: page
title:  "Using Heat for provisioning servers with a load balancer"
tags: [heat, load balancer, stack]
dateAdded: May 11th, 2016
featured: false
author: Pan Xia Zou, Ying Tang
weight: 5
---

You can provision instances with a load balancer to provide load balancing for your service. This enables your service, such as a website, to distribute its workloads across multiple cloud instances, and thus it increases efficiency by optimizing your resources to support huge concurrent access. Moreover, the load balancer implements High Availability (HA) to provide better reliability as access requests are redirected to other active instances when the target instance is down.

This topic demonstrates the steps to provision instances with load balancer based on Heat by using a predefined Heat Orchestration Template. The following steps lead you to upload and launch the template in the **Stacks** panel on **Horizon**, which automatically creates two new instances as well as load balancer pools, virtual IP address, and members on the two instances. You can then access the web services on the two instances via virtual IP address.

Download the [Heat Orchestration Template](../Heat_Orchestration_Template_LB.yaml) before you proceed and you can modify the template according to your needs. For more information on how to create and modify templates, see [Heat Orchestration Template (HOT) Guide](http://docs.openstack.org/developer/heat/template_guide/hot_guide.html).

## Creating a stack

Follow these steps to upload and launch a stack using the downloaded template.

1. Log on to Horizon with a user account with the heat_stack_owner role.
2. Click **Project** -> **Orchestration** -> **Stacks** from the navigation panel.
3. Click **Launch Stack**.
4. On the Select Template page, choose **File** as Template Source. Click **Browse** to upload the Heat Orchestration Template, and then click **Next**.
5. Optionally, you can specify the environment source as a file or direct input. For more information about using an environment file, see [Environment](http://docs.openstack.org/developer/heat/template_guide/environment.html). 
6. On the Launch Stack page, input a stack name and a creation timeout period.
7. You can replace the default `image`, `network_server`, `network_subnet_lb_pool`, `flavor`, and availability zone settings in the Heat Orchestration Template by inputting the values in the corresponding fields.
8. Click **Launch**.

## Verifying the stack

Follow these steps to verify the HA feature implemented by load balancers on the VMs created in the previous section.

1. Log on to Horizon with a user account with the heat_stack_owner role.
1. Click **Project** -> **Network** -> **Load Balancers** and find the load balancer that you created in the previous section.
1. Find the IP address of the load balancer.
1. Type the IP address in a web browser to open the webpage.
1. Shut down one instance that is created by Stack.
1. Refresh the browser, and you can see that the web service is still on.

## Removing the stack

Follow these steps to remove the stack.

1. Log on to Horizon with a user account with heat_stack_owner role.
1. Click **Project** -> **Orchestration** -> **Stacks** from the navigation panel.
1. Click the **Delete Stack** link for the stack that you want to remove.
1. Click **Delete Stack** on the pop up window to confirm the action.


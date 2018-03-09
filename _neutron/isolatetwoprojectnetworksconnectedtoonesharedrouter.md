---
layout: page
title:  "How can you isolate project networks connected to a shared router?"
dateAdded: December 30, 2016
author: Ulysses Kanigel
featured: true
weight: 4
tags: [neutron, projects, shared router, isolation, isolate]
---

One of our clients asked how he could isolate project networks connected to a shared router for his own customers.  Here is the solution the client came up with:

* Create one "CUSTOMER-admin" project for each customer.
* Create one router for each of these new customer admin projects.
* Create one network/subnet for each (sub)project, connected to the "admin" router.

![graphic here]({{site.baseurl}}/img/isolateneutronnetworks2.png)

Steps to configure this setup:

{% highlight bash %} 
openstack project create --description Admin_Project_CUSTOMER CUSTOMER-admin
openstack role add --project CUSTOMER-admin --group cloud_admin cloud_admin
openstack quota set --routers 2 --rbac-policies 100 --networks 100 --subnets 100 --subnetpools 2 CUSTOMER-admin
openstack quota set --instances 2 --ram 4096 CUSTOMER-admin
OS_PROJECT_ID=xxx
OS_PROJECT_NAME=CUSTOMER-admin
openstack subnet pool create --default-prefix-length 24 --pool-prefix X.Y.0.0/16 CUSTOMER-subnetpool
openstack router create CUSTOMER-router
neutron router-gateway-set CUSTOMER-router external
neutron router-gateway-set --disable_snat CUSTOMER-router external => *must be done by IBM Staff*
plus: add routing for the subnet pool X.Y.0.0/16 on external firewalls => *must be done by IBM Staff*
{% endhighlight %}

After you've done these steps, new projects can be created in the **customer-admin** project, as follows:

{% highlight bash %} 
openstack project create --description New_Project_${PROJECT} ${PROJECT}
openstack user create --project ${PROJECT} --password ${PROJECT_USER_PASSWD} --description Default_Admin_User_for_${PROJECT} ${PROJECT_USER}
openstack role add --project ${PROJECT} --user ${PROJECT_USER} project_admin
openstack role add --project ${PROJECT} --user ${PROJECT_USER} heat_stack_owner
openstack role add --project ${PROJECT} --group cloud_admin cloud_admin
openstack role add --project ${PROJECT} --group cloud_admin heat_stack_owner
openstack quota set --ram 40960 ${PROJECT}
openstack quota set --routers 0 --networks 0 --subnets 0 --subnetpools 0 ${PROJECT}
openstack network create --enable --internal --no-share ${PROJECT}-net
neutron subnet-create --enable-dhcp --subnetpool ${SUBNETPOOL} --name ${PROJECT}-subnet ${PROJECT}-net
openstack network rbac create --type network --target-project ${PROJECT} --action access_as_shared ${PROJECT}-net
GWIP=`openstack subnet show -c gateway_ip ${PROJECT}-subnet | grep gateway_ip | awk '{ print $4 }'`
openstack port create --disable --fixed-ip subnet=${PROJECT}-subnet,ip-address=${GWIP} --network ${PROJECT}-net ${DEFAULTROUTER}-port-${PROJECT}
openstack port set --enable ${DEFAULTROUTER}-port-${PROJECT}
neutron router-interface-add ${DEFAULTROUTER} port=${DEFAULTROUTER}-port-${PROJECT}
{% endhighlight %}

Also see these articles:

https://ask.openstack.org/en/question/69528/two-tenants-two-networks-one-router/

https://ask.openstack.org/en/question/60769/how-to-isolate-tenant-networks-connected-to-a-shared-router/

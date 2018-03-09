---
layout: page
title:  "How to Create an Instance and Make it Available Publicly Using the Command Line"
dateAdded: June 13th, 2015
featured: true
weight: 4
tags: [nova, command line, instance]
---

The proper way to get external access to an instance through Nova is to boot the instance into the internal network and then attach a floating IP. The external network is present to allow for the creation and deletion of Neutron floating IP's.

The following is the process for getting an instance available publicly:

{% highlight bash %}
$ nova secgroup-create test-ssh "a test security group"
+--------------------------------------+----------+-----------------------+
| Id                                   | Name     | Description           |
+--------------------------------------+----------+-----------------------+
| 73024aa7-2bde-42e9-90d2-41fb67312b10 | test-ssh | a test security group |
+--------------------------------------+----------+-----------------------+

$ nova net-list
+--------------------------------------+----------+------+
| ID | Label | CIDR |
+--------------------------------------+----------+------+
| dcf9f24c-a860-4109-9ece-d78df9091718 | external | None |
| d6292eb1-cde6-4ba3-b1f8-ee00f7f1af94 | internal | None |
+--------------------------------------+----------+------+

$ nova boot --flavor m1.tiny --image cirros --security-group test-ssh --nic net-id=d6292eb1-cde6-4ba3-b1f8-ee00f7f1af94 test-net
$ nova floating-ip-create external
+--------------+-----------+----------+----------+
| Ip           | Server Id | Fixed Ip | Pool     |
+--------------+-----------+----------+----------+
| 169.57.9.221 | -         | -        | external |
+--------------+-----------+----------+----------+

$ nova add-floating-ip test-net 169.57.9.221
$ nova secgroup-add-rule test-ssh tcp 22 22 0.0.0.0/0
+-------------+-----------+---------+-----------+--------------+
| IP Protocol | From Port | To Port | IP Range  | Source Group |
+-------------+-----------+---------+-----------+--------------+
| tcp         | 22        | 22      | 0.0.0.0/0 |              |
{% endhighlight %}

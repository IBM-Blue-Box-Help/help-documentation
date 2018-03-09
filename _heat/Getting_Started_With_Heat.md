---
layout: page
title: "Getting Started With Heat Templates"
author: Sina Sadeghi
dateAdded: September 21, 2016
tags: [heat, orchestration, templates, best practices, multi-cloud, security groups, owner, user]
featured: true
weight: 3
---

As a best practice, we suggest that your team consider using the OpenStack Orchestration service (Heat), which comes enabled with every **IBM Bluemix Private Cloud**. Using Heat, you can define all your resources procedurally in a text file, and run that same file against multiple clouds to achieve the same result (known as a stack). 

You can use Heat to set up a stack that has pretty much any OpenStack resource in it that you wish. 

For example, what if you want to set up several stacks with the same security group definitions? If you look at lines 82-110 of the example script that I give below, you can see how security groups are defined in Heat. This capability doesn't let you "copy" security groups _per se_, but it does let you create an identical stack (containing, for example, security group resources) in as many projects or different clouds as you wish. Since the input text file is the same, the resulting stack and contained resources will be identical. You can even spin up multiple identical stacks under the same project.

Introductory documentation created by OpenStack can be found [here](http://docs.openstack.org/developer/heat/template_guide/hot_guide.html) and [here](http://docs.openstack.org/developer/heat/template_guide/).


I have some personal Heat templates. [This one is a little bit old but it should give you an idea of the sort of things you can do:](https://raw.githubusercontent.com/sinner-/heat-coreos/master/heat-template.yaml)

**Description: HOT file for 3 node CoreOS cluster**

```

parameters:
  flavor:
    type: string
    default: m1.medium
    description: Flavor to use for CoreOS nodes
  image:
    type: string
    default: CoreOS
    description: Base image for CoreOS
  key_name:
    type: string
    default: coreos_key
    description: SSH public key name (change this when deploying multiple clusters)
  key_contents:
    type: string
    default: ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQC/EMiCSewfa6TRHM/XtJDlIlFu4cGmX0YlfGu4Y93obrOXsBFMjePnWiGVivTdJ8QH48PbAhztoAj1MT2vxj2uf/0nu8Zz0bjZh4lJyZ9jZHxnkOQ+JYxJtC+pu9GYANbQ7C3ccxmHur88gJdkZ0/auTW9aghTy+q4sDnK1rQ/Dss3euLw4lqEDfg2Ebau71jHPF1Ta1Fegf5M6PbNDP4sud0Z0xIOK1cP8kLE4uKGoeCcwGwEentJpnHH3yB2NvyY4TXBRj7hkRvSiwWEKl5+F66134Acej9qI/DlpcFi6ZkXXQBCYnLh6swJ39ozX2xFe+R0ZHrnEY/befltK4wJ sina@kumosan
    description: SSH public key contents
  internal_network_name:
    type: string
    description: The name of the internal network
    default: internalnet
  internal_network_cidr:
    type: string
    description: The CIDR of the internal network
    default: 10.210.211.0/24
  internal_gw_name:
    type: string
    description: The name of the internal network router
    default: internalrouter
  internal_dns_primary:
    type: string
    description: Primary DNS for internal network
    default: 8.8.8.8
  internal_dns_secondary:
    type: string
    description: Secondary DNS for internal network
    default: 8.8.4.4
  public_network_uuid:
    type: string
    description: The UUID of the public network
    default: 87cb4819-182e-4f2d-86d2-6970c11962da
  discovery_token_url:
    type: string
    description: Output of curl -q https://discovery.etcd.io/new?size=3

resources:

   internal_net:
    type: OS::Neutron::Net
    properties:
      name: { get_param: internal_network_name }

   internal_subnet:
    type: OS::Neutron::Subnet
    properties:
      network_id: { get_resource: internal_net }
      cidr: { get_param: internal_network_cidr }
      name: { get_param: internal_network_name }
      dns_nameservers: [ { get_param: internal_dns_primary }, { get_param: internal_dns_secondary } ]

   internal_router:
    type: OS::Neutron::Router
    properties:
      name: { get_param: internal_gw_name }

   internal_router_extgw:
    type: OS::Neutron::RouterGateway
    properties:
      network_id: { get_param: public_network_uuid }
      router_id: { get_resource: internal_router }

   internal_router_interface:
    type: OS::Neutron::RouterInterface
    properties:
      router_id: { get_resource: internal_router }
      subnet_id: { get_resource: internal_subnet }

   coreos_secgroup:
    type: OS::Neutron::SecurityGroup
    properties:
      name: coreos
      description: Allows all out and SSH in
      rules: [ {"direction": egress,
                "remote_ip_prefix": 0.0.0.0/0,
                "port_range_min": 1,
                "port_range_max": 65535,
                "ethertype": IPv4,
                "protocol": tcp},
               {"direction": egress,
                "remote_ip_prefix": 0.0.0.0/0,
                "port_range_min": 1,
                "port_range_max": 65535,
                "ethertype": IPv4,
                "protocol": udp},
               {"direction": ingress,
                "remote_ip_prefix": 0.0.0.0/0,
                "port_range_min": 22,
                "port_range_max": 22,
                "ethertype": IPv4,
                "protocol": tcp},
               {"direction": ingress,
                "remote_ip_prefix": { get_param: internal_network_cidr },
                "port_range_min": 1,
                "port_range_max": 65535,
                "ethertype": IPv4,
                "protocol": tcp}]

   coreos_key:
    type: OS::Nova::KeyPair
    properties:
      name: { get_param: key_name }
      public_key: { get_param: key_contents }
      save_private_key: False

   coreos01_internal_port:
    type: OS::Neutron::Port
    properties:
      network_id: { get_resource: internal_net }
      fixed_ips:
        - subnet_id: { get_resource: internal_subnet  }
      security_groups:
        - { get_resource: coreos_secgroup }

   coreos01_floatingip:
    type: OS::Neutron::FloatingIP
    properties:
      floating_network_id: { get_param: public_network_uuid }

   coreos01_floatingip_ass:
    type: OS::Neutron::FloatingIPAssociation
    properties:
      floatingip_id: { get_resource: coreos01_floatingip }
      port_id: { get_resource: coreos01_internal_port }
    depends_on:
      - internal_router_interface
      - internal_router_extgw
      - coreos01_internal_port

   coreos01:
    type: OS::Nova::Server
    depends_on: [ coreos01_internal_port ]
    properties:
      name: coreos01
      image: { get_param: image}
      flavor: { get_param: flavor }
      networks:
        - port: { get_resource: coreos01_internal_port }
      user_data_format: RAW
      user_data:
        str_replace:
          template: { get_file: cloud-config.yaml }
          params:
            $private_ip: { get_attr: [ coreos01_internal_port, fixed_ips, 0, ip_address ] }
            $token_url: { get_param: discovery_token_url }
            $ssh_key: { get_attr: [ coreos_key, public_key ] }

   coreos02_internal_port:
    type: OS::Neutron::Port
    properties:
      network_id: { get_resource: internal_net }
      fixed_ips:
        - subnet_id: { get_resource: internal_subnet  }
      security_groups:
        - { get_resource: coreos_secgroup }

   coreos02:
    type: OS::Nova::Server
    depends_on: [ coreos02_internal_port ]
    properties:
      name: coreos02
      image: { get_param: image}
      flavor: { get_param: flavor }
      networks:
        - port: { get_resource: coreos02_internal_port }
      user_data_format: RAW
      user_data:
        str_replace:
          template: { get_file: cloud-config.yaml } 
          params:
            $private_ip: { get_attr: [ coreos02_internal_port, fixed_ips, 0, ip_address ] }
            $token_url: { get_param: discovery_token_url }
            $ssh_key: { get_attr: [ coreos_key, public_key ] }

   coreos03_internal_port:
    type: OS::Neutron::Port
    properties:
      network_id: { get_resource: internal_net }
      fixed_ips:
        - subnet_id: { get_resource: internal_subnet  }
      security_groups:
        - { get_resource: coreos_secgroup }

   coreos03:
    type: OS::Nova::Server
    depends_on: [ coreos03_internal_port ]
    properties:
      name: coreos03
      image: { get_param: image}
      flavor: { get_param: flavor }
      networks:
        - port: { get_resource: coreos03_internal_port }
      user_data_format: RAW
      user_data:
        str_replace:
          template: { get_file: cloud-config.yaml }
          params:
            $private_ip: { get_attr: [ coreos03_internal_port, fixed_ips, 0, ip_address ] }
            $token_url: { get_param: discovery_token_url }
            $ssh_key: { get_attr: [ coreos_key, public_key ] }

outputs:
  public_ip:
    description: CoreOS Cluster SSH Access IP
    value: { get_attr: [ coreos01_floatingip, floating_ip_address ] }

```
Your Heat template can have as few or as many resources as you like, it's very easy to do. Once you've constructed a template you can create as many stacks from it as you like, using commands such as these:

```
openstack stack create -t <template file> <stack name>

openstack stack show <stack name>
```
and you can "update" existing stacks by changing the contents of the file and then running an update command:

```
openstack stack update -t <template file> <stack name>
```
Hope that's useful info, it's definitely how I would try and solve *any* multi-cloud problem.

**Heat Stack User Roles**

Within OpenStack you can assign many different roles to a user. For example, the normal user may only be assigned the role called Member. An administrator may have the role called cloud_admin.

The purpose of these roles is to define and restrict access to some API calls. For example, the users with the Member role assigned cannot change the password for another user, but user with the cloud_admin role assigned can do this.

OpenStack Orchestration service, Heat, supports its own set of additional roles.

The Heat service automatically assigns the heat_stack_user role to users that it creates during stack deployment. This role has restricted access to some API calls as users created by Heat inside a stack are only for that stack.

If you wish for a user to be able to manage different stacks (for example, delete and add resources to many running stacks), then you must assign the heat_stack_owner role to this user. The heat_stack_owner role has much fewer restrictions on which API calls it can make to Heat.

Unfortunately, the heat_stack_user and heat_stack_owner roles will cause conflict with each other, so if you have a user with the heat_stack_ownerrole, you must not assign the heat_stack_user role to it, to avoid this conflict.

The purpose of these multiple roles is to facilitate the use of "Keystone Trusts" as a deferred authentication method. If you wish to learn more about this topic, you can read this blog post: http://hardysteven.blogspot.com/2014/04/heat-auth-model-updates-part-1-trusts.html

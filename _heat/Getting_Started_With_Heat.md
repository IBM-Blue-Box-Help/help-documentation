---
layout: page
title: "Getting Started With Heat Templates"
author: Sina Sinadeghi
dateAdded: September 21, 2016
tags: [heat, orchestration, templates, best practices]
featured: true
weight: 3
---

As a best practice, we suggest that your team consider using the OpenStack Orchestration service (Heat), which comes enabled with all IBM Blue Box Clouds. 

Using Heat, you can define all your resources procedurally in a text file, and run that same file against multiple clouds to achieve the same result (known as a stack).

Introductory documentation created by OpenStack can be found [here]9http://docs.openstack.org/developer/heat/template_guide/hot_guide.html) and [here](http://docs.openstack.org/developer/heat/template_guide/).


I have some personal Heat templates. [This one is a little bit old but it should give you an idea of the sort of things you can do:](https://raw.githubusercontent.com/sinner-/heat-coreos/master/heat-template.yaml
heat_template_version: 2013-05-23)

**Description: HOT file for 3 node CoreOS cluster**

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

Your Heat template can have as few or as many resources as you like. For example, if you want a Heat template that spins up stacks that just have security groups in them, it's very easy to do. Once you've constructed a template you can create as many stacks from it as you like, using commands such as these:

```
openstack stack create -t <template file> <stack name>

openstack stack show <stack name>

```
and you can "update" existing stacks by changing the contents of the file and then running

```
openstack stack update -t <template file> <stack name>

```
Hope that's useful info, it's definitely how I would try and solve the multi-cloud problem.

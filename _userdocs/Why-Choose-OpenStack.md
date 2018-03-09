--- 

layout: page 

title: "Why Choose OpenStack?" 

featured: false 

weight: 2

tags: [OpenStack, Reference] 

author: Leslie Lundquist

formattedBy: Jillian Tempelmeyer

figuresResearch: Jillian Tempelmeyer

dateAdded: April 14, 2016 

--- 

OpenStack™ is an extensive, open source software platform for delivering Infrastructure-as-a-Service (IaaS). Development of OpenStack began in 2010 through the combined efforts of Rackspace and NASA. OpenStack can manage small or large pools of compute, storage, and networking resources in a datacenter, and it can make those resources available and scalable through a centralized dashboard. 

**History and Vision**: OpenStack is the fastest growing open source project in history, now with over 20 million lines of code. It is governed by the OpenStack Foundation, which promotes its development, distribution and adoption. The OpenStack project comprises more than 34,000 individual contributors and more than 550 participating companies, all of whom are members of the Foundation. Individual membership to the Foundation is free. Corporate memberships are available at two paid levels, Platinum and Gold. The Foundation is guided by a Board of Directors, composed of individuals and representatives of participating corporations.

**Licensing and Releases**: OpenStack software is available under Apache License, on a bi-annual release schedule (April/May, Oct/Nov). Releases are codenamed alphabetically. The most recent release is named “Ocata.” Concurrently, the next release is in active development. Coinciding with these bi-annual releases, the OpenStack community meets at OpenStack Summits to plan for the upcoming release and to display achievements or use cases. 

**Hardware Requirements**: OpenStack works with standard or commodity hardware, no need for specialized vendor hardware. For customers who want to use specific enterprise-grade hardware, drivers are available. A list of these drivers is available on the OpenStack website, in the Marketplace.

**Software Project Methodology (The Big Tent)**: Starting with the Liberty release, the OpenStack community adopted “The Big Tent” as the metaphor for software development of OpenStack. Projects are proposed by community members and sheltered under “The Big Tent,” gaining resources as community members decide to work together. No projects are officially sanctioned or officially rejected in their initial phases.

**OpenStack Communities**: The biggest strength of OpenStack is its vibrant community. More than 34,000 individual contributors from more than 177 countries are part of this community, with more than 70 user groups worldwide. OpenStack user groups meet regularly. They act as venues for spreading awareness, for fostering technical discussions, and for showing camaraderie with the community at large. If you are new to OpenStack, learning from other users by participating in these groups is the easiest way to get started.

**Market Trends and State of the Stack**: OpenStack is becoming the platform of choice for private cloud deployments. Market revenue is expected to reach $1.3 Billion by 2016, and to cross $3B by 2018. The top three driving factors for OpenStack adoption are the ability to innovate quickly (DevOps) on top of an OpenStack IaaS platform, the ability to automate cloud deployment for easy upscaling, and the fact that OpenStack is an open technology. Software Development and testing are the most commonly used workloads, followed by infrastructure services. Enterprise workloads are increasing, particularly around OpenStack APIs, which have become the standard for Infrastructure as a Service (IaaS). From a broader perspective, OpenStack adoption is increasing in Academia and Research, Telecommunications, Finance, Media, and throughout other market sectors.

**OpenStack Documentation**: For newcomers to OpenStack, installation guides are available for different platforms (Ubuntu, RHEL, Debian, SUSE). These guides are updated with every release. The OpenStack project provides comprehensive online documentation targeted at System Administrators, Cloud Administrators, End-Users, Architects, and Cloud Developers. Documentation also is available on advanced topics such as Security and High Availability. These advanced documents are updated regularly, but not in the same cadence as the OpenStack releases. 

**Ask OpenStack**: If you have specific questions on OpenStack, learn from experts at [Ask OpenStack](https://ask.openstack.org/)—a crowdsource Q&A site modeled on the popular site, StackOverflow. 

**OpenStack Marketplace**: OpenStack customers have lot of choices: service providers, vendors, system integrators, distributions, trainers, consultants, and so on. To help you make informed decisions, the OpenStack Marketplace offers a central repository of information and reviews related to OpenStack vendors, products, training, consultants, and other services.

_Current Marketplace Trends: Supporting Figures_

_Figure 1. OpenStack Representation by Industry (OpenStack User Survey, April 2016)_
![ ](https://cloud.githubusercontent.com/assets/17212946/14742265/ceec47ac-0860-11e6-8373-c009cf2261cf.png)

_Figure 2. Workloads and Frameworks Running on OpenStack (OpenStack User Survey, April 2016)_
![ ](https://cloud.githubusercontent.com/assets/17212946/14742082/0a252470-0860-11e6-9cd3-fffe53145c34.png)

_Figure 3. OpenStack Software Development (Projects under The Big Tent, November 2015)_
![ ](https://cloud.githubusercontent.com/assets/17212946/14742679/166c17e0-0863-11e6-96d3-3a06f01567c3.png)


## OpenStack: An Overview by Components
The OpenStack platform is a collection of services, separated into functional components. Together, a few core components provide capabilities in your data center for computing, object and block storage, and networking, with a centralized dashboard for managing all of these resources. These core services are integrated together through a set of supporting services, described in the next sections of this document. The following figure illustrates the relationships among the components of OpenStack.

_Figure 4. OpenStack High-Level Architecture, by Components_
![ ](https://cloud.githubusercontent.com/assets/17212946/14742353/545ba3ec-0861-11e6-850d-a75e401e3a68.png)

## OpenStack Infrastructure (IaaS) Services: The Core Projects
The projects commonly referred to as Core were among those first developed by the OpenStack community. They have undergone years of use and testing in production environments, and they are still the most widely deployed OpenStack components. Together, these components are standardized on the same open platform and APIs that power a global network of public and private clouds. Additionally, The Core Projects provide a strategic, viable replacement for traditional capital expenditures on infrastructure.

The OpenStack Core Infrastructure (IaaS) projects are: 
 * **Nova** (Compute)
 * **Cinder** (Block Storage) 
 * **Swift** (Object Storage)
 * **Neutron** (Network)
 * **Glance** (Images)
 * **Keystone** (Identity)

In fact, these services (except Swift) originally began as parts of Nova, the compute service that was the very first OpenStack project (along with Swift). Each project was either separated from Nova (Glance and Cinder) or re-implemented later (Neutron). Together, Glance, Cinder, and Swift comprise the data handling and storage capabilities of OpenStack. Neutron consolidates the networking features of OpenStack into an easily deployable form. Ironic assists with automated hardware provisioning, to allow for complete IaaS functionality and extensibility.

**Nova**: Nova is the compute service of OpenStack. It provides on-demand provisioning and management of virtual machines. It supports multiple hypervisors including KVM, XenServer®, VMware ESXi, and Microsoft Hyper-V. It also supports Linux Containers such as LXC. 

**Glance**: Glance provides an API-accessible service for handling disk and server images, including discovery, registration, and delivery. Glance can store images in a variety of back-end setups, including OpenStack Swift. The Glance service accommodates multiple image formats, including Raw, VHD, VMDK, and VDI.

**Cinder**: Cinder, OpenStack’s block storage module, provides virtual storage for virtual instances. It lets you create devices, attach them to and detach them from virtual servers. Cinder is fully integrated with OpenStack’s Nova compute services, it can be managed from the Horizon dashboard, and it supports integration with enterprise storage platforms such as Nimble®, Solidfire®, or EMC® through specific drivers. It also provides support for snapshots.

**Swift**: Swift handles distributed, non-structured data. It offers an excellent platform for storing images, videos, virtual machine images, and archives. Swift provides cost-effective, API-accessible, distributed, redundant, scalable storage that is ideal for backup, archiving, and data retention.

**Neutron**: Neutron provides a pluggable, API-driven platform for managing networks and IP addresses. Neutron supports multiple network models (Flat, VLAN, VXLAN), static IPs, and DHCP. It can leverage advanced networking capabilities by taking advantage of SDN platforms such as OpenFlow.

**Keystone**: Keystone provides authentication and authorization capabilities. It integrates with existing back-end directory services such as LDAP. Keystone provides a central directory of users with mappings to the services they are authorized to use.

For all practical purposes, Keystone is a required component of any OpenStack deployment. Every OpenStack deployment requires some form of authentication service, with Keystone as the most common use case. (There might be a no-op authentication for some extreme test cases.) For example, Swift still has its own authentication, although it is not often used except in a test deployment where Keystone is not available.

OpenStack integrates these modules of compute, storage, networking, and provisioning components with each other—and with additional support services—thereby providing a unified and scalable user experience of infrastructure as a service (IaaS). Note that these same OpenStack services also are accessible through a uniform, RESTful API; by using the API interface, creating your own user experience (UX) is an option.

### OpenStack Supporting IaaS Services 
OpenStack Supporting Services extend the capabilities and features of the OpenStack Core IaaS. They include security services, usage monitoring, and automated deployment services. The bullets below list these additional OpenStack services in their approximate frequency of deployment along with the essential OpenStack IaaS services listed in the previous section.

Supporting IaaS Services include:
	
* **Ceilometer** (Telemetry)
* **Heat** (Orchestration)
* **Horizon** (Dashboard)
* **Ironic** (Bare Metal Provisioning)

Together, Ceilometer, Horizon and Heat make the OpenStack cloud environment richer by consolidating common usage and functionality information across all the OpenStack components. (Note: In recent releases of OpenStack, some library code, Oslo, also is always deployed automatically because it is required as a common library for these services.)

**Ceilometer**: Ceilometer aggregates usage and performance data across OpenStack services.

**Heat**: Heat provides a template-based capability for describing and automating the deployment of relatively complex infrastructure. For example if you need to deploy a simple Web application with an instance running as an application server, with a database stored in Trove, and a load balancer—you would create a Heat template with a parameter for the number of application instances. When used in conjunction with the Ceilometer telemetry service, Heat offers automated scaling capabilities, which, in the example above, could deploy even more instances when needed.

**Horizon**: Horizon offers a centralized graphical user interface that lets you view, provision, and manage cloud resources. Third-party services, such as billing and monitoring, can be integrated easily with the Horizon dashboard interface. OpenStack still functions entirely without Horizon, and the same usage information is accessible using the underlying OpenStack APIs.

**Ironic**:  Ironic lets you automatically provision and manage physical machines. Traditionally, a company would spend money to buy or build this service, but it can be considered a type of compute service.

## OpenStack Application Support

Each of the OpenStack projects covered in this section serves as a wrapper for a specific application. These modules are ideal for streamlining your cloud for a specific purpose: database access, big data analysis, or shared information. In particular, these OpenStack modules will spin up new Nova instances already running the particular application that you need. These OpenStack projects would work well running within containers, such as Docker containers, especially because in most cases the user does not have direct access to these instances:

* **Trove** (Database)
* **Sahara** (Data Processing—Hadoop)
* **Manila** (Files—CIFS)

**Trove**: Trove provides Database-as-a-Service (DBaaS) capabilities on the OpenStack cloud infrastructure.

**Sahara**:  Sahara provides a scalable data-processing stack and its associated management interfaces.

**Manila**: Manila provides shared file-system services. It  works with Samba (a Linux implementation of Windows file sharing) and others.

**Ongoing Improvement**: Other Projects in the Big Tent
OpenStack services constantly are being incubated, implemented, and improved to meet the quality bar already established by these widely deployed OpenStack modules described previously: integrated IaaS, supporting IaaS, and PaaS. Some of the current incubated projects under the Big Tent include Deployment Service (TripleO), DNS-as-a-Service (Designate), Key Management (Barbican), Load-Balancing-as-a-Service (Octavia), Firewall-as-a-Service, Network Function Virtualization (NFV), and others. 

## OpenStack Cloud Delivery Methods

You might ask: Now that I know all of this, how do I actually *get* an OpenStack Cloud? OpenStack software currently is delivered to customers in three primary ways: 

1. **As a collection of packages (called a ‘distribution’ or ‘distro’)**: The OpenStack website offers a standard, downloadable distribution of OpenStack. Apart from the default OpenStack distribution, many vendors offer proprietary distributions that include some value-added services. Distributions help with the installation and upgrade process of using OpenStack, which can be laborious. However, distributions are not particularly helpful with simplifying the operation of an OpenStack cloud. Customers who successfully use distributions usually have significant experience with OpenStack. Distributions are created by many vendors, as many as 25, including Mirantis, Red Hat, HP, Platform 9, and others. A list of distribution vendors is available in the OpenStack Marketplace, as is a list of consultants who might help you with an OpenStack deployment.

2. **As a service**: OpenStack as a service means that you purchase your (private) cloud services on contract from experienced cloud operators, such as IBM or Rackspace. Cloud operators provide support to their clients, so that you are free to work “with” OpenStack, not “on” OpenStack. This is the main benefit of using OpenStack cloud as a service (IaaS): it frees you to focus on your own business applications, rather than on maintaining the cloud.

3. **The standard OpenStack Distribution**: The standard OpenStack distribution bundles OpenStack services as packages available to download. Standard packages are available for several platforms, including Ubuntu®, CentOS, Debian, and others. OpenStack software is updated on a continuous basis, for download from what is commonly referred to as the trunk. These continuing updates are not stable; only the bi-annual releases are stable releases. The most recent stable version also is always available for download, along with the working versions available from trunk.

## Distributions

**Third-party distributions**: Participating vendors offer their custom distributions of OpenStack, which include certain advantages provided by the vendor. A custom distribution could include a value added service, a proprietary service, or it could be particularly well integrated with other vendor offerings. A comprehensive list of third-party distributions is available on the OpenStack Marketplace. Among the most popular third-party distributions are Mirantis OpenStack, Red Hat Enterprise Linux OpenStack Platform, Rackspace® Private Cloud Software, and Ubuntu OpenStack.

## OpenStack Cloud As a Service

A few vendors offer OpenStack cloud through the hosted, or ‘as a service’ delivery mechanism described previously—making OpenStack cloud available on demand, within a hosted environment. For customers who want to use OpenStack without the overhead of operations and additional infrastructure, hosted OpenStack cloud is an attractive option.

Hosted cloud customers receive their single-tenant OpenStack cloud with all its advantages, including API access without the overhead of deployment and operations. A comprehensive list of OpenStack hosted cloud providers is available on the OpenStack Marketplace. Here are some popular vendors of OpenStack cloud as a service:

**IBM Bluemix Private Cloud**: Blue Box was purchased by IBM in June, 2015 to become a part of IBM’s cloud product offering, now known as IBM Bluemix Private Cloud. Blue Box was one of the earliest providers to offer hosted OpenStack private cloud as a service, thus bringing a lot of expertise into the IBM Bluemix team. The IBM Bluemix Private Cloud team leads the OpenStack Seattle User Group meetups and actively contributes to the OpenStack community, particularly around OpenStack Operators work group. Their latest product, IBM Bluemix Private Cloud Local, lets you locate OpenStack private cloud hardware in your own data center, fully managed by IBM Bluemix Private Cloud experts.

**Cisco Metapod**: Cisco is another vendor offering OpenStack cloud as a service, formerly developed by Metacloud. They began with Cloud-in-a-box or Private Cloud Appliance based in OpenStack, and later started offering hosted Private Cloud. Their custom OpenStack distribution also is known for its superior User Experience (UX).

**Rackspace**: Offers hosted, dedicated private cloud environments in their data centers. Known for great performance.

**Two Types of Hosted Environment**: Public and Private Cloud

**Public cloud**: One way to learn more about how OpenStack cloud operates is to try out one of the OpenStack-based public cloud service providers. Many offer a free trial subscription or an inexpensive introductory rate. A list of public cloud service providers is available on the OpenStack Marketplace. 

**Private cloud**: Private cloud tends to appear in two varieties: Hosted cloud, which means that your dedicated but remote cloud hardware and software is operated on your behalf by a cloud service provider, and Local cloud, which means that you own your own hardware and hire someone to run it for you.

**Hosted**: Hosted OpenStack cloud products offer an easier option for getting started with OpenStack. For instance, when you sign up with a provider like IBM Bluemix Private Cloud, you could probably have your hosted private cloud running in few hours. 

**Local Cloud**: Local cloud means that you have the hardware for your cloud located in your own data center, but operated on your behalf by a hosting provider, such as IBM Bluemix. Several providers are entering the marketplace in 2016 with new offerings of Local cloud services. A list of providers is available on the OpenStack Marketplace.

## Now for the Fun part: Why OpenStack is Great for You

Want to check it out? You can start with DevStack. DevStack is the simplest way to install an OpenStack test cloud with a minimal configuration. If you want to test out a local cloud environment—just to check it out for yourself–without a contractual commitment to service, you can get started easily with DevStack. It is an easy to set up, all-in-one configuration, downloadable from the OpenStack website.

DevStack is intended to be used as a prototyping environment. It offers All-in-One-Single VM, All-in-One-Single Machine and Multi-node configurations. However, DevStack is not suitable for running a production cloud workload; for example, it doesn’t return to fully operative status after rebooting your machine. 

The cloud you launch with DevStack  is not monitored or managed, and all debug logging is enabled by default. It is useful, for example, for comparing OpenStack versions to learn whether software will work properly with a new OpenStack release, before upgrading. It is currently available for Ubuntu, Fedora, and CentOS/ RHEL platforms.

If you have specific requirements in mind for your cloud, you can deploy OpenStack projects that meet only the requirements you currently have. OpenStack provides a path for continuing to add capabilities as you need them. For the sake of example, suppose you have a Website running on your own dedicated Web servers and you just run a service like Tumblr—storing blog posts and images. You’d just need a way to store a lot of data. You could deploy only Keystone and Swift as your OpenStack configuration, which would provide authentication and storage services, no compute needed!

Or suppose you need only compute infrastructure in your cloud, because your site only requires ephemeral storage capabilities (lost on reboot). You could deploy your OpenStack cloud using only the Keystone, Nova, Glance projects. In that case, the networking capabilities within Nova would give you simple network features. For richer networking capabilities, add the Neutron component of OpenStack to your deployment. You’ve got a perfectly good compute infrastructure.

To deploy a fully-functional OpenStack cloud, with full compute and storage capabilities, you’d use all of the core OpenStack IaaS modules, and you’d probably add Keystone to provide authentication services. From there, you’d further customize your cloud to fit exactly the types of operations you’re going to need, for example, a database or a data analytics cluster. You can continue to add and upgrade OpenStack functionality as you need it.

## Common OpenStack Use Cases

OpenStack functions well across many industry verticals and across diverse use cases. Here are some of the most successful OpenStack use cases:

**Cloud Service Provider**: In this use case, the OpenStack platform provides virtual infrastructure as a service (IaaS) at larger scale. A typical stack of this type includes open source tools such as KVM (hypervisor), Ubuntu (OS), OpenStack (cloud management layer), Nagios (monitoring), LogStash (Logging), Kibana (Analytics), Chef (Orchestration), HAProxy (Load Balancers) along with home-grown components. Commodity hardware generally is used to provide compute functionality and certain kinds of storage; however, multiple hardware configurations could be deployed. Rackspace Public Cloud is a good example of this use case.

**Telecom Service Provider**: Telecom Service providers (Telcos) have been early adopters of OpenStack for their private cloud requirements. These use cases typically provide “IT-as-a-Service” to internal organizations or to partner organizations. The OpenStack community is working on advanced capabilities specific to Telcos (such as Network Function Virtualization, or NFV).

**Applications Development Cloud**: Another common use case of OpenStack is to enable Continuous Integration/Continuous Development (CI/CD) in Applications Development clouds. In this case, OpenStack cloud enables business agility, and increases customer confidence about running Line of Business (LOB) applications on OpenStack clouds. These LOB applications and workloads typically involve some kind of source code repository (for instance, github.com), test harness (e.g., Jenkins), bug database (e.g., Atlassian), and deployment tools.

## Using Third-Party Tools with OpenStack

OpenStack integrates well with popular third-party cloud operations, development, and management tools available. Third-party tools may include Software Developer Kits (SDKs) for the OpenStack APIs, orchestration tools, monitoring tools, logging tools, and provisioning tools. In realistic cloud deployments, it is inevitable that you’ll use some other open source tools. This section lists some types of tools that are widely used along with OpenStack. Note that some proprietary OpenStack distributions may not require any of these tools, because they usually include custom equivalents.

**SDKs**: OpenStack provides two ways to manage your compute, storage, and networking resources in your datacenters: Dashboard and Service Endpoints. OpenStack Service Endpoints are exposed through programmable interfaces (REST APIs). One can access these APIs through any REST client, such as the Client Tools available as part of the OpenStack project. SDKs to work with these APIs also are available for various programming languages.
 
**OpenStack Client Tools**: The OpenStack project includes official clients for various projects including Dashboard, Compute, Object Storage, Identity Service, and Image Service, while additional clients for other projects are in development. 

**OpenStack SDKs**: An official OpenStack SDK for Python is available, and unofficial SDKs are available for various programming languages including C, C++, Java .NET and more.  

**Orchestration Tools**: Though OpenStack includes its own orchestration service (Heat), many deployments utilize other popular orchestration tools such as Chef, Puppet, and Ansible.

**Chef**: Chef is a popular configuration management tool from Chef (formerly Opscode). It is widely used for OpenStack deployments. Chef employs a client-server architecture. Official cookbooks are available to get you started on deploying OpenStack with Chef. 

**Puppet**: Puppet is another popular configuration management tool from PuppetLabs. Puppet also employs a client-server architecture.  Official Puppet modules are available to help you deploy a large-scale OpenStack cloud.

**Ansible**: Ansible software is an agentless configuration management tool. Though official Ansible playbooks are not available for OpenStack, one can get started with these Blue Box playbooks. 

**Monitoring Tools**: Operating large-scale OpenStack cloud requires frequent monitoring of different components, including compute resources, virtual machines, and virtual networks. Monitoring also lets administrators raise alerts proactively, such as when a compute node approaches full CPU utilization. OpenStack provides Telemetry service (Ceilometer), which provides an event-based infrastructure that enables monitoring; however, it doesn’t provide complete monitoring capabilities. Therefore, OpenStack cloud deployments often utilize other open source monitoring tools, such as Nagios. 

**Logging Tools**: To provide advanced log management capabilities, open source tools such as LogStash may be employed. LogStash provides a centralized capability for logging, parsing, and storing the logs. When used in conjunction with search tools such as ElasticSearch, it provides a powerful and scalable log management solution for your OpenStack cloud. 

**Provisioning**: Deploying an OpenStack cloud involves provisioning bare metal servers as controller nodes or resource nodes. Popular tools used for provisioning include Chef, Puppet, Ubuntu MaaS, and Crowbar. OpenStack’s own bare metal service, Ironic, also is an available option.

## Glossary of Cloud Terms

**Access Key/Secret Key**: Two paired and automatically generated encryption keys, used in combination to access and communicate with a compute instance. The secret key is used to digitally sign each request, and the access key to validate the signature.

**Availability Zone**: An isolated set of hypervisors within a cloud. An availability zone provides fault tolerance to virtual machines. OpenStack supports availability zones that allow either logical separation or clustering of services. Typically these zones are created for power-accessibility or for geographical reasons. You can select a zone when launching new instances.

**Block Storage**: Type of storage that supports volumes, volume snapshots, and volume types. A block storage volume is a block device that is not directly connected to a running instance. It can be attached to one instance at a time, and it will survive if the instance itself fails or is shut down. Usually, OpenStack volumes are connected to an existing SAN, thus you can use an API to interact with them.

**Container**: Organizes and stores objects in Object Storage. In OpenStack, containers include third-party software such as Docker.

**Fixed/ Static IP**: An IP address that is associated with the same VM instance each time it reboots. This type of address is used within the cloud for VM management. It is generally not accessible to customers.

**Flavors**: A set of parameters that describe the virtual machine images. Parameters include CPU, memory size, storage size, and so forth.

**Floating IP**: An IP address associated with a VM instance so that the instance has the same public IP address every time it reboots. Floating IPs create a public, reachable IP address and then direct traffic from that address to a configured instance. The IP won't actually be created as part of the instance; instead the cloud provides an indirect relationship. First an address must be allocated from a provided pool, and then it can be attached to an instance.

**Hypervisor**: Software that arbitrates and controls VM access to the actual underlying hardware. It represents the physical compute node that is provisioned in a specific instance.

**Image**: A collection of files for a specific operating system that one needs to use to create or rebuild a server. OpenStack supports multiple image formats (AMI, VMDK, VHD, QEMU). For example, server images let you create pre-configured images to use at a later time. They can be used to launch new server instances, and they will show up when listing images.

**Instance**: A virtual machine. To launch (or “spin up”)  an instance, a minimal set of information is required: a disk image that serves as a model, an instance flavor (think of it as a size), an instance name (e.g. “MyInstance4032”). Most OpenStack environments also require you to provide a reference to a network device when launching an instance.

**Metadata**: Instance metadata can be useful for sorting or cataloging instances. Metadata is a freeform key=value store per-instance.

**NAT (Network Address Translation)**: A protocol for changing one type of IP address into another within the cloud.

**Network**: A virtual network is a Layer-2 network that provides connection between entities,such as instances within the cloud.
 
**Object**: An object is any kind of data that is stored in object storage, which could be of any format—file, music, video, or binary.

**Object Storage**: A type of storage that supports eventually consistent, redundant, non-structured data. OpenStack object storage is not a traditional file system, but rather a distributed storage system for static data such as virtual machine images, photo storage, email storage, backups, and archives. It has no “root” directory, central "brain," or master point of control, thus allowing greater scalability, redundancy, and durability. Data is represented by objects, and objects are stored in containers.

**Project/Tenant**: A project is a logical grouping of users; also commonly referred to as a tenant. 

**Quotas**: Resource limits on compute and storage resources, set on a per-project basis. Typically, in a multi-tenant managed cloud, each tenant’s quotas are based on their contractual agreements. Quotas can be set on a project or class basis, with the purpose of limiting consumption of resources such as RAM, IP addresses, number of cores, size of storage volumes, etc. OpenStack can enforce quotas on resource consumption.

**Role**: A role includes a set of rights and privileges. A user assuming a particular role inherits its associated rights and privileges.

**Security Group**: A set of filtering rules applied to a compute instance. A security group is like a firewall for a group of systems. You can provide access rules that refer to other groups or to CIDR blocks. These groups can be attached to an instance, to provide access to that instance.

**Server**: A generic term referring to a virtual machine (VM) instance.  Another generic term for a virtual machine instance is host.

**Service**: An OpenStack service provides endpoints through which a user can have access to and control over resources.

**SSH key**: SSH keys are used to connect securely (using ssh commands) into instances launched with OpenStack. OpenStack has a built-in method for inserting an SSH keypair's public half into the authorized keys file for a newly booted instance. Nova can create the private part of the key for you as well, or you can upload the public part of an existing key pair.

**Snapshot**: A point-in-time copy of a storage volume or an image. Functionally, snapshots are the same as images.
  
**User**: A user consumes cloud resources. Each user is a member of one or more projects. Within a project, a user creates and manages resources such as instances and volumes.

**Virtual Machine (VM)**:  An instance running inside an OpenStack cloud; another term for a VM could be server or host.

**Volume**: Disk-based data storage that could be persistent or ephemeral (lost during reboots).  This storage is generally represented as an iSCSI target with a file-system that supports extended attributes. When attaching a volume to a server, it is possible to rely on the system to assign a device ID automatically, within the instance, to connect to the new volume. You also can choose to specify. If a new volume is attached, it is necessary to format the volume for use. Subsequent usage of that volume will not require formatting.

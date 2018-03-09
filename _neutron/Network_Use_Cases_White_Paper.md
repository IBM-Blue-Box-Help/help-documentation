---
layout: page
title: IBM Blue Box Network Use Cases
featured: true
tags: [neutron, use cases, network, white paper]
author: Leslie Lundquist and Dustin Lundquist
editor: Leslie Lundquist
weight: 7
dateAdded: September 7, 2016
---

## A Best Practices White Paper 

#### by Leslie Lundquist and Dustin Lundquist

#### July 30, 2016 

**Background:** IBM Bluemix Private Cloud runs in IBM Cloud data centers. Each IBM Cloud data center is built out to contain multiple pods, forming subnets, and these subnets share one large IP address space across all IBM Cloud data centers worldwide. 

Dividing the network into separate pods to limit the size of any single network is a good practice: it limits the scope of Layer 2 (L2) problems and isolates the failure domain thereof. That is, by making the subnet smaller, fewer things can be affected when it breaks, so it is simpler to diagnose. 

However, because of this design based on pods, a customer needs to utilize Layer 3 (L3) network connectivity if their hosts end up in different pods. The pods are split into small blocks of 32 addresses each, so as your cloud grows, IBM Cloud cannot guarantee that you can always get another host into an existing pod. Therefore, customers have to plan for the multi-pod case as the norm. 

### Customer Use Cases for IBM Blue Box Cloud 

This section steps through several customer use cases that IBM Bluemix Private cloud customers encounter in the context of the IBM Cloud data center IP address schema, and it gives general approaches or solutions that IBM Bluemix Private Cloud engineers have been implementing. 

**1. Connectivity between private networks:** 

In this case, a customer wants to communicate between two private internal OpenStack networks; therefore, the customer creates two private internal networks and connects them using an OpenStack router. 

_Commentary:_ As long as the two customer networks are behind separate OpenStack routers, you’re aligned with Neutron in its attempt to allow for and provide overlapping IP address space: You can easily provide overlapping IP space behind separate routers. However, if you have a single router, the subnets that are directly connected to the back of a single router should not overlap. Given. 

The next two use cases are related: Inbound and Outbound traffic between the customer’s cloud and the public Internet. These are probably the most normal use cases for any customer or site. 

**2. Ingress (inbound) connectivity from the public Internet:**

In this case, a customer needs access to their guest VMs from the public Internet. To create a solution, the customer needs to assign an IP address (preferably publicly routable IPv6, alternatively, floating IPv4) to each guest VM, and they must ensure that their security groups are set up to allow the appropriate inbound access to their VMs. 

**3. Egress (outbound) connectivity to the public Internet:** 

In this case, a customer needs access to the Internet from their guest VMs, for example, to download installation packages. Usually, the guest VMs should obtain outbound connectivity to the Internet via NAT on the Vyatta associated with their pod. 

_Commentary:_ Use cases 2 and 3 are referring to global Internet connectivity. In general, as we have noted elsewhere in this paper, when you combine IP address spaces you’re going to have some overlap, in which case you must use NAT. This is not a desirable solution. Alternatively, you could create a customized networking solution; however, these solutions often are fragile, being Byzantine, and they require significant investment in time and energy for maintenance and upkeep. 

**4. Access to SoftLayer services:** 

Sometimes, a customer needs access to services hosted on IBM Cloud data center’s private networks. From a security viewpoint, only the strictly required guest VMs should have access to IBM Cloud hosted services on their private network. This access is provided by NAT on the Vyatta associated with the pod. IBM Cloud services are hosted on 10.0.0.0/14 network. 

_Commentary:_ The next two use cases, BYOIP and DirectLink, are really two sides of the same coin. They’re just the mechanism for providing connectivity to their existing/remote networks, using either a VPN or DirectLink, which might be a leased line or an MPLS circuit. (MPLS stands for Multi-Protocol Label Switching, which is a type of VPN often used by enterprise customers.) So it all is really VPN. 

**5. BYOIP connectivity:**

In this case, a customer wants to bring their own network subnets into IBM Bluemix Private cloud and connect to them from their on-premise data center. To create a solution, we can create overlay OpenStack networks with subnet values provided by the customer. These overlay networks are attached to a “default” OpenStack router which has SNAT disabled. We will ensure that routes are set up in the associated Vyatta for each of these customer subnets. This solution requires tunneling between the IBM Bluemix Private cloud and the customer’s data center. 

**6. DirectLink connectivity:** 

Based on the DirectLink option selected by the customer, we can set up appropriate networks within their IBM Bluemix Private cloud. The most common use case would be to set up a network as another BYOIP network. However, in this situation, we need to use different tunneling end points for DirectLink. 

_Commentary:_ In these cases, the customers want to extend their existing IP address plan and network plan to their IBM Bluemix Private cloud. It is a hybrid, with a small “h,” not a capital “H.” It is not what we sell as “Hybrid cloud,” which has come to mean creating connectivity between public and private clouds, to most people. 

**7. SoftLayer private network connectivity:** 

In this case, a customer needs to create connectivity between two clouds running in two separate IBM Bluemix accounts: one is an IBM Bluemix Private Cloud (in IBM Bluemix data center) account and another is the customer’s own SoftLayer account. This situation requires VLAN spanning to be enabled between two (otherwise unrelated) SoftLayer accounts. 

* a. If this customer is using an IBM Cloud data center's routable 10.x.x.x subnet in both clouds, then no action is required, assuming that VLAN spanning between these two accounts is enabled already. 
* b. If this customer is using BYOIP networks, then tunneling is required between the IBM Bluemix Private Cloud and the customer’s cloud that is running in another SoftLayer account. 

_Commentary:_ For case (a.), cross-account VLAN spanning is an IBM Cloud data center feature, which really should be called “cross account inter-VLAN routing,” because it is not operating at L2, but at L3. This case means simply spanning two IBM Cloud accounts within SoftLayer’s existing IP address plan. For case (b.), the IBM Cloud engineers must determine and explain what type of tunnel would work. 

### Problem and Solution Statement
Because of the complexity of the solutions that must be applied to these IPv4 use cases (as described in this paper), it is recommended that customers seriously consider adopting IPv6 addresses when they need to allocate larger subnets, such as one would wish to have when assigning addresses for a large dedicated cloud. Conversion to IPv6 makes sense wherever possible. We now suggest that, as a best practice, customers consider full migration to IPv6 over the next 5 years. 

### Conclusion 

The recommendation of this paper—for using IPv6 addresses—allows everyone to work out of the global IP pool, worldwide. It resolves many, if not all, of the difficulties described in these customer use cases, which must, for now, be addressed by virtual networking schemas such as the ones described in this paper. The complexity of these implementations is manageable primarily because the IBM engineering team is closely familiar with the issues and tradeoffs involved. 

The global internet address routing table is the largest IP address plan available, unifying all of these. If you work out of that plan and you follow the rules, your address is going to be unique. That is why we are recommending a migration to IPv6. 
Until such time, the use cases described in this paper are offering a look into these workable solutions that the IBM Bluemix Private Cloud engineers have created to transcend the global limitation of IPv4 addresses and the necessary IBM Cloud data centers' pod structure. 


* Nomenclature Note: A routing table is a view of an IP address space from a specific point in the network.

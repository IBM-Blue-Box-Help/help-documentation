---
layout: page
title: Cloud 101 -- Optimized Load Balancing
tags: [load balancing, HA, arp responder, MAC move]
author: Dustin Lundquist and Leslie Lundquist
dateAdded: May 17, 2017
featured: true
weight: 5
---

When running your workloads on a cloud, you often want to spread the load across two or more virtual machine (VM) hosts. One reason might be for the sake of redundancy, for example if you’re running a mission-critical database application. Or you might want to scale your workload across multiple machines, so that it can serve more clients. 
Because individual VMs can (and will) fail, operating on the cloud is as much about designing for failure as it is about provisioning services automatically. 

Most cloud customers want high-availability (HA) services. Generally, for your workload to run in an HA manner, you will want it to be hosted on two (or more) completely separate (hardware) machines, or even better, in two separate availability zones (think _datacenters_), so that if one fails, the other will be able to continue the service. If one machine fails, there will be a “failover” to the other machine, which means that the service can keep running, which is what people call an “HA” service—it’s almost always available. 

### There’s more you need to know about HA

HA isn't always guaranteed to be 100% available, it is just “more available” than a single server. Here’s an example: If you have two servers, and each server is only 70% reliable—which means that at any moment each has a 70% chance of being able to serve requests successfully—then these two servers, in an ideal HA configuration, would be 91% reliable. Mathematically?  There’s a 70% chance that the first server successfully served the request, together with a (70% of the remaining 30%) chance that the second server successfully served the request, which equals 91%. Maybe you should still throw away the whole setup, or at least get some more reliable servers, with that level of reliability! …But “better” availability is still better.

### HA and load balancing

When you’re running an intensive workload, the first point where you usually want HA is for your load balancer (LB), so you have a single point you can go to—a well-known destination—where your application can always be reached, even if there’s been a failover. For example, if you want to run your database in an HA mode, you’d figure out how to replicate the database across two VMs, then you’d put those two VMs behind a load balancer, to spread out the network traffic more equally between them. In the cloud, you don’t need a guarantee to reach the same VM each time, you just need to know that your database will always be reachable and consistent.

In a cloud environment, you’re usually best off using the cloud provider’s load balancer. If you try to create your own LB schema, you’re likely to create unnecessary complexity, because overlay and software-defined networking (SDN) networks end up having low-level interactions with the cloud provider’s HA IP schemes. By using the service provider’s LB, you make it “their” problem, so you don’t have to see it from their underlying network. For example, Amazon cloud uses Elastic Load Balancer (ELB), and that is a fine solution, so their customers do not need to do any load balancing for themselves.

All of that being said, there are 3 effective ways to load balance in a cloud environment, should you find yourself needing to do that. Each method has its strong and weak points.

### Load Balancing Defined: Three Basic Methods

Essentially, load balancing is the same as managing (or changing) the mapping between the name of a service (e.g. database service) and the reachability of the host that is delivering that service. Given that the server is available via Ethernet and you’re making the request via DNS, you can change that mapping in three basic ways, or you could think of it as “interrupting” at three basic places along the pathway. You could change:

* the mapping between the DNS name and the IP address
* the mapping between the IP address and the Ethernet MAC address
* the mapping between the Ethernet MAC address and the switch port

[N. B. If you’re connecting straight to an IP, don’t—use DNS instead. It is easier to manage your services.]

The table that follows summarizes these three options. If you understand this table just by looking at it, you probably don’t need to read the rest of this article. Go for it! For others, the explanation will follow, keep reading. Enjoy!

|             | MAC Move (#3) | ARP Move (#2) | GLB (Global) (#1) |
|------------|-------------|-------------|--------------|
| Association | MAC -> Port | IP -> MAC | Domain Name -> IP |
| Update MSG |Gratuitous ARP | Gratuitous ARP | None (DNS Response) |
| Who needs to take action | Switches in path between HA servers | Routers and hosts on local VLAN | Client, by means of Caching DNS Resolvers |
| Example Implementations | OpenBSD CARP, Cicso HSRP | uCARP | F5 GLB |
| Table that is updated | Switch MAC Table | Host ARP Cache/Table | Host and Resolver DNS Cache |
| Problems | Provider MAC Filter, Provider IP Filter | Provider IP Filter, More probable split brain between hosts on subnet | Solution works best in global application, not on local subnets |

#### Option 1: Change the DNS name to IP mapping

Global Load Balancing (GLB) and DNS round-robin are examples of this first option. GLB refers to a smart DNS resolver that considers server availability, server load and/or client, and the geographic proximity of a service when selecting which DNS resource records to return. 

Round Robin DNS is a simpler approach, in which the DNS resolver rotates the order of resource records so that successive requests are assigned in a “round-robin” (RR) order. For example, suppose that the client tries the first RR address of its preferred address family (IPv4 or IPv6). If it is unable to connect within a timeout window—usually 2 seconds—the client may attempt to connect to additional addresses returned by the resolver.

This DNS global load balancing method is almost always “outside” the other methods, and it can be combined with these other methods. It can be safely laid on most any cloud solution—for example, if you have data centers operating around the world. It handles the same load balancing problem as other methods, but at a very different scale.

#### Option 2: Change the IP address to Ethernet MAC address mapping

This option sometimes is described as an “ARP move.” In the ARP move case, each host in the group has a single MAC address, but each host will answer for this shared HA IP address. The shared HA Ip address is known as a new, associated MAC address via the gratuitous ARP request, and the update has to be sent to every other host in the local subnet. (That’s usually a VLAN, and usually but not always a 1:1 mapping of hosts to IP addresses.) In this case, a host that sends data from outside the subnet will send it via the router, so it’s the router that needs to learn the updated MAC address (next hop) for that IP.

The problem with ARP move is that you can get partial failover, which is not a desirable state, when the network is congested. In this state, some requests will go to each HA server, because some hosts will be sending it to the old destination — that can happen when the update doesn’t propagate because it may be dropped if some links on the subnet are too congested. Also, because each host responds to the gratuitous ARP update, it can use up the resources on each host when making the updates.

Notice that the ARP move method operates at the L2/L3 boundary of the OSI model.

#### Option 3: Change the Ethernet MAC address to switch port mapping

For MAC move option, a virtual MAC address will show up as an additional MAC on the active node in an HA group. The “Active” host will receive frames for the shared MAC address, as well as those frames intended for its local MAC address.

The MAC move method is pretty elegant if you have a small L2 network with a few switches connected together using spanning tree protocol, and so forth. (That is, with redundant connections.) In that situation, the MAC move techniques are generally more reliable and predictable. (But at this point you’re running it on hardware.) If you’re wanting to run on someone else’s hardware, point them to this article and ask them what they recommend. (if they don’t know, you might want to find another provider!)

Notice that the MAC move model operates at the L2/L1 boundary of the OSI model.

### Use of the Gratuitous ARP signal by two of these methods

What’s confusing when distinguishing between these latter two approaches is that both MAC move and ARP move use gratuitous ARP responses to accomplish their LB function. In fact, they use the same signal for different purposes; however, upon receiving the gratuitous ARP signal, a different action is taken is each case. (It’s called gratuitous because no one requested it, it’s just being broadcast.) 

#### MAC Move

MAC move uses gratuitous ARP as the signaling method, but the hosts that receive a gratuitous ARP already knew this new information—-there’s just an update of the “age to zero” field. It’s already entered in their switch table, so the update merely resets the aging timer, and the existing entry is “new again.”

(N.B. All entries for switches and hosts (in the ARP table and MAC address table) are aged out to zero—entries last from 5 minutes to 4 hours, varying by vendor.)

So, to summarize, for the MAC move method —the host just ignores the message or resets the aging value in the switch table.

#### ARP Move

However, in the ARP move method using this same example, the switches will say “Ahem, this frame is from a different port than I knew” so it updates —That is, the switch is aware that the source address for this frame is arriving on a different port than expected, so it updates its own MAC address table accordingly.


### Why are ARP move and MAC move bad on SDN?

These methods are not particularly scalable with software-defined networking (SDN) for all the standard reasons: potential performance concerns, potential security issues, potential propagation delays leading to slow failover, and possible split-brain situations that could arise.

#### Performance and Security

If you have a controller-based SDN and you’re just doing L2 networking, a MAC move is an event that has to be bubbled up all the way to your control plane. Then it will recompute the paths, and push it back down into the switches.

This activity is computationally intensive and can be used as a DoS attack. It is generally rate-limited, or it should be. 

#### Propagation delays and edge cases

Furthermore, unlike a traditional distributed learning network (such as a normal ethernet switched network, connected together) this learning takes longer for the local switch to process. In a traditional network, the new information propagates like a ripple—spreading outward in an expanding perimeter. It is a ripple of new state. Or some might consider it as a propagation wave, which is more linear than a ripple.

As a result of propagation delays, there are edge cases in which some of the switches have learned the new destination address for HA failover, but not all of them. Those edge cases are more predictable and more manageable when the updated information  spreads out as a wave. For example, two switches are less likely to loop a frame back between them, each thinking that the other needs to be updated. (That activity would consume all the available bandwidth on the links between those switches!)

Finally, the SDN may or may not include L3 networking. If it does, the ARP move affects the SDN-controlled routers similarly. In particular, updates take longer to process. Because there are usually fewer routers than switches in the L2 fabric on a given subnet, the situation is usually not quite so bad—our main concern is minimizing the time required for update (by rippling outward), which is the same as the time required to complete a failover, of course.

#### SDN with ARP responder enabled

Some SDNs have an ARP responder (for example, as in OpenStack Neutron), so they may respond with old or inconsistent information. This situation accentuates the normal drawbacks with the ARP move method, leading to a possibility of split-brain function. This method would be very unhealthy to apply in OpenStack Neutron if you have a Master-Master DB setup, for example. Fortunately, ARP responder is an option in Neutron, so it can be disabled if necessary.

For more information about load balancing in Neutron, here's a [related introductory article](http://ibm-blue-box-help.github.io/help-documentation/neutron/Intro_to_LBaaS/), and here's an article describing some [limitations you might encounter](http://ibm-blue-box-help.github.io/help-documentation/neutron/Limitations_of_LBaaSv2/).

### One Degenerate Case: ARP Load Balancing 

Here there be dragons! ARP load balancing is a case in which you are constantly sending gratuitous ARP packets, so that—on a sub-second time window—you are sending thousands and thousands of packets that must be processed. It generates hundreds or thousands of times the normal load. In a normal networking situation, the ARP move or MAC move is a rare event—for example, there will be an ARP packet when the system comes online, then there might be one maybe 4 hours later…and so forth. It is not a usual design case for SDNs. Load balancing in this case is accomplished by a constant stream of updates that must ascend to the control plane and be pushed back out to every host, thus eating up a lot of system resources to perform a function that could be performed much more efficiently.

Some commercial cloud providers, who shall remain unnamed, are using ARP Load Balancing as their normal method to accomplish load balancing for their clients. These providers would do well to reconsider their techniques, because they are exposing themselves to all of the potential pitfalls listed previously, especially performance concerns and security concerns.

### Other implementations of these 3 basic LB methods

Other protocols exist that load balancers can use to connect to the network. For example, they can speak a network routing protocol or act as a switch in a bundled multi-ethernet switch link (LAG or port channel).

These implementations require more advanced network configuration, and they generally can be made more specific. In certain situations, they can be a better choice than the methods described previously. (They won’t work everywhere but a cloud provider may choose to use one of these methods to connect their LB service.)

Certain services—such as `keepalived`—also can be put into this category.

Experts such as managed hosting providers may use these more complex alternatives successfully. For example, at Blue Box, before we were acquired by IBM, we used OSPF to announce the shared IP to our network infrastructure, for our Blue Box "Blocks" load balancer.

To summarize, other, more advanced implementations of the three basic methods we’ve included in this article exist, but the three methods described in this article are the basic, underlying methods that any implementation would have to be using to accomplish load balancing in a cloud environment.

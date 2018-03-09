---
layout: page
title: Cloud Networking and Software Defined Networking--A Best Practices White Paper
author: Dustin Lundquist and Leslie Lundquist
tags: [sdn, networking, best practices, vlan, vxlan, l2pop, arp, provisioning]
dateAdded: June 7, 2016
---

**Overview:**

Within many “enterprise” data center networks and many next-generation wireless provider networks, there’s a shift going on from fully distributed networking control toward networked environments designed for centralized networking control using **Software Defined Networking** (SDN). This shift is arising in response to emergent complexity in network behavior, which can arise as a result of heavy network traffic combined with distributed local learning by routers and switches.  

These emergent complexities have an impact on Cloud network engineering, which is our particular focus. Engineers struggle with virtual overlay networks and rely on implementation details of the underlying hardware networks, which can lead to undefined behavior in production Cloud environments. Solutions are available. 

This paper gives background information on why and how some choices for Software Defined Networking seem easy to make, but can lead to difficulty later. It offers some alternatives for creating stable and predictable network environments, based on known principles of behavior for simpler network hardware and software. Generally, it examines the best areas of applicability for SDN, and it describes how a user can select the right technologies to use with SDN.  


**Background at Layer 2: Ethernet Switches**

Let’s review the design and operating principles of Ethernet Switches, as a starting point for understanding how complexity can develop rapidly in a busy network environment. We’ll include only the most salient features about switches. First, keep in mind that the Ethernet switch operates at the Layer-2 (L2) protocol level, which means that it works with MAC addresses, rather than IP addresses.  Also, remember that at L2, datagrams are referred to as “frames,” whereas at Layer 3 (L3), they are referred to as “packets.” We’ll keep using this terminology later to keep the discussion more clear.

If we first break down into simple detail what happens each time a switch receives a frame, it helps us understand what’s happening as complexity grows. When a frame is received:

1. The Source address of the frame is learned, and the Port information is stored.
 
2. The Destination address is checked against the list of known addresses.

3. If the Destination is found in the list, the frame is sent to the associated Port.

4. If the Destination address is not found, the frame is sent to all ports known to the switch, except the ingress port. That action is called “Flooding.” The frame is duplicated as many times as necessary to send a copy to every known port.

This method is very basic, and it works, even when you connect many switches—hundreds—into a tree, as long as there are no loops in the tree. A protocol known as “Spanning tree protocol” detects and prevents loops, so that no frames go around and around forever. (These are called "bpdu frames" —bridge protocol data unit.) They can drop due to congestion or can be dropped because of a link error (invalid checksum, for example).

As an additional factor in this process, known addresses are “aged out” (on an individual switch) if no frames are received from them or sent to them for some pre-established duration of time, usually anywhere from 5 minutes to 4 hours. It’s easy to see that, as new frames are received and old addresses are aged out, not all the switches always will have the same state at all times. Their lists of known addresses will differ slightly, and that’s part of the design.

Emergent complexity can begin at L2 when there is congestion, usually due to high volume of new incoming frames or due to flooding. For example, imagine this scenario: one new frame goes up the tree to one point, and thus other switches in other parts of the tree don’t learn that MAC address as a Source. When a frame from the same Source goes to another switch, there will be flooding due to the unknown address. More switches will be busy handling the flooding, so another frame might come in to another switch on the tree that has not handled that Source MAC address before. More flooding ensues, until most or all of the switches have learned (or re-learned) the Source MAC address of the new frame, and the flooding traffic can diminish.

Meanwhile, performance degradation and other problems can occur.

**Background at L3: ARP Messages**

Address Resolution Protocol, or ARP, works at Layer 3 (L3), using IP addresses to help handle packet routing among “neighbors” on a subnet. 

The question that ARP answers is this: How do we send packets to our local neighbors? (That is, how do we identify and send to hosts on the same subnet?)

*Footnote: For the purposes of this paper, a subnet refers to group of hosts that share the network (mask) portion of an IP address (XX.XX.XX.me) To reach addresses outside the subnet, packets are sent to one of these hosts that works as a gateway, which means that it has some connection to a larger network.*

ARP is really elegantly simple. It includes four types of messages, for example:

1. “Who has 192.0.2.10?” (request)
2. “I have 192.0.2.10” (reply)
3. “X has 192.0.2.10” (reply as proxy)
4. Probe: Give me all the addresses on this subnet

Although gratuitous ARP messages may be broadcast, usually ARP replies are unicast to the requestor. Proxy ARP is used in conjunction with routing. The proxy replies for entries on a remote host because it can send them there: it has an IP address for that host. 

There are 4 types of ARP messages, because a host can answer on behalf of itself or some other host, or there can be an ARP probe. All ARP requests are sent to the Ethernet broadcast address: FF:FF:FF:FF:FF:FF (which is all F’s, that’s 6 groups of 2). Any host on an Ethernet subnet can assert that it has a particular IP address, or that its accomplice has a particular IP address, and so forth. 

Thus, as you might have deduced already, there is no security with ARP.  Hopefully you trust your subnet neighbors. Generally this issue is referred to as “first-hop security,” because it has to do with the host’s packets being able to make the first hop to the router, securely.

Remember from the previous section that the Ethernet switching protocol delivers frames within a subnet based on a host’s MAC address (L2), not its IP address( L3). Therefore, each host needs a mapping table from MAC addresses (L2)  to IP addresses (L3) for local neighbors it talks to on the subnet.

There actually are two levels of mapping, as shown in the following schematic figure:

```
IP      o    o     o
          \ /      |
MAC        o       o
           |       |
Port       o       o
```

MAC address to Port is 1-to-1 mapping, but MAC address to IP address can be one-to-many. (This mapping distinction is common in cloud deployments, where VMs can have internal + external IPs and more, one for each network they connect with.)

On a busy subnet, there can be a lot of ARP requests! Each host remembers the addresses of its neighbors only up to 5 minutes. (That is to say, at L3, subnet neighbors “age out” as do MAC addresses on Ethernet switches at L2.) In fact, interesting behavior occurs on a subnet if your ARP and Ethernet switch port aging are set to the same value; one must be longer, or else you can end up with network traffic that is all broadcasts! 

**Conjoining L2 and L3: Reasoning for SDN**

These systems of Ethernet switching and ARP requests work pretty well until there is too much broadcast traffic, or until there too many MAC addresses start talking on the network for the switches to accommodate all the addresses in their tables. (Many switches will begin flooding if they run out of slots for MAC addresses.) To get around these limitations, many data center designers break local networks up into smaller L2 segments and connect them with routers. In other words, they “conquer by dividing” the problem into smaller L2 domains.

By using this technique, called hierarchical routing, you can decompose the problem into *log N* smaller problems.

However, many customers still expect all their hosts to belong the same L2 domain, as it would be configured, naturally, if the subnet were in their own data center. Therefore, many cloud solutions deploy overlay networks (which refers to some techniques for carrying the customer’s layer 2 network over the provider’s L3 infrastructure) to join the hosts into subnet domains.

For example, VxLAN is form of overlay whereby an encapsulation carries Ethernet frames inside UDP packets. Each host participating in a VXLAN overlay network has a VTEP (VxLAN tunnel end point) which is a listening UDP socket with a UDP port and and IP address.

This situation applies to many IBM Bluemix Private Cloud deployments in SoftLayer data centers. Because SoftLayer organizes the data centers into localized hardware “pods,” software defined overlay networks (SDN) must be deployed to connect any customer cloud deployments that have not been established within the same hardware pod. IBM Bluemix Private Cloud 3.0 (and newer) has implemented many Software Defined Networking solutions that let customers connect their clouds together, thus creating many possible *hybrid cloud* solutions. (By hybrid cloud, we are referring to the ability to bind together two or more private or public clusters of computers, where those clusters each in turn are designed to create collections of virtual machines and their associated networks -- that is, to combine multiple cloud environments.)


**Provisioning**

Sometimes we get questions from customers about the ultimate limitations of how many VLANs and VxLANs can be deployed at one time. Here is some basic information about provisioning:

VLANs are provisioned across an entire switch fabric, therefore every switch (potentially hundreds) in the fabric would be able to access each of the 4096 VLANs. If, however, a 4097th VLAN was needed, that would have to be provisioned on a new switching fabric entirely. This is a basic limitation of Ethernet, not of our platform.

VxLAN is used to get beyond this limitation by enabling an additional 65,000 virtual VLANs to be provisioned on each of Ethernet's 4096 VLANs. That would max out at 268,435,456 VxLANs on a single fabric. In short, VLAN exhaustion is NOT a practical limitation.

Given our standard configuration for IBM Bluemix Private Cloud, a single fabric could support 3000+ customers, each having 65,000 VxLANs.

Within Box Panel, VLANs can be tracked with names reflecting the switch fabrics they are associated with. We have never exceeded the VLAN limits of our fabrics, so we simply name ours VL### (eg VL101). To distinguish fabrics, they could be named "fabric1-VL101", "fabric2-VL101", etc.

*Footnote: Software Defined Networking (SDN) was developed as a way to define a set of policies in a central database, and then use computation to enforce these policies automatically. The term has come to be used more generally to refer to the use of network overlays.*

**Suggestion for further reading:** [https://en.wikipedia.org/wiki/Switched_fabric](https://en.wikipedia.org/wiki/Switched_fabric)

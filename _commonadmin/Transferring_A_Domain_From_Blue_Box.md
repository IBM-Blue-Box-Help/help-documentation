---
layout: page
title: Transferring A Domain From Bluemix on OpenStack
featured: false
weight: 20
tags: [managed hosting, domain, registrar, transfer]
dateAdded: August 16, 2016
author: Bluemix on OpenStack Support
editor: Leslie Lundquist
---

This document is intended for IBM Bluemix on OpenStack Managed Hosting clients. It would not apply to our OpenStack clients. Thank you.

Transferring a domain name can be a complicated process, and it is getting more complicated as time goes on. Other Registrars (where you've registered your domain) don't want to see you leave, so they figure that if they make this process as complicated as humanly possible, maybe you'll stay.

Several registrars exist that will take care of all of these complications for you, for example: hover.com

In this article, we will outline the steps involved to transfer a domain. These steps may change, and if/when they do, we'll be sure to update this process, but here's the best outline for how this process presently works.

1. The first step is to login to your existing domain registrar and make these changes or collect this information:
  * Turn off Domain Protection or Domain Locking
  * Turn off Domain Privacy / WHOIS Privacy
  * Make sure all email contact details are presently up to date
  * See if you can locate the authorization code
2. Once you have those pieces of information, contact us and ask to initiate the transfer.
3. We will initiate the request with our registration provider, TuCows / OpenSRS.
4. TuCows will send the request to where the domain is presently registered.
  * From this step, you should receive 2 emails. The first should be from TuCows / OpenSRS asking you to confirm the transfer. You'll need to follow the instructions they send in that email to authorize the transfer. This step is very important. If you do not authorize the transfer here, the transfer will time out and we will have to re-initiate the transfer.
  * Once you've approved the transfer within TuCows / OpenSRS, you will then get another email from your existing registrar asking you to authorize the move. You need to make sure to authorize this request as well.
5. Assuming all the steps above were a success, the domain should transfer within a few days.

### A Few Notes

This transfer process can take as long as 3 weeks, assuming everything goes right. You'll want to make sure you start the process early enough before your domain expires, so you don't run into any problems.

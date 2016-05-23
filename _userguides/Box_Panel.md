---
layout: page 
title: "Box Panel User Guide" 
featured: false 
weight: 2 
tags: [getting started, Box Panel] 
author: Jill Tempelmeyer and Leslie Lundquist
editor: Leslie Lundquist
dateAdded: April 14, 2016 
---

## Getting Started with Box Panel

The Box Panel interface gives you a single, consolidated view of assets deployed in your **IBM Blue Box Dedicated** and **IBM Blue Box Local** cloud environments. Its self-service access lets you create support tickets, leverage central authentication for logins and user permissions, monitor various functions, and view your invoices, easily. 

This user guide gives you an end-to-end overview, so you can get started using Box Panel to monitor and control your IBM Blue Box Cloud. This document applies to Box Panel Version 3.8.3 and later.

### Table of Contents

 * [Logging In](http://ibm-blue-box-help.github.io/help-documentation/gettingstarted/userguides/Box_Panel/#logging-in)
 * [Getting Your Credentials From Lockbox](http://ibm-blue-box-help.github.io/help-documentation/gettingstarted/userguides/Box_Panel/#getting-your-credentials-from-lockbox)
 * [Navigating the Box Panel Dashboard](http://ibm-blue-box-help.github.io/help-documentation/gettingstarted/userguides/Box_Panel/#navigating-the-box-panel-dashboard)
 * [Working with Cloud Images](http://ibm-blue-box-help.github.io/help-documentation/gettingstarted/userguides/Box_Panel/#working-with-cloud-images)
 * [Help Documentation](http://ibm-blue-box-help.github.io/help-documentation/gettingstarted/userguides/Box_Panel/#help-documentation)
 * [Getting Support](http://ibm-blue-box-help.github.io/help-documentation/gettingstarted/userguides/Box_Panel/#getting-support)
 * [Managing Billing](http://ibm-blue-box-help.github.io/help-documentation/gettingstarted/userguides/Box_Panel/#managing-billing)


### Logging In 

To get started with Box Panel, log in. 

1. Go to the URL `https://boxpanel.bluebox.net` to be directed to the login page.
2. Log into your Box Panel account with the login credentials provided by the Blue Box Support Team. If you are a **Secondary** contact and you don't yet have access, you can be added by an **Administrator**. See the **Managing Users and Projects** section for more details.
3. If you do not yet have a Box Panel account, please refer to the **Billing** section for instructions on how to get an account.
5. After logging in, you'll be directed automatically to the Box Panel Dashboard.

### Getting Your Credentials From Lockbox

Initially, you will receive `cloud_admin` credentials for your private cloud (OpenStack cluster) through the Box Panel Lockbox. Your credentials should look like this:

 {% highlight bash %}

URL: https://customer_name.openstack.blueboxgrid.com 

User name: **Your Specified Username**

Password: **Your Specified Password**

{% endhighlight %}

To get started, first navigate to the URL provided in your Lockbox. Then you can use **Your Specified Username** and **Your Specified Password** to log in.


### Navigating the Box Panel Dashboard

From the Box Panel Dashboard, you can see a consolidated asset view of all of your **IBM Blue Box Dedicated** and **IBM Blue Box Local** instances, on one screen.

The top of the Dashboard displays the infrastructure currently in use, with your list of hosts. 

![ ](https://cloud.githubusercontent.com/assets/17212946/15029877/322e6f8a-1215-11e6-99f2-fc79cdfa2512.png)


On the right, additional details related to your account summary are displayed, including your **Lock Box Messages**, **Verbal Password**, **Bandwidth Quota**, and **Backup Quota**. 


### Working with Cloud Images 

The **Cloud Images** page in Box Panel is available to customers who have at least one cloud, and who are either a **Primary** or a **Technical** customer contact. If you qualify as a user, the **Services** navigation will include a **Cloud Images** link with access to the page. 

![ ](https://cloud.githubusercontent.com/assets/17212946/15030057/fb4cdeec-1215-11e6-9d3e-60fa8d7953a9.png)

Each image is displayed as a card. Cards are grouped by operating system. 

**To download a Cloud Image:** 

1. Hover over the card associated with the image you would like to download. 
2. Click the card. This click opens a modal window containing download links to the image and Checksum. 
3. Click the **Copy** button to the left of the Image URL. This click adds the URL to your clipboard. 
4. This procedure also can be accomplished using OpenStack APIs. For instructions, please see the [main document about Cloud Images](http://ibm-blue-box-help.github.io/help-documentation/gettingstarted/commontech/Cloud_Images_Provided_by_IBM/) 

![ ](https://cloud.githubusercontent.com/assets/17212946/15030096/20400436-1216-11e6-8987-5dc8e6cdf080.png) 

### Help Documentation

From your Box Panel dashboard, you'll see  a link on the Nav Bar (the rightmost link) called **Docs**. If you select that link, a Dropdown menu appears, with the options of **OpenStack**, or **Managed Hosting**. To view the Customer Help documentation for IBM Blue Box Cloud, select **OpenStack**. The Help page will appear. You can browse the documentation by category, or you can search, using the search bar. By hovering over one of the icons, you can see a list of articles within that topic area. 

![See the Nav Bar](https://github.com/IBM-Blue-Box-Help/help-documentation/blob/gh-pages/Blue-Box-Help-Select.png)

### Getting Support 

**Note: For immediate support, you can call Blue Box Support at 1-800-613-4305 or email us at support@bluebox.net.**

In most cases, you'll want to open a support ticket to get support. By using a ticket, you'll have a record of the issue and the solutions taken to address your issue, complete with logs of your chat sessions with the customer support team.

**To create a ticket:**

1. Open a new ticket from the **Support** page. 

![ ]()

2. In the Modal window, your name should show up as the **Ticket Creator.**
3. Copy additional users in the **CC** field to make them aware of the ticket and track its status. 
4. Add a descriptive subject to the ticket. 
5. Collect and add all useful information to the **Description** section, such as: 
   * Date and time the issue began 
   * Frequency of the issue (permanent or constant, at a particular time of day, etc.) 
   * Steps you have taken to replicate the issue 
   * Affected server name(s) 
   * Affected data center(s) 
   * Any error messages returned
   * Applicable server logs 
   * Any additional useful information 
6. Include attachments, such as log files, right below the **Description** section. 
7. If your deployment is for a new cloud, check the **Deployment** box.

![ ](https://cloud.githubusercontent.com/assets/17212946/15032633/850d3d4a-1228-11e6-9b37-c20e5d32d9b9.png)

**Note: Steps 8 and 9 can be skipped for non-urgent concerns.**

 8. If the issue is urgent, you can check the **Open this Ticket as Urgent** box to escalate the ticket. This click will prompt an acknowledgement that you consent to pay consulting charges if the issue is non-critical (critical items would include situations in which there are outages). 
 9. If you wish to open your ticket as **Urgent** and consent to pay the consulting charges for non-critical items, check the **I Agree** box. 
 10. Finally, click the **Create Ticket** box. 

**Using Your Support Ticket**

Anytime after a ticket is created, you can see the text associated with that ticket, by clicking on that support ticket from your Dashboard. The ticket's text may include references to other tickets, as well as chat history and any correspondence related to your selected ticket. The status of your support ticket is highlighted on the orange button in the top left corner. Status indicators include OPEN, PENDING COMPLETION, PARKED, and so forth.

![ ]() 

From the panel on the left-hand side of the screen, you can select options to create another new support ticket, subscribe to the ticket you have selected (if you want to follow its status), view your tickets, and view all tickets submitted by shared users on your account. 

To view a list of Subscribers for a selected ticket, click on the **Subscribers** link. 

![ ]()

To have a written conversation with one of our Blue Box support team experts about the topic of this ticket, you can click the green **Post Reply** button, or you can use the live **Chat** feature by clicking on **Chat**. All live chat sessions are recorded and added to the ticket as a transcript.

**Using the Chat Feature to chat with Blue Box Support**

1. Click the **Chat** tab from your Dashboard. This action automatically directs you to a chat room with support staff. 
2. From here, you are able to view the support staff members join your conversation on the left-hand side of the chat room.
3. Once a support member joins, you can compose and send messages from the chat bar. If you need to enter a new line during your chat, press **Control/Command + Enter**.
4. If you need to escalate your support issue, please call 1-800-613-4305 ext 1.

**Note:** Each customer chat room is private. This means that only the contacts within your customer account and the Blue Box support staff have access to your transcript. No sensitive data (such as credit card numbers, or private keys) persists.

### Managing Billing 

To view your contracts and monthly billing reports, click the **Account** tab in the Box Panel Dashboard, then click the **Billing** tab.

For further billing support, please contact the Blue Box Support Team, and we will be happy to assist you.
To add additional line items, such as expansion nodes, to your infrastructure, please contact the Blue Box Support Team. We will create a new monthly contract and help to streamline your setup process in any way that we can.

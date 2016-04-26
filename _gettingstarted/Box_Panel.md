--- 

layout: page 

title: "Box Panel User Guide" 

featured: false 

weight: 2 

tags: [getting started, Box Panel] 

author: Jill Tempelmeyer 

editor: Leslie Lundquist

dateAdded: April 14, 2016 

--- 


# Getting Started with Box Panel

The Box Panel interface provides a single, consolidated view of enterprise assets deployed in your Blue Box Dedicated and Local environments. Based on OpenStack Horizon, its self-service access lets users create support tickets, leverage central authentication, monitor reporting functions, and view their invoicing solutions, easily. 

This user guide provides an end-to-end overview to help you get started using Box Panel Version 3.8.3 and later, so you can monitor and control your IBM Blue Box Cloud. 

## Logging In 

To get started with Box Panel, log in. 

**To log into your Box Panel Account:**

1. Click the following URL to be directed to the login page: https://boxpanel.bluebox.net.
2. Log into your Box Panel account with the login credentials provided by the Blue Box Support Team. If you are a **Secondary** contact and don't yet have access, you can be added by an **Administrator**. See the **Managing Users and Projects** section for more details.
3. If you do not yet have a Box Panel account, refer to the **Billing** section to set up an account.
5. After logging in, you will be directed automatically to the Box Panel Dashboard UI.

## Using Lock Box to Log In

You will receive your `cloud_admin` credentials to your private OpenStack cluster through the Box Panel Lock Box. Your credentials should look like this:

{% highlight bash %} URL: https://customer_name.openstack.blueboxgrid.com User name: **Specified Username** Password: **Specified Password** {% endhighlight %}

Navigate to the above URL. You can then use your **Specified Username** and **Specified Password** to log in.

## Navigating the Box Panel Dashboard

From the Box Panel Dashboard, you can see a consolidated asset view of all of your Blue Box Dedicated and Local instances on one screen.

The top of the Dashboard displays the infrastructure currently in use, with your list of hosts. 

![Image of Dashboard1](https://github.com/help-documentation/img/Dashboard1.png)

Immediately below, you can view your bandwidth usage and any support tickets related to your cloud, along with your status. 

![Image of Dashboard 2](https://github.com/help-documentation/img/Dashboard 2.png)

On the right, additional details related to your account summary, including your **Lock Box Messages**, **Verbal Password**, **Bandwidth Quota**, and **Backup Quota** are displayed.

## Managing Users and Projects

Version 3 of the Keystone API with IBM Blue Box Cloud introduces the concept of **groups**. You can use groups to make multiple assignments simultaneously. For more information on Keystone v3, **groups**, **projects**, **users**, and use cases, please refer to the primary document on this topic: [Managing Users and Projects] (http://ibm-blue-box-help.github.io/help-documentation/keystone/Managing_Users_and_Projects/)

## Creating a Project

As shown in the **Managing Users and Projects** document, only users with `cloud_admin` roles can create projects and users.

**To create a project:**

1. Click the **Identity** tab, then click **Projects**
2. Click the **Create Project** button.
3. Assign a **Project Name** and **Description** under the **Project Information** tab shown in the Modal window.
4. Assign **Users** to your project by clicking the search bar in the **Project Members** tab. Users can be added and deleted later.
5. Enter resource allocation information under the **Quotas** tab to set and customize quotas for your new project.
6. Click the **Create Project** button.

To add or delete a user, click the **Modify Users** drop-down under the **Actions** section.

**To create a new user:**

1. Click the **Identity** tab.
2. Click **Create User**.
3. Enter a user name and their email address in the Modal window.
4. Assign a password.
5. From the **Primary Project** drop-down, select the primary project for that user.
6. Assign their role from the **Role** drop-down.
7. Confirm that you would like to create the user by clicking the **Create User** button.

## Disabling a Project

**Consequences of disabling projects:**
Users with the `cloud_admin` role can enable and disable projects. When you disable a project, it has these consequences:

- In the dashboard, users no longer have access to the project from the CURRENT PROJECT list on the Project tab.
- Users who are members of only the disabled project can no longer log in.
- You cannot launch instances for a disabled project. Instances that are running already are not terminated automatically. You must stop them manually.
- The data for a disabled project is maintained so that you can re-enable the project at any time.

**To disable a project:**

1. Click the **Identity** tab.
2. Click **Projects**.
3. Check each box associated with the project(s) you would like to disable.
4. Confirm that you would like to disable the project by clicking the **Disable Projects** button.

## Creating a Custom Flavor

In OpenStack, a **Flavor** is a template for describing the resource configuration of a Virtual Machine.

**To create a Custom Flavor:**

1. From the **Project** menu, click the **System** drop-down.
2. Click **Flavors**. Here you will see a list of your current **Flavors**.
3. Click the **Create Flavor** button.
4. Enter a name and assign custom configuration information.
5. If you would like to limit your **Flavor** to a specific project, click the **Flavor Access* tab, and click the **+** symbol to move your **Flavor** to the **Selected Projects** section.

## Adding a Virtual Machine 

**To add an asset or machine:**

1. From the **Project** menu, select **Instances**.
2. Click the **Launch Instance** button.
3. Enter an **Instance Name** in the Modal window.
4. Assign an **Instance Flavor** from the options in the drop-down menu. You can view **Flavor Details** when you select your option to receive feedback on whether you have enough quota to allow this machine to be built. If the **Instance Flavor** exceeds your consumption quota, you'll be notified before your instance is created.
5. Select a **Boot Source**.
6. Under the **Access and Security** tab, enter autentication information.
7. Under the **Networking** tab, assign your machine to your **Selected Networks**. Your **Available Networks** will be shown in the drop-down menu.
8. Click **Launch Instance**.

On the **Instances** page, find your machine in the list and select the **Actions** drop-down menu to manage your machine.

## Deleting a Virtual Machine

**To delete an asset or machine:** 

1. Visit the **Instances** page. 
2. As long as you have the proper permissions to delete an asset, you can **Power Cycle** the machine’s PDUs, or select **Delete Asset.** 
3. Confirm that you want to delete the asset by clicking **OK** from the Modal window. Your asset will be deleted permanently. 

![Image of Dashboard 3](https://github.com/help-documentation/img/Dashboard 3.png)

## Working with Cloud Images 

The **Cloud Images** page in Box Panel is available to customers who have at least one cloud, and who are either a **Primary** or a **Technical** customer contact. If you qualify as a user, the **Services** navigation will include a **Cloud Images** link with access to the page. 

![Image of Dashboard 4](https://github.com/help-documentation/img/Dashboard 4.png)

Each image is displayed as a card. Cards are grouped by operating system. 

**To download a Cloud Image:** 

1. Hover over the card associated with the image you would like to download. 
2. Click the card. This click opens a modal window containing download links to the image and Checksum. 
3. Click the **copy** button to the left of the Image URL. This will add the URL to your clipboard. 
4. This can also be done using OpenStack APIs. For instructions, click here: https://github.com/IBM-Blue-Box-Help/help-documentation/blob/gh-pages/_gettingstarted/Cloud_Images_Provided_by_IBM.md 

![Image of Dashboard 5](https://github.com/help-documentation/img/Dashboard 5.png) 

## Managing Access and Security

A software-based firewall must be opened before the instance can receive external traffic.

**To set firewall rules:**

1. Click **Access and Security** from the **Compute** drop-down menu of your project.
2. Click the **Create Security Group** button.
3. Assign a name, then click the **Create Security Group** button from the Modal window.
4. From the main **Security Group Rules** list, find your new security group and click the **Manage Rules** button. You can also delete a rule from this view.
5. Add a single **Rule** to the **Port** that your Virtual Machines are members of the security group.
6. Click the **Add** button.

To receive Internet traffic, you also must assign a **Floating IP** address that routes to your machine.

**To assign a Floating IP:**

1. Click **Instances** from the **Compute** drop-down menu of your project.
2. Find your Virtual Machine, then select **Edit Instance**.
3. From the Modal window, add your **Security Group**.
4. Click the **Save** button.
5. From the **Actions** menu on your instance, click **Associate Floating IP**.
6. From the Modal window, click **+** to assign a **Floating IP** that routes from the **Pool**.
7. Click **Associate**.
8. In the next Modal window, select the **Floating IP** from your **Pool**.
9. Finally, click **Allocate IP**.

## Creating a Storage Volume

**To create a new volume for your Virtual Machine:**

1. Visit the **Volumes** page in your project.
2. Next, click the **Create Volume** button.
3. From the Modal window, name your volume and add an optional description.
4. Assign a **Volume Size**. Your **Volume Limits** are displayed when you assign a size, to ensure you stay within your usage quota.
5. Click **Create Volume**.

**To assign a volume to your Virtual Machine:**

1. From the **Volumes** page, find your volume and select **Manage Volume Attachments** from the **Actions** drop-down menu.
2. From the Modal window, select an instance from the **Attach to Instance** drop-down.
3. Click the **Attach Volume** button to assign the volume to your instance.

## Managing Support Tickets 

You can click on the **Support** tab from your Dashboard to be redirected to view information related to your support tickets.

From this view, you can select a ticket to see the text of the associated ticket. This text includes additional tickets, as well as chat history and correspondence related to the selected ticket. The status of the support ticket is highlighted on the orange button in the top left corner. 

![Image of Dashboard 6](https://github.com/help-documentation/img/Dashboard 6.png) 

From the panel on the left-hand side, you have options to create a new support ticket, subscribe to the ticket you have selected (if you want to follow its status), view your tickets, and view all tickets submitted by shared users on your account. 

To view a list of Subscribers for a selected ticket, simply click on the **Subscribers** link. 

![Image of Dashboard 7](https://github.com/help-documentation/img/Dashboard 7.png)

To have a conversation with one of our Blue Box support team experts, you can click the green **Post Reply** button, or use the **Chat** feature. 

**To create a ticket:**

1. Open a new ticket from the **Support** page. 

![Image of Dashboard 8](https://github.com/help-documentation/img/Dashboard 8.png)

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

![Image of Dashboard 9](https://github.com/help-documentation/img/Dashboard 9.png)

**Note: Steps 8 and 9 can be skipped for non-urgent concerns.**

 8. If the issue is urgent, you can check the **Open this Ticket as Urgent** box to escalate the ticket. This click will prompt an acknowledgement that you consent to pay consulting charges if the issue is non-critical (critical items would include situations in which there are outages). 
 9. If you wish to open your ticket as **Urgent** and consent to pay the consulting charges for non-critical items, check the **I Agree** box. 
 10. Finally, click the **Create Ticket** box. 

**Note: For additional support, you can call Blue Box Support at 1-800-613-4305, email us at support@bluebox.net, or use the Chat feature, outlined below.**

## Using the Chat Feature

**To chat with Blue Box Support**:

1. Click the **Chat** tab from your Dashboard. This automatically directs you to a chat room with support staff. 
2. From here, you are able to view the support staff members join your conversation on the left-hand side of the chat room.
3. Once a support member joins, you can compose and send messages from the chat bar. If you need to enter a new line during your chat, press **Control/Command + Enter**.
4. If you need to escalate your support issue, please call 1-800-613-4305 ext 1.

**Note: Each customer chat room is private. This means that only contacts within your customer account and Blue Box staff have access. No sensitive data (credit card numbers, private keys) is persisted.**

## Managing Billing 

To view your contracts and monthly billing reports, simply click the **Account** tab in the Box Panel Dashboard, then click the **Billing** tab.

**To become a new customer:**

1. Provide the Blue Box Support team with the billing manager’s name, email, and other contact information associated with your company.
2. After your company’s billing information is received by the IBM Finance, a contract is created based on your requirements. Every IBM customer has a CFTS (customer fulfillment) account assigned. This information is documented and written on your contract. 
3. A billing start date will be set so that your solution can begin to be billed (typically, the start date is the same as your deployment date, and billing repeats monthly).

Once you’re able to log into Box Panel, you can view your billing information by selecting **Billing** under the **Account** drop-down menu. From here, you can view your **Account Services** and **Billing History**.

By clicking **Billing History**, you can download all of your invoices and save them in PDF format.

For further billing support, please contact the Blue Box Support Team, and we will be happy to assist you.
To add additional line items, such as expansion nodes, to your infrastructure, please contact the Blue Box Support Team. We will create a new monthly contract and help to streamline your setup process in any way that we can.

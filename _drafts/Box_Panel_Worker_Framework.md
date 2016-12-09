## Overview of the Box Panel Worker/ Agent Framework

The Box Panel Worker framework helps automate many of the tasks that an Operations team member might need to perform when managing an IBM Bluemix Private cloud. The framework lets the operator use Box Panel as an end-to-end deployment, upgrade, management, and expansion tool, while it also functions as the system of record for each cloud under management.

As part of the Box Panel Application Suite, the Messenger Application was created to collect from Box Panel the information needed for each type of automated task, and then to send a message containing that information to the message bus (RabbitMQ) on the Site Controller.

For each BPW service, there is an Agent. The agent communicates regularly with the RabbitMQ message bus, essentially “looking” for a job its service can carry out.

This relationship between the Box Panel Worker service, the RabbitMQ, and the Box Panel messenger is illustrated in the figure below.

![BPW figure](https://github.com/IBM-Blue-Box-Help/help-documentation/blob/gh-pages/img/Box-Panel-Worker-Overview.png)


**Example: Reboot**

To help clarify these concepts and relationships, let’s consider an example. Suppose there’s a need to reboot a specific host. This task can be accomplished through the Box Panel Worker Framework.

Here’s a general order of steps in the process:

1. The BP messenger gathers the information about the host from Box Panel, including its IP address and login credentials for IPMI access for remote reboot.

2. The BP messenger sends a message to the Site Controller / Rabbit MQ process with the relevant information about the host and the request for a reboot service.

3. The BPW Agent, which has been monitoring the message queue (RabbitMQ), picks up the reboot request and passes it to the BPW Service for execution.

**More Specifics**

Here's a more specific picture of the Box Panel Worker framework as it is deployed within IBM Blue Box. Notice that several Remote Site Controllers, deployed in Local sites, communicate with the Central Site Controller as they fetch the messages from the RabbitMQ message queue. Currently, as shown, we are running workers in the Softlayer WDC data center and in the Blue Box Remote lab in SEA-04, Rainier.

![Specific figure](https://github.com/IBM-Blue-Box-Help/help-documentation/blob/gh-pages/img/Galtenberg-BPW-Figure.png)

The effect of running these workers is that we can use them to drive workloads for the customers at any place where there is a Site Controller available. For example, we can use workers for specialized workloads in an IBM Bluemix Private Cloud (formerly Blue Box), managed in our IBM Cloud data centers, and also for IBM Bluemix Private Cloud Local, running at any customer data center.

One of our top engineers says this:
 "Just provide a snippet of Python code, we’ll deploy it wherever you like, then you can execute it
with a single message. If AWS Lambda is Function as a Service, Box Panel Worker is Local Function as a Service."

At this early stage of development, you can already use the power/IPMI worker to power-cycle machines and check power status. Also we have created over a dozen Softlayer workers for managing end-to-end workflow. 

The deployment of Box Panel Workers is built into Ursula, which is the tool we use to deploy every IBM Bluemix Private Cloud, Dedicated and Local. For general information about Ursula, please [read more here.](http://ibm-blue-box-help.github.io/help-documentation/gettingstarted/commontech/general_product_overview/) You can view the [Ursula playbooks](https://github.com/blueboxgroup/ursula) on **GitHub**. They are open source documents.

**How to Use Box Panel Worker**

Box Panel Worker capabilities are full available through the Box Panel user interface. The figure below shows an example of how to initiate a Power Cycle of a host through the Box Panel UI.

![Box Panel UI figure](https://github.com/IBM-Blue-Box-Help/help-documentation/blob/gh-pages/img/Box-panel-worker-ui.png)

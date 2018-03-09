---
layout: page
title: Customer Guide for Windows Activation
featured: false
weight: 13
tags: [getting started, images, windows, license, activation]
dateAdded: March 10th, 2016
author: Yang Zhang
editor: Leslie Lundquist
---

## Activating your Windows licenses in IBM Bluemix Private Cloud

The IBM®-provided image catalog contains Microsoft® Windows images offered in a bring your own license (BYOL) model. In accordance with Microsoft Service Provider Use Rights, IBM may not provide Key Management Services (KMS) activation services for your Windows BYOL image.

There are several ways to activate your Windows licenses:

* Create a KMS server in your IBM Bluemix Private Cloud environment
* Use an existing KMS server at your site or at another location
* Activate online directly with Microsoft
* Activate offline by telephone with Microsoft

You might use one or more of these methods depending on your circumstances. Things to consider when selecting your method:

* KMS servers have minimum thresholds for the number of clients they will activate. If your KMS service is hosted on Windows Server 2008 or Windows Server 2012, you must activate a minimum of five clients. If you are activating less than five licenses, you cannot use KMS within IBM Bluemix PRivate Cloud.
* To use an existing KMS server located outside of your IBM Bluemix Private Cloud environment, you must establish proper connectivity. This includes both the Bluemix Private Cloud firewalls and the firewalls allowing the Bluemix Private Cloud Windows instances to initiate traffic to the KMS server on tcp port 1688.
* To use direct online activation, your Windows instances must have outbound connectivity to the Internet. Instances do not have Internet connectivity by default, but you may request access in your initial order or submit a support ticket to update access at any time.

### Creating a KMS server in IBM Blue Box Cloud

You can configure any Windows Server 2008 or newer instance to provide the KMS service. To act as a KMS server, the Windows instance needs outbound Internet connectivity to communicate with Microsoft License Servers. You also must purchase a KMS Host Key from Microsoft to receive a specific entitlement.

To convert a Windows 2008 R2 instance to a KMS inside IBM Bluemix Private Cloud, use these steps:

1. Download this [**Microsoft update file**](http://download.microsoft.com/download/8/0/9/809D7026-D0F4-406E-ACDB-99E306A56A54/Windows6.1-KB2757817-x64.msu "Microsoft update file") to your instance.

2. Install the update.

3. Register the KMS host key using this command:

    ```
    %SystemRoot%\System32\CScript.exe %windir%\system32\slmgr.vbs /ipk <your_KMS_host_key>
    ```
    
4. Activate the new KMS host key using this command:

    ```
    %SystemRoot%\System32\CScript.exe %windir%\system32\slmgr.vbs /ato
    ```
    
5. Restart the Software Licensing Service using this command:
    ```
    net stop sppsvc && net start sppsvc
    ```
    
6. Use this command to open port 1688 so that KMS clients can register to the KMS host:
    ```
    netsh firewall set portopening tcp 1688 KMS enable
    ```


### Using an existing KMS server

If you already have a KMS server in your site or at another location, you can use it provided that it has the appropriate network connections established. For the Windows server to be able to activate with the KMS server, it needs the ability to initiate communication with the KMS server (typically on TCP port 1688). Create a support ticket to have the appropriate static rules applied in the IBM Bluemix Private Cloud firewall.


### Activating your Windows server through a KMS server

To activate your Windows server through a KMS server, you need the IP address and network connectivity to the KMS server plus the appropriate [**KMS client setup keys from Microsoft Technet**](https://technet.microsoft.com/en-us/library/jj612867.aspx "KMS client setup keys from Microsoft Technet").

After you have created a new instance from the Microsoft Windows Server image, connect to it and follow these steps:

1. Install a KMS client key on your Windows instance. Open a command prompt window and run this command:
    ```
    slmgr /ipk <KMS_client_key>
    ```
    View the [**KMS client setup keys online**](http://technet.microsoft.com/en-us/library/jj612867.aspx "KMS client setup keys online"). For example, to activate Windows 2008 R2 Standard instance, you would use YC6KT-GKW9T-YTKYR-T4X34-R7VHC.
    
2. Set the IP address and port of the KMS server on your Windows instance. The default TCP port used by the clients to connect to the KMS host is 1688:
    ```
    slmgr /skms <KMS_server_ip_address>:<KMS_server_port>
    ```
    
3. Synchronize the time with your KMS server:
    ```
    net start w32time
    w32tm /config /manualpeerlist:<KMS_server_ip_address> /update
    w32tm /resync
    ```
4. Activate your Windows instance:
    ```
    slmgr.vbs /ato
    ```
    
5. Change the timeserver back to default:
    ```
    w32tm /config /manualpeerlist:time.windows.com /update
    ```

For more details on Windows activation, use these resources:

  * [**Understanding KMS**](http://technet.microsoft.com/library/ff793434.aspx "Understanding KMS")
  * [**Deploying KMS Activation**](http://technet.microsoft.com/library/ff793409.aspx "Deploying KMS Activation")
  * [**Determining Product Key needs**](http://technet.microsoft.com/en-us/library/ff793412.aspx "Determining Product Key needs")
  * [**KMS Client Setup Keys**](http://technet.microsoft.com/en-us/library/jj612867.aspx "KMS Client Setup Keys")


### Direct activation

If you only have a very small number of Windows Servers to activate, you may not want to use a KMS server. You can activate the server directly with Microsoft, either by contacting Microsoft by telephone or by activating the server online. To activate your server online, your instance must have outbound internet connectivity to contact the Microsoft License Service.

---
layout: page
title: IBM Bluemix Private Cloud Image Release Notes 2016-11-30
featured: hidden
weight: 13
tags: [userguides, release, images, security, kernel, patch]
dateAdded: Nov 30th, 2016
author: Yang Zhang
editor: Leslie Lundquist, Ying Tang
---

**Image Release Notes for version date: 2016-11-30**

#### **Summary of Image Updates in the Latest Release**

These release notes describe the system updates and new features applied to IBM Bluemix Private Cloud Images of Release 2016-11-30 in comparison with the images of Release 2016-09-10, published in September, 2016.

All of the system updates and security patches applied on cloud images were officially released as of Nov 30, 2016.

# **Updates of Linux images**

All of our Linux cloud images were updated based on the latest official images specs.

All Linux images support `heat-cfn` tools.

**CentOS 6.8 x86_64**

 * Kernel version was upgraded from  **2.6.32-642.3.1** to **2.6.32-642.11.1**
 * Check the [Package List](../centos-6.8.txt) to see a full list of all upgraded/installed packages.

**CentOS 7.2 x86_64**

 * Kernel version was upgraded from **3.10.0-327.28.3** to **3.10.0-327.36.3**
 * Check the [Package List](../centos-7.2.txt) to see a full list of all upgraded/installed packages.

**Ubuntu Server 12.04 LTS x86_64**

 * Kernel version was upgraded from **3.2.0-109.150** to **3.2.0-115.15**
 * Check the [Package List](../ubuntu-12.04.txt) to see a full list of all upgraded/installed packages.

**Ubuntu Server 14.04 LTS x86_64**

 * Kernel version was upgraded from **3.13.0-95.142** to **3.13.0-101.148**
 * Check the [Package List](../ubuntu-14.04.txt) to see a full list of all upgraded/installed packages.

# **Updates of Windows images**

All of the windows cloud images were updated based on the latest official ISO specs.

All windows images have been set to use UTC(Coordinated Universal Time).

**Windows Server 2008 R2 SP1 Datacenter**

* 18 updates were applied: 
* Check the [System Update List](../win-2008r2-datacenter.txt) to see a full list of all applied system updates.

**Windows Server 2008 R2 SP1 Enterprise**

 * 30 updates were applied:
 * Check the [System Update List](../win-2008r2-enterprise.txt) to see a full list of all applied system updates.

**Windows Server 2008 R2 SP1 Standard**

 * 30 updates were applied:
 * Check the [System Update List](../win-2008r2-standard.txt) to see a full list of all applied system updates.

**Windows Server 2012 R2 Datacenter**

 * 10 updates were applied:
 * Check the [System Update List](../win-2012r2-datacenter.txt) to see a full list of all applied system updates.

**Windows Server 2012 R2 Standard**

* 66 updates were applied:
* Check the [System Update List](../win-2012r2-standard.txt) to see a full list of all applied system updates.

### **Tips:**

To check for more details about a Windows system update, please access the URL for a specific update as follows:

```
https://support.microsoft.com/en-us/kb/<update_number>
```

Please replace the `<update_number>` in above URL with the **digits** of the actual system update number.

For example, if the system update number is **KB3118401**, it would link to the following URL:

```
https://support.microsoft.com/en-us/kb/3118401
```

### **Known limitation of Windows images:**

The maximum RAM size to provision Windows VM instances is **64GB**. Windows VM instances provisioned with RAM size larger than 64GB may fail to boot up. This failure is caused by the limited free disk space in the image to provision large `pagefile.sys` file for virtual memory used by the Windows system. While there is a workaround solution available, to get a Windows VM instance with more than 64GB RAM, please provision it initially with 64GB RAM or less, and then do a **resize** for that VM instance with another flavor which has a RAM size larger than 64GB.


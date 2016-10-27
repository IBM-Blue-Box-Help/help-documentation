—
layout: page
title: FAQ: Working with Windows Images
author: Leslie Lundquist
dateAdded: October 27, 2016
tags: [troubleshooting, timezone, windows, images]
weight: 4
featured: TRUE
—
### FAQ: Working with Windows Images
**Q.** Why is the timezone set incorrectly on my Windows VM when I boot?
**A.**  The Windows VM assumes that the hardware clock is set to the local timezone, which causes the time to be set incorrectly at boot. The timezone cannot be changed on the hypervisor due to our support and security compliance policies and OpenStack does not provide a mechanism to set the hardware clock timezone for individual VMs.
We have tested a method to cause Windows to treat the hardware clock as UTC time, which corrects this issue. Please run the following command to set a registry value that will cause Windows to behave appropriately...
reg add HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\TimeZoneInformation /v RealTimeIsUniversal /d 1 /t REG_DWORD
Confirm that the value has been added with this command...
reg query HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\TimeZoneInformation
You should see a line that says RealTimeIsUniversal REG_DWORD 0x1.
Additionally, we have opened a defect to ask our image developers to include this registry setting in a future version of the Windows images we provide. 

**Q.** Is it recommended to configure `—property os_type="windows”` with `glance image-update` on the Windows image used to create the VM?
**A.** It  is indeed recommended to set --property os_type="windows" with glance image-update when dealing with Windows images on your Blue Box Cloud. 

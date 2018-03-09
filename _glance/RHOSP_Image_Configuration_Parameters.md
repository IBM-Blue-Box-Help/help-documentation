---
layout: page
title: Image Configuration Parameters for RHOSP
tags: [glance, userguides, image, glance, distro, libvirt, property keys]
dateAdded: March 28, 2017
author: Leslie Lundquist
---


When working with **IBM Bluemix Private Cloud with Red Hat** the following keys can be used with the property option for both the `glance image-update` and `glance image-create` commands.

```
$ glance image-update IMG-UUID --property architecture=x86_64
```

**Note:** Behavior set using image properties overrides behavior set using flavors.

### Property Keys


| Applies To    | Key   | Description | Supported values  |
|------------|-----------|-------------|---------|
| All    | architecture   |  The CPU architecture that must be supported by the hypervisor. For example, `x86_64` is the currently supported CPU type.  |  `x86_64` -64-bit extension of IA-32 |
| All      | instance_uuid   |   For snapshot images, this is the UUID of the server used to create this image.   | Valid server UUID |
| All     | kernel_id    |  The ID of an image stored in the Image Service that should be used as the kernel when booting an AMI-style image.   | Valid image ID    |
| All     | os_distro    | The common name of the operating system distribution in lowercase (uses the same data vocabulary as the `libosinfo` project). Specify only a recognized value for this field. Values are listed below to assist you in searching for the recognized value.  | (See List Below)  |
| All | os_version | The operating system version as specified by the distributor. | Version number (for example, "11.10") |
| All | ramdisk_id | The ID of image stored in the Image Service that should be used as the ramdisk when booting an AMI-style image. | Valid image ID |
| All | vm_mode | The virtual machine mode. This represents the host/guest ABI (application binary interface) used for the virtual machine. | hvm-Fully virtualized. This is the mode used by QEMU and KVM. | 
| libvirt API driver | hw_disk_bus | Specifies the type of disk controller to attach disk devices to. | scsi, virtio, ide, or usb.|
| libvirt API driver | hw_qemu_guest_agent | Guest agent support. If set to yes, and if qemu-ga is also installed, file systems can be quiesced (frozen) and snapshots created automatically. | yes / no |
| libvirt API driver | hw_rng_model | Adds a random-number generator device to the image’s instances. The cloud administrator can enable and control device behavior by configuring the instance’s flavor. By default: The generator device is disabled, And `/dev/random` is used as the default entropy source. To specify a physical HW RNG device, use the following option in the nova.conf file: `rng_dev_path=/dev/hwrng` | virtio, or other supported device. |
| libvirt API driver | hw_scsi_model | Enables the use of VirtIO SCSI (virtio-scsi) to provide block device access for compute instances; by default, instances use VirtIO Block (virtio-blk). VirtIO SCSI is a para-virtualized SCSI controller device that provides improved scalability and performance, and supports advanced SCSI hardware.| virtio-scsi |
| libvirt API driver | hw_video_model | The video image driver used. | vga, cirrus, vmvga, xen, or qxl |
| libvirt API driver | hw_video_ram | Maximum RAM for the video image. Used only if a hw_video:ram_max_mb value has been set in the flavor’s extra_specs and that value is higher than the value set in hw_video_ram. | Integer in MB (for example, '64')|
| libvirt API driver | hw_watchdog_action | Enables a virtual hardware watchdog device that carries out the specified action if the server hangs. The watchdog uses the i6300esb device (emulating a PCI Intel 6300ESB). If `hw_watchdog_action` is not specified, the watchdog is *disabled*.| **disabled** -The device is not attached. Allows the user to disable the watchdog for the image, even if it has been enabled using the image’s flavor. The default value for this parameter is *disabled*.  **reset**-Forcefully reset the guest.  **poweroff**-Forcefully power off the guest.  **pause**-Pause the guest.  **none**-Only enable the watchdog; do nothing if the server hangs. | 
| libvirt API driver | os_command_line | The kernel command line to be used by the libvirt driver, instead of the default. For Linux Containers (LXC), the value is used as arguments for initialization. This key is valid only for Amazon kernel, ramdisk, or machine images (aki, ari, or ami). |     |
| libvirt API driver | hw_vif_model | Specifies the model of virtual network interface device to use.  The valid options depend on the configured hypervisor. | **KVM and QEMU**: e1000, ne2k_pci, pcnet, rtl8139, and virtio. |

**Distros** 
 * arch-Arch Linux. 
 * centos-Community Enterprise Operating System. 
 * debian-Debian. 
 * fedora-Fedora. 
 * freebsd-FreeBSD.
 * gentoo-Gentoo Linux. 
 * mandrake-Mandrakelinux (MandrakeSoft) distribution.
 * mandriva-Mandriva Linux.
 * mes-Mandriva Enterprise Server.
 * msdos-Microsoft Disc Operating System.
 * netbsd-NetBSD.
 * netware-Novell NetWare.
 * openbsd-OpenBSD.
 * opensolaris-OpenSolaris.
 * opensuse-openSUSE.
 * rhel-Red Hat Enterprise Linux.
 * sled-SUSE Linux Enterprise Desktop.
 * ubuntu-Ubuntu.
 * windows-Microsoft Windows. 
 

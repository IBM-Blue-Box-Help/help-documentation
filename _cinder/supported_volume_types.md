---
layout: page
title:  "Which Cinder Volume Types are supportedi in my Cloud Instance?"
tags: [cinder, volumetype, multibackend, multitier]
dateAdded: October 7th, 2016
featured: false
weight: 5
---


Two Cinder Volume Types can be supported currently. It depends on the type of storage tier you have chosen while ordering your Cloud Instance.

## Supported Volume Types
   - CEPH_HYBRID
   - CEPH_SSD

## Supported Storage Tiers
   - SSD Single Tier
   - Hybrid Single Tier
   - Multi Tier (SSD and Hybird)

| Storage Tier    | Supported Volume Types   |
| --------------- | ----------------------   |
| SSD Single Tier |  CEPH_SSD                |
| Hybrid Single Tier | CEPH_HYBRID           |
| Multi Tier         | CEPH_HYBIRD, CEPH_SSD |

### Note:

    In case of Multi Tier Storage, by default volumes are created with type `CEPH_HYBRID`.  Please [contact our support team](https://support.bluebox.net/) if you need to change the default behavior.

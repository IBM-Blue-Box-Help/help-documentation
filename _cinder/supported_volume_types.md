---
layout: page
title:  "Which Cinder Volume Types are supported in Cloud Instance?"
author: Bluemix Private Cloud Support Team
tags: [cinder, volumetype, multibackend, multitier]
dateAdded: October 7th, 2016
featured: false
weight: 5
---


## Introduction

The OpenStack Cinder Block Storage service uses storage hardware to provide a backend that supports its volumes.
Typically, Cinder is configured with a single backend. Currently, IBM Bluemix Private can support two backends using Ceph Storage, namely `rbd_hybrid` and `rbd_ssd`. The `rbd_hybrid` backend uses a Ceph Storage Pool corresponding to the `Hybrid` type. Similarly, `rbd_ssd` uses a Ceph Storage Pool corresponding to the `SSD` type.

Each Cinder backend is associated with a Volume Type. The Volume Type assignment is a mechanism for providing scheduling to a specific backend.

## Supported Volume Types
   - CEPH_HYBRID
   - CEPH_SSD

## Supported Ceph Storage
   - SSD
   - Hybrid
   - Multi Tier (SSD and Hybrid)

| Storage Type    | Supported Volume Types   | Cinder Backend Name  |
| --------------- | ----------------------   | ------------------   |
| SSD             |  CEPH_SSD                | rbd_ssd              |
| Hybrid          |  CEPH_HYBRID             | rbd_hybrid           |
| Multi Tier      |  CEPH_HYBIRD, CEPH_SSD   | rbd_hybrid, rbd_ssd  |

### Note:

For Multi Tier Storage, Cinder volumes are created with type `CEPH_HYBRID` by default.
Please [contact our support team](https://support.bluebox.net/) if this default behavior needs to be changed.

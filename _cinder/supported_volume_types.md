---
layout: page
title:  "Which Cinder Volume Types are supported in Cloud Instance?"
author: Bluemix Private Cloud Support Team
tags: [cinder, volumetype, multibackend, multitier]
dateAdded: October 7th, 2016
dateUpdated: May 25th, 2017
featured: false
weight: 5
---


## Introduction

The OpenStack Cinder Block Storage service uses storage hardware to provide a backend that supports its volumes.
Typically, Cinder is configured with a single backend. IBM Bluemix Private cloud has two offerings: Dedicated, Local.
IBM Bluemix Private Cloud (Dedicated) can support two backends using Ceph Storage, namely `rbd_hybrid` and `rbd_ssd`. The `rbd_hybrid` backend uses a Ceph Storage Pool corresponding to the `Hybrid` type. Similarly, `rbd_ssd` uses a Ceph Storage Pool corresponding to the `SSD` type.
IBM Bluemix Private Cloud (Local) can support two bakends using Ceph Storage or IBM Storwize V7000 Gen2 Storage. `rbd_hybrid` backend is supported through Ceph Storage. In case of V7000 Gen2 storage, customer can bring their own iSCSI based device and pool(s) configuration and Cinder backend will be configured accordingly.

Each Cinder backend is associated with a Volume Type. The Volume Type assignment is a mechanism for providing scheduling to a specific backend.

## IBM Bluemix Private Cloud (Dedicated)
### Supported Volume Types
   - CEPH_HYBRID
   - CEPH_SSD

### Supported Ceph Storage
   - SSD
   - Hybrid
   - Multi Tier (SSD and Hybrid)

| Storage Type    | Supported Volume Types   | Cinder Backend Name  |
| --------------- | ----------------------   | ------------------   |
| SSD             |  CEPH_SSD                | rbd_ssd              |
| Hybrid          |  CEPH_HYBRID             | rbd_hybrid           |
| Multi Tier      |  CEPH_HYBIRD, CEPH_SSD   | rbd_hybrid, rbd_ssd  |

## IBM Bluemix Private Cloud (Local)

### Supported Volume Types
   - CEPH_HYBRID
   - V7K_POOL

### Supported Ceph Storage
   - Hybrid

### Supported IBM Storewize V7000 Gen2 Storage
   - iSCSI

| Storage Type    | Supported Volume Types   | Cinder Backend Name  |
| --------------- | ----------------------   | ------------------   |
| Hybrid          |  CEPH_HYBRID             | rbd_hybrid           |
| V7000 Gen2      |  V7K_POOL                | v7k_pool             |


### Note:

- For Multi Tier Storage, Cinder volumes are created with type `CEPH_HYBRID` by default.
Please [contact our support team](https://support.bluebox.net/) if this default behavior needs to be changed.

- For IBM Storwize V7000 Gen2 storage, customer can decide their pool name(s). Cinder Backends, Volume Types will be configured accordingly.

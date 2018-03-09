---
layout: page
title:  "What causes read-only Cinder volumes and how can I fix them?"
tags: [troubleshooting, read-only, cinder]
dateAdded: November 16th, 2015
featured: true
---

Anything that would normally make a filesystem dirty can cause a read-only mount on a volume.
For example: corruption, mount interruption, dirty shutdown, etc.

If this problem occurs, try these steps:

1. Unmount the filesystem,
2. Run `fsck` on it,
3. Re-mount it.

Alternatively, rebooting the instance should fix the problem automatically if the volume is set to mount at boot up.

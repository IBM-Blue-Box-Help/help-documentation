## New to NUMA?

### Getting Started With NUMA

For NUMA to be exposed to the guest VM, a NUMA flavor must be created and used. The file

http://docs.openstack.org/admin-guide/compute-cpu-topologies.html#customizing-instance-numa-placement-policies 

contains documentation on how to create flavors with specific NUMA requirements. You'll need to create a flavor with specific NUMA requirements like this in order to validate.

### Boot failure?

**CASE 1:** If your instance fails to boot, most likely, the flavor specs and the NUMA specifics don't match up with the available hardware. You should identify what the NUMA capabilities of the hypervisors are. From the Nova database: select numa_topology from compute_nodes;
You should be able to use that information to sort out what cells are available and what the resource constraints are.

**CASE 2:** Remember that the metadata needs to be appended not at VM boot time, but as "extra specs" (see here for more info: http://docs.openstack.org/admin-guide/cli-manage-flavors.html). 

For example:
```
nova flavor-key <flavor ID> set hw:cpu_policy=dedicated
nova flavor-key <flavor ID> set hw:numa_nodes=2
nova flavor-key <flavor ID> set hw:cpu_maxsockets=2
```

You may want to use `nova flavor-create` to create a new flavor specifically for NUMA instances first, and then apply the keys to that, rather than applying them to an existing flavor.

**CASE 3:** It could be that NUMA was enabled properly, but the nodes in this (3-node) cluster were never rebooted after pinning the cores during the initial deployment. The result of failing to reboot is that while Nova is being pinned to the appropriate cores on the nodes (for example, 60 on converged controllers, and 63 on dedicated compute), the host OS is still seeing all 96 cores, and as a result, NUMA is also seeing all the cores.

If you get all 3 nodes rebooted, NUMA should pick up the correct number of cores, but you may still need to make adjustments to the NUMA cell distribution. Then you’ll be able to tell how many cores are available in each cell, and take it from there.

### Successful Booting

Here’s an example of how to boot using a flavor with 24VCPU:
```
root@ds0013:~/test# nova flavor-delete m1.numatest
root@ds0013:~/test# nova flavor-create m1.numatest 9999 4096 10 24
+------+-------------+-----------+------+-----------+------+-------+-------------+-----------+
| ID   | Name        | Memory_MB | Disk | Ephemeral | Swap | VCPUs | RXTX_Factor | Is_Public |
+------+-------------+-----------+------+-----------+------+-------+-------------+-----------+
| 9999 | m1.numatest | 4096      | 10   | 0         |      | 24    | 1.0         | True      |
+------+-------------+-----------+------+-----------+------+-------+-------------+-----------+
root@ds0013:~# nova flavor-key 9999 set hw:cpu_policy=dedicated
root@ds0013:~# nova flavor-key 9999 set hw:numa_nodes=2
root@ds0013:~# nova flavor-key 9999 set hw:cpu_maxsockets=2
root@ds0013:~/test# nova boot --image ubuntu-14.04 \
> --flavor m1.numatest \
> --security-groups bbg-sina \
> --key testuser \
> --nic net-id=`neutron net-show internal | grep '| id' | awk '{print $4}'` \
> numatest --poll
root@ds0013:~/test# nova show numatest | grep status
| status                               | ACTIVE                                                   |
```
Once you’ve SSH'd into the VM and install `numactl` you’ll able to see some promising output:
```
root@numatest:~# numactl -H
available: 2 nodes (0-1)
node 0 cpus: 0 1 2 3 4 5 6 7 8 9 10 11
node 0 size: 2000 MB
node 0 free: 1731 MB
node 1 cpus: 12 13 14 15 16 17 18 19 20 21 22 23
node 1 size: 1949 MB
node 1 free: 1814 MB
node distances:
node   0   1
  0:  10  20
  1:  20  10
```
After looking at the previous example, hopefully, you should have an idea of how to proceed.

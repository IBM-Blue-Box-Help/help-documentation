Every situation is different, so it's tough to provide a template that would work for all network failures, but here are some starters.  These are best done, if possible, _while_ the trouble is occurring:

Please provide:
* Source IP:
* Destination IP:
* Virtual machine names/UUIDs involved, and datacenter location: 
* Problem was first noticed on [date/time/timezone]
* Problem [ ] is ongoing [ ] was resolved on [date/time/timezone]
* Any error messages seen

At Source IP, please:
* Perform 100 packet MTR from Source IP to Destination IP using UDP datagrams `mtr -r -u -c 100`
* Report results of `ip route get [destination IP]`
* Report results of `netstat -nr`
* If possible, do an nmap against the destination to see if the port is potentially being filtered by a firewall along the way.

At Destination IP, do the reverse:
* Perform a 100 packet MTR from the Destination back to the original Source. `mtr -r -u -c 100`
* Report results of `ip route get [back to source IP]`
* Report results of `netstat -nr`
* If possible, do an nmap against the source to see if the port is potentially being filtered by a firewall along the way.

Now isolate if the communication problem is constrained to 1 VM or many VMs in the same network:
* Spin up test VMs in the same networks as these IPs and try to reproduce the same problem.

Lastly:
* Check your security group settings for the VM(s) to see if they are as you expect and check with teammates to see if any changes have been made to security groups or on the cluster recently.
* If applicable: Connect from a computer on a completely different network, or even a completely different cluster, if possible, to see if the same problem occurs.

That should be enough to get a handle on the problem, and either point you in the right direction for resolving it or provide enough info for us to check the right logs and have network engineers assist.

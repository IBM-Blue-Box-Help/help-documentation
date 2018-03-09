---
layout: page
title: Routers and Heat
dateAdded: September 26, 2016
author: Ulysses Kanigel 
tags: [heat, subnet pool, router, configuring, python]
---


**Q. When configuring a new router with Heat, how do you use a specific IP address from the router's assigned subnet pool?**

**A.**  This procedure is analogous to the way it is used in raw API calls. 

See https://gist.github.com/ulyssesbbg/0164c4b0141f2c180d5f1e6b226fa3de for an example.

 * First explicitly specify the subnet and network to be used (using, for example, the `private_net_id` and `private_subnet_id` parameters)
 * Then specify the IP address for each subnet used.


**Q. In Heat, how do you add a route to both the new router and the default-router?**

**A.** Formerly, there were a couple of ways to add a static route in Heat (**ExtraRoute** and **RouterRouter**), but those ways are deprecated because they are no longer supported upstream. You can still use Heat to put static routes in, but you need to put the route in `user_data`. If you prefer, you can also use the script that follows, which is invoked using the following command line syntax:

```
# ./router_route.py test-router2 add 10.0.0.0/24 172.16.0.2
Adding route to 10.0.0.0/24 via 172.16.0.2

# ./router_route.py test-router2 delete 10.0.0.0/24 172.16.0.2
Deleting route to 10.0.0.0/24 via 172.16.0.2

```
Here's the script:

```

#!/usr/bin/python

from keystoneauth1 import identity
from keystoneauth1 import session
from neutronclient.v2_0 import client
import os
import sys

if ( len( sys.argv ) < 5 ):
  print "Usage: " + sys.argv[0] + " <router_name_or_id> <[add|delete]> <destination> <nexthop>"
  exit( 254 )

router_id = sys.argv[1]
verb = sys.argv[2]
destination = sys.argv[3]
nexthop = sys.argv[4]

auth = identity.Password( auth_url = os.environ["OS_AUTH_URL"],
                          username = os.environ["OS_USERNAME"],
                          password = os.environ["OS_PASSWORD"],
                          project_name = os.environ["OS_PROJECT_NAME"],
                          project_domain_id = os.environ["OS_PROJECT_DOMAIN_NAME"],
                          user_domain_id = os.environ["OS_USER_DOMAIN_NAME"] )

sess = session.Session( auth = auth )
neutron = client.Client( session = sess )

for router in neutron.list_routers()["routers"]:
  if ( router["name"] == router_id or router["id"] == router_id ):

    if ( verb == "add" ):
      print "Adding route to " + destination + " via " + nexthop
      router["routes"].append( { "destination": destination, "nexthop": nexthop } )

    elif ( verb == "delete" ):
      index = 0

      for route in router["routes"]:
        if ( route["destination"] == destination and route["nexthop"] == nexthop ):
          print "Deleting route to " + destination + " via " + nexthop
          router["routes"].pop( index )

        index += 1

    neutron.update_router( router["id"], { "router": { "routes": router["routes"] } } )
    
```

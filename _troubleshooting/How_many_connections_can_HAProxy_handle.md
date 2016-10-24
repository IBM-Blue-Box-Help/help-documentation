---
layout: page
author: Lampros Chaidas
title: How Many Simultaneous Connections can HAProxy Handle?
editor: Leslie Lundquist
tags: [troubleshooting, haproxy, maxconn, load testing]
dateAdded: October 21, 2016
featured: TRUE
weight: 3
---

**Please Note:** This article is NOT specifically related to OpenStack Neutron LBaaS, only to HAProxy running inside instances.

Recently, I was looking at a customer's load balancing configuration. While examining the HAProxy states page with the customer, the question came up: "How many simultaneous connections can they really support?" 

Does the maximum connections per backend server really matter? This article covers a way to determine the number of simultaneous connections that [HAProxy](http://www.haproxy.org/) can handle.

We’ll install HAProxy on a **CentOS 6 VPS** and run a series of tests to find the answer. On a different VPS, we'll set up our benchmarking utility. 

## Requirements: 

 * 2x CentOS 6.x VPS 

The specifications for the VPS's that I used in those tests were:

  * 2GB RAM
  * 2 Cores
  * CentOS 6.7 
 
## Installing HAProxy on the HAProxy VPS:

Step 1. Install the HAProxy [IUS (Inline with Upstream Stable) repo](https://ius.io/) for **CentOS 6**:

  ```
  yum -y install https://centos6.iuscommunity.org/ius-release.rpm
  ```

Step 2. Then get the latest version of HAProxy - at the time of writing that is `1.6.9`.

  ```
  yum -y install haproxy16u && chkconfig haproxy on
  ```

Step 3. Move your default HAproxy configuration somewhere else, in case you need to review it later:

  ```
  mv /etc/haproxy/haproxy.cfg /etc/haproxy/haproxy.cfg-default
  ```

Step 4. Configure [rsyslog](http://www.rsyslog.com/) to receive logs from HAProxy:

  ```
  sed -i -- 's/#$ModLoad imudp/$ModLoad imudp/g' /etc/rsyslog.conf
  sed -i -- 's/#$UDPServerRun 514/$UDPServerRun 514/g' /etc/rsyslog.conf
  echo "\$UDPServerAddress 127.0.0.1" >> /etc/rsyslog.conf
  echo "local2.* -/var/log/haproxy.log" >> /etc/rsyslog.conf
  ```

The previous commands set `rsyslog` to listen to UDP port `514` and limit it to `localhost` connections only. The last line sets the HAProxy logs to go `/var/log/haproxy.log`.

Step 5. Restart `rsyslog` so that the changes take effect:

  ```
  service rsyslog restart
  ```

Step 6. Add a new HAProxy configuration - `/etc/haproxy/haproxy.cfg` - note the `maxconn 20` line. Per the [manual page](https://cbonte.github.io/haproxy-dconv/1.6/configuration.html#maxconn) “Proxies will stop accepting connections when this limit is reached.” In other words, this configuration allows us only up to **20** connections at the same time.

What is the `fullconn 20` line? From the [manual page](https://cbonte.github.io/haproxy-dconv/1.6/configuration.html#4-fullconn) it's defined as “the number of connections on the backend which will make the servers use the maximal number of connections.”

```
global
daemon
# we need the socket for hatop statistics
stats socket /var/run/haproxy.sock mode 600 level admin
log /dev/log local4
maxconn 20

defaults
log global
timeout connect 4000
timeout client 42000
timeout server 43000

listen lampros-pool-1
bind *:80
mode http
balance roundrobin
fullconn 20
server go_http_server_1 127.0.0.1:8080 cookie go_http_server_1 check inter 2000 rise 2 fall 3

```

## Installing the Go language - Do this on both servers:

Install the Go language along with the `screen` utility and `git`. We need this language on both servers because, on the HAProxy VPS, we'll compile a very basic application server. On the benchmarker VPS, we need Go so we can run the [gobench](https://github.com/cmpxchg16/gobench) benchmarker utility.

```
yum -y install git screen nc
cd /tmp
wget https://storage.googleapis.com/golang/go1.7.linux-amd64.tar.gz
tar -xvf go1.7.linux-amd64.tar.gz
mv go /usr/local
export GOROOT=/usr/local/go
mkdir /root/goapps
export GOPATH=/root/goapps
export PATH=$PATH:$GOPATH/bin:$GOROOT/bin
echo export "GOPATH=/root/goapps" >> ~/.bashrc
echo export "export PATH=$PATH:$GOPATH/bin:$GOROOT/bin" >> ~/.bashrc
```

## On the HAProxy server we’ll set up a basic application server using Go:

Step 1. Create a directory called `/root/slowserver`

  ```
  mkdir -pv /root/slowserver
  ```

Step 2. Inside it, add a file called `/root/slowserver/slowserver.go` with the following contents:

```
package main

import (
    "fmt"
    "net/http"
    "time"
)

func slow_handler(w http.ResponseWriter, r *http.Request) {
    time.Sleep(3000 * time.Millisecond)
    fmt.Fprintf(w, "I'm slooooow")
}

func fast_handler(w http.ResponseWriter, r *http.Request) {
    fmt.Fprintf(w, "I'm FAST!!!!")
}

func main() {
    http.HandleFunc("/fast", fast_handler)
    http.HandleFunc("/slow", slow_handler)
    http.ListenAndServe(":8080", nil)
}
```

Step 3. Compile this file with `go build`:

  ```
  cd /root/slowserver
  go build
  ```

Step 4. Start our slowserver in a detached screen session, so that it stays in the background:

  ```
  screen -d -m -t go_slowserver /root/slowserver/slowserver
  ```

Step 5. Confirm that it’s running using `netstat -ntlp | grep slowserver` - you should see the port it's listening on as well as the process ID. This is the output I got:

  ```
  netstat -ntlp | grep slowserver
  tcp        0      0 :::8080                     :::*                        LISTEN      5204/slowserver
  ```

## On the HAProxy server setup HATop

Step 1. Download and install [HATop](http://feurix.org/projects/hatop/) so that we can monitor HAProxy:

  ```
  cd /tmp
  wget https://storage.googleapis.com/google-code-archive-downloads/v2/code.google.com/hatop/hatop-0.7.7.tar.gz
  tar -xzf hatop-0.7.7.tar.gz
  cd hatop-0.7.7
  install -m 755 bin/hatop /usr/local/bin
  install -m 644 man/hatop.1 /usr/local/share/man/man1
  gzip /usr/local/share/man/man1/hatop.1
  ```

Step 2. Start HAProxy:

  ```
  service haproxy start
  ```

Step 3. Start HAtop:

  ```
  hatop -s /var/run/haproxy.sock
  ```

Step 4. Now let’s use a one-liner to ask HAProxy for the status of our backend server **go_http_server_1**:

  ```
  echo "show stat" | nc -U /var/run/haproxy.sock | awk -F, '/go_http_server/{print $18}'
  ```

You should get the following output:

  ```
  UP
  ```

## On the VPS that we'll run the tests from, do this:

Download the [gobench](https://github.com/cmpxchg16/gobench) benchmarker utility:

  ```
  go get github.com/cmpxchg16/gobench
  ```

## Load testing - Does the maximum connections per backend server really matter? (no artificial delay)

For our first test, we'll try to determine whether the `fullconn` setting has any effect on the results. On the first run, we'll set `fullconn` to `20` and on the second run we'll set it to `1`. We'll calibrate the test for `30` seconds worth of benchmarking using `20` fast clients (no artificial delay):

* **maxconn** 20
* **fullconn** 20
* **seconds** 30
* **connections** 20
* **fast/slow** fast

```
gobench -u http://10.42.226.10/fast -c 20 -t 30
```

**Results:**

```
Dispatching 20 clients
Waiting for results...

Requests:                           627867 hits
Successful requests:                627867 hits
Network failed:                          0 hits
Bad requests failed (!2xx):              0 hits
Successful requests rate:            20928 hits/sec
Read throughput:                   2699828 bytes/sec
Write throughput:                  1841801 bytes/sec
Test time:                              30 sec
```

Now, before we run it again, we'll modify HAProxy's configuration and set `fullconn` to `1`. We do this task using `sed` and then reload HAProxy:

```
sed -i -- 's/fullconn 20/fullconn 1/g' /etc/haproxy/haproxy.cfg
/etc/init.d/haproxy reload
```

To summarize: 

* **maxconn** 20
* **fullconn** 1
* **seconds** 30
* **connections** 20
* **fast/slow** fast

Now run the same test again:

```
gobench -u http://10.42.226.10/fast -c 20 -t 30
```

**Results:**

```
gobench -u http://10.42.226.10/fast -c 20 -t 30
Dispatching 20 clients
Waiting for results...

Requests:                           527141 hits
Successful requests:                527141 hits
Network failed:                          0 hits
Bad requests failed (!2xx):              0 hits
Successful requests rate:            17571 hits/sec
Read throughput:                   2266727 bytes/sec
Write throughput:                  1546353 bytes/sec
Test time:                              30 sec
```

As you can see: in the first test, we got 20928 hits/sec, while on the second test we got 17571 hits/sec. What if the application server was slow, though, and it took 3 seconds to reply each time? 

## Load testing - Does the maximum connections per backend server really matter? (3 seconds of artificial delay)

* **maxconn** 20
* **fullconn** 20
* **seconds** 30
* **connections** 20
* **fast/slow** slow

We'll change the `fullconn` back to `20` before we begin:

```
sed -i -- 's/fullconn 1/fullconn 20/g' /etc/haproxy/haproxy.cfg
/etc/init.d/haproxy restart
```

Test again:

```
gobench -u http://10.42.226.10/slow -c 20 -t 30
```

**Results:**

```
gobench -u http://10.42.226.10/slow -c 20 -t 30
Dispatching 20 clients
Waiting for results...

Requests:                              180 hits
Successful requests:                   180 hits
Network failed:                          0 hits
Bad requests failed (!2xx):              0 hits
Successful requests rate:                6 hits/sec
Read throughput:                       774 bytes/sec
Write throughput:                      586 bytes/sec
Test time:                              30 sec
```

Change the `fullconn` back to `1` and test again:

```
sed -i -- 's/fullconn 20/fullconn 1/g' /etc/haproxy/haproxy.cfg
/etc/init.d/haproxy restart
```

* **maxconn** 20
* **fullconn** 1
* **seconds** 30
* **connections** 20
* **fast/slow** slow

```
gobench -u http://10.42.226.10/slow -c 20 -t 30
```

**Results:**

```
Dispatching 20 clients
Waiting for results...

Requests:                              180 hits
Successful requests:                   180 hits
Network failed:                          0 hits
Bad requests failed (!2xx):              0 hits
Successful requests rate:                6 hits/sec
Read throughput:                       774 bytes/sec
Write throughput:                      586 bytes/sec
Test time:                              30 sec
```

## Conclusion : Load testing - Does the maximum connections per backend server really matter?

The answer is yes. It matters, but only when the servers are fast. With slow servers, we saw no difference in our results. 

## Load testing - Determining the number of simultaneous connections HAProxy can handle

Now let's see how many simultaneous connections HAProxy can handle. Before we begin, let's not forget one basic detail regarding HAProxy: ["By default HAProxy operates in keep-alive mode with regard to persistent connections: for each connection it processes each request and response, and it leaves the connection idle on both sides between the end of a response and the start of a new request."](https://cbonte.github.io/haproxy-dconv/1.6/configuration.html#1.1)

This statement means that long-running connections will have a greater impact on the server than short-lived ones. As such, we'll run the tests against the "slow" function of our application server. 

* **maxconn** 20
* **fullconn** 20
* **seconds** 30
* **connections** 20
* **fast/slow** slow

```
gobench -u http://10.42.226.10/slow -c 20 -t 30
```

**Results:**

```
Dispatching 20 clients
Waiting for results...

Requests:                              180 hits
Successful requests:                   180 hits
Network failed:                          0 hits
Bad requests failed (!2xx):              0 hits
Successful requests rate:                6 hits/sec
Read throughput:                       774 bytes/sec
Write throughput:                      586 bytes/sec
Test time:                              30 sec
```

We see `6 hits/sec` and no errors reported. Let's try again with 5 times as many clients (100).

* **maxconn** 20
* **fullconn** 20
* **seconds** 30
* **connections** 100
* **fast/slow** slow

```
gobench -u http://10.42.226.10/slow -c 100 -t 30
```

**Results:**

```
Dispatching 100 clients
Waiting for results...

Requests:                              266 hits
Successful requests:                   180 hits
Network failed:                         86 hits
Bad requests failed (!2xx):              0 hits
Successful requests rate:                6 hits/sec
Read throughput:                       774 bytes/sec
Write throughput:                     1120 bytes/sec
Test time:                              30 sec
```

We're still at `6 hits/sec` but this time there also are errors. Errors mean that our HAProxy configuration is at its limit, because the number of hits per second are no longer going up, and at the same time we're getting these errors. Let's try the same number of clients (100), but let's double the `maxconns` and see what happens:

* **maxconn** 40
* **fullconn** 20
* **seconds** 30
* **connections** 100
* **fast/slow** slow

**Results:**

```
gobench -u http://10.42.226.10/slow -c 100 -t 30
Dispatching 100 clients
Waiting for results...

Requests:                              426 hits
Successful requests:                   360 hits
Network failed:                         66 hits
Bad requests failed (!2xx):              0 hits
Successful requests rate:               12 hits/sec
Read throughput:                      1548 bytes/sec
Write throughput:                     1630 bytes/sec
Test time:                              30 sec
```

As expected from our previous tests, the `fullconn` didn't really limit us. By doubling the `maxconns` we got exactly double the hit rate (`12 hits/sec`), although we are still getting errors, which means that our HAProxy configuration is still over its limit. 

Let's raise `maxconns` again - this time to `60`:

* **maxconn** 60
* **fullconn** 20
* **seconds** 30
* **connections** 100
* **fast/slow** slow

```
gobench -u http://10.42.226.10/slow -c 100 -t 30
Dispatching 100 clients
Waiting for results...

Requests:                              595 hits
Successful requests:                   540 hits
Network failed:                         55 hits
Bad requests failed (!2xx):              0 hits
Successful requests rate:               18 hits/sec
Read throughput:                      2322 bytes/sec
Write throughput:                     2179 bytes/sec
Test time:                              30 sec
```

As you can see, each time we raise the `maxconn` limit, we are seeing a linear increase on the `hits/sec`. Let's keep it going until we see the errors stop:

* **maxconn** 80
* **fullconn** 20
* **seconds** 30
* **connections** 100
* **fast/slow** slow

**Results:**

```
gobench -u http://10.42.226.10/slow -c 100 -t 30
Dispatching 100 clients
Waiting for results...

Requests:                              760 hits
Successful requests:                   720 hits
Network failed:                         40 hits
Bad requests failed (!2xx):              0 hits
Successful requests rate:               24 hits/sec
Read throughput:                      3096 bytes/sec
Write throughput:                     2698 bytes/sec
Test time:                              30 sec
```

* **maxconn** 100
* **fullconn** 20
* **seconds** 30
* **connections** 100
* **fast/slow** slow

**Results:**

```
gobench -u http://10.42.226.10/slow -c 100 -t 30
Dispatching 100 clients
Waiting for results...

Requests:                              900 hits
Successful requests:                   900 hits
Network failed:                          0 hits
Bad requests failed (!2xx):              0 hits
Successful requests rate:               30 hits/sec
Read throughput:                      3870 bytes/sec
Write throughput:                     2933 bytes/sec
Test time:                              30 sec
```

## Conclusion: Load testing - Determining the number of simultaneous connections HAProxy can handle

The conclusion we can draw from the previous experiment is that, in order to test capacity (max number of clients connected to HAProxy), we need to use a server that opens a TCP connection but holds it open for an extended period of time (3 seconds). This is the opposite of testing how fast a server is--where the more traffic you can push through it, the better results you’ll get. 

The second conclusion is that your max connections (`maxconn`) needs to be greater than the request rate (for example 100 clients) * time (3 seconds) to serve each request.

For example:

`maxconn`=100*3 => `maxconn`=300

## Sources:

* [Percona - HAProxy: Give me some logs on CentOS  6.5!](https://www.percona.com/blog/2014/10/03/haproxy-give-me-some-logs-on-centos-6-5/)
* [Setting up HAProxy with Transparent Mode on Centos 6.x](http://www.loadbalancer.org/uk/blog/setting-up-haproxy-with-transparent-mode-on-centos-6-x)
* [The Go Programming Language - Writing Web Applications](https://golang.org/doc/articles/wiki/)
* [Stack Exchange - Run script in a screen](http://unix.stackexchange.com/a/267794)
* [TecAdmin.net - How to Install Go 1.7 on CentOS/RHEL 7/6/5](http://tecadmin.net/install-go-on-centos/)
* [Feurix Free Open Source Projects - HATop](http://feurix.org/projects/hatop/)
* [Serverlab - Monitoring HAProxy using HATOP](http://www.serverlab.ca/tutorials/linux/network-services/monitoring-haproxy-using-hatop/)
* [Github.com - GoBench -  HTTP/HTTPS load testing and benchmarking tool](https://github.com/cmpxchg16/gobench)

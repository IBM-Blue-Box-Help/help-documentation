---
layout: page
title:  "Setting up OpenVPN server on your instance"
tags: [getting started, setting up openVPN]
author: Jason Kennedy
dateAdded: January 7th, 2016
featured: true
---

When you need to connect to your internal Bluemix Private Cloud instances, but either you don't have the available floating IP addresses or you prefer to not put those virtual machines on the internet, one recourse is to establish a bastion host with OpenVPN running on it. That way, you can connect and pass through the host to your internal network. In this article, you'll learn how to install and set up your OpenVPN server and client for the connection.
Assume that you're already running a virtual machine that has a floating IP allocated to it. We're not going to discuss setting up ufw or go into any hardened of linux, this how-to is strictly about getting OpenVPN up and running on an instance hosted on OpenStack. For the purpose of this example, we're using Ubuntu 14.04.

Complete these steps for your server-side setup.

## Step 1 - OpenVPN Configuration

Before we install any packages, first we'll update Ubuntu's repository lists.
{% highlight bash %}
apt-get update
{% endhighlight %}

Then we can install OpenVPN and Easy-RSA.
{% highlight bash %}
apt-get install openvpn easy-rsa
{% endhighlight %}

The example VPN server configuration file needs to be extracted to `/etc/openvpn` so we can incorporate it into our setup. This extraction can be done with one command:
{% highlight bash %}
gunzip -c /usr/share/doc/openvpn/examples/sample-config-files/server.conf.gz > /etc/openvpn/server.conf
{% endhighlight %}

Once extracted, open `server.conf` in a text editor. This tutorial will use **Vim** but you can use whichever editor you prefer.
{% highlight bash %}
vim /etc/openvpn/server.conf
{% endhighlight %}

There are several changes to make in this file. You will see a section looking like this:
{% highlight bash %}
# Diffie hellman parameters.
# Generate your own with:
#   openssl dhparam -out dh1024.pem 1024
# Substitute 2048 for 1024 if you are using
# 2048 bit keys.
dh dh1024.pem
{% endhighlight %}

Edit `dh1024.pem` to say `dh2048.pem`

This change will double the RSA key length used when generating server and client keys.

Still in the `server.conf` file, now look for this section:

{% highlight bash %}
# If enabled, this directive will configure
# all clients to redirect their default
# network gateway through the VPN, causing
# all IP traffic such as web browsing and
# and DNS lookups to go through the VPN
# (The OpenVPN server machine may need to NAT
# or bridge the TUN/TAP interface to the internet
# in order for this to work properly).
;push "redirect-gateway def1 bypass-dhcp"
{% endhighlight %}

Uncomment `push "redirect-gateway def1 bypass-dhcp"` so the VPN server passes on clients' web traffic to its destination. The line should look like this when done:

{% highlight bash %}
push "redirect-gateway def1 bypass-dhcp"
{% endhighlight %}
The next edit to make is in this area of the file:

{% highlight bash %}
# Certain Windows-specific network settings
# can be pushed to clients, such as DNS
# or WINS server addresses.  CAVEAT:
# http://openvpn.net/faq.html#dhcpcaveats
# The addresses below refer to the public
# DNS servers provided by opendns.com.
;push "dhcp-option DNS 208.67.222.222"
;push "dhcp-option DNS 208.67.220.220"
{% endhighlight %}

Uncomment `push "dhcp-option DNS 208.67.222.222"` and `push "dhcp-option DNS 208.67.220.220"`. The entries should look like this when done:
{% highlight bash %}
push "dhcp-option DNS 208.67.222.222"
push "dhcp-option DNS 208.67.220.220"
{% endhighlight %}

This entry tells the server to push **OpenDNS** to connected clients for DNS resolution where possible. Using push can help prevent DNS requests from leaking outside the VPN connection. However, it's important to specify desired DNS resolvers in client devices as well. Though **OpenDNS** is the default used by **OpenVPN**, you can use whichever DNS services you prefer.

The last area to change in the `server.conf` file is here:

{% highlight bash %}
# You can uncomment this out on
# non-Windows systems.
;user nobody
;group nogroup
{% endhighlight %}

Uncomment `user nobody` and `group nogroup`. The entry should look like this when done:

{% highlight bash %}
user nobody
group nogroup
{% endhighlight %}

By default, **OpenVPN** runs as the root user and thus has full root access to the system. Instead, confine **OpenVPN** to the `user nobody` and `group nogroup`, which is an unprivileged user with no default login capabilities, often reserved for running untrusted applications such as web-facing servers.

Now save your changes and exit **Vim**.

### Packet Forwarding

We need  a `sysctl` setting that tells the server's kernel to forward traffic from client devices out to the Internet. Otherwise, the traffic will stop at the server. Enable packet forwarding during runtime by entering this command:

{% highlight bash %}
echo 1 > /proc/sys/net/ipv4/ip_forward
{% endhighlight %}

We now need to make this forwarding permanent, so the server still forwards traffic after rebooting.

{% highlight bash %}
vim /etc/sysctl.conf
{% endhighlight %}

Near the top of the `sysctl` file, you will see:

{% highlight bash %}
# Uncomment the next line to enable packet forwarding for IPv4
#net.ipv4.ip_forward=1
{% endhighlight %}

Uncomment net.ipv4.ip_forward. The line should look like this when done:
{% highlight bash %}
# Uncomment the next line to enable packet forwarding for IPv4
net.ipv4.ip_forward=1
{% endhighlight %}

Save your changes and exit **Vim**.

### Uncomplicated Firewall (ufw)

`ufw` is a front-end for iptables. Setting up `ufw` is not difficult. It's included by default in Ubuntu 14.04, so we only need to make a few rules and configuration edits, then switch the firewall on. As a reference for more uses for `ufw`, see **How To Set up a Firewall with UFW on an Ubuntu and Debian Cloud Server**.

First, set `ufw` to allow SSH. In the command prompt, enter:

{% highlight bash %}
ufw allow ssh
{% endhighlight %}

This tutorial will use **OpenVPN** over UDP, so ufw must also allow UDP traffic over port 1194.

{% highlight bash %}
ufw allow 1194/udp
{% endhighlight %}

The `ufw` forwarding policy needs to be set as well. We'll do this in ufw's primary configuration file.

{% highlight bash %}
vim /etc/default/ufw
{% endhighlight %}
Look for `DEFAULT_FORWARD_POLICY="DROP"`. This entry must be changed from `DROP` to `ACCEPT.` The entry should look like this when done:
{% highlight bash %}
DEFAULT_FORWARD_POLICY="ACCEPT"
{% endhighlight %}

Next we will add additional `ufw` rules for network address translation and IP masquerading of connected clients.
{% highlight bash %}
vim /etc/ufw/before.rules
{% endhighlight %}
Make the top of your `before.rules` file look like the example that follows. The area in red for `OPENVPN RULES` must be added:

{% highlight bash %}
#
# rules.before
#
# Rules that should be run before the ufw command line added rules. Custom
# rules should be added to one of these chains:
#   ufw-before-input
#   ufw-before-output
#   ufw-before-forward
#

# START OPENVPN RULES
# NAT table rules
*nat
:POSTROUTING ACCEPT [0:0]
# Allow traffic from OpenVPN client to eth0
-A POSTROUTING -s 10.8.0.0/8 -o eth0 -j MASQUERADE
COMMIT
# END OPENVPN RULES

# Don't delete these required lines, otherwise there will be errors
*filter
{% endhighlight %}

With the changes made to `ufw`, we can now enable it. Enter into the command prompt:

{% highlight bash %}
ufw enable
{% endhighlight %}

Enabling `ufw` will return the following prompt:

{% highlight bash %}
Command may disrupt existing ssh connections. Proceed with operation (y|n)?
{% endhighlight %}

Answer `y`. The result will be this output:

{% highlight bash %}
Firewall is active and enabled on system startup
{% endhighlight %}

To check ufw's primary firewall rules:
{% highlight bash %}
ufw status
{% endhighlight %}

The status command should return these results:

{% highlight bash %}
Status: active

To                         Action      From
--                         ------      ----
22                         ALLOW       Anywhere
1194/udp                   ALLOW       Anywhere
22 (v6)                    ALLOW       Anywhere (v6)
1194/udp (v6)              ALLOW       Anywhere (v6)
{% endhighlight %}


## Step 2 - Creating a Certificate Authority and Server-Side Certificate & Key

**OpenVPN** uses certificates to encrypt traffic.

### Configure and Build the Certificate Authority

It is now time to set up our own Certificate Authority (CA) and generate a certificate and key for the **OpenVPN** server. **OpenVPN** supports bidirectional authentication based on certificates, meaning that the client must authenticate the server certificate and the server must authenticate the client certificate before mutual trust is established. We will use Easy RSA's scripts we copied earlier to do this.

First, copy over the Easy-RSA generation scripts.
{% highlight bash %}
cp -r /usr/share/easy-rsa/ /etc/openvpn
{% endhighlight %}

Then make the key storage directory.

{% highlight bash %}
mkdir /etc/openvpn/easy-rsa/keys
{% endhighlight %}

Easy-RSA has a variables file we can edit to create certificates exclusive to our person, business, or whatever entity we choose. This information is copied to the certificates and keys, and it will help identify the keys later.

{% highlight bash %}
vim /etc/openvpn/easy-rsa/vars
{% endhighlight %}

The variables below should be changed according to your preference.

{% highlight bash %}
export KEY_COUNTRY="US"
export KEY_PROVINCE="TX"
export KEY_CITY="Dallas"
export KEY_ORG="My Company Name"
export KEY_EMAIL="sammy@example.com"
export KEY_OU="MYOrganizationalUnit"
{% endhighlight %}

In the same vars file, also edit this one line shown below. For simplicity, we will use server as the key name. If you want to use a different name, you would also need to update the **OpenVPN** configuration files that reference `server.key` and `server.crt`.

{% highlight bash %}
export KEY_NAME="server"
{% endhighlight %}

We need to generate the Diffie-Hellman parameters; this can take several minutes.

{% highlight bash %}
openssl dhparam -out /etc/openvpn/dh2048.pem 2048
{% endhighlight %}

Now let's change directories so that we're working directly out of where we moved Easy-RSA's scripts to earlier in Step 2.

{% highlight bash %}
cd /etc/openvpn/easy-rsa
{% endhighlight %}

Initialize the PKI (Public Key Infrastructure). Pay attention to the dot (.) and space in front of `./varscommand`. That signifies the current working directory (source).

{% highlight bash %}
. ./vars
{% endhighlight %}

The output from the above command is shown below. Since we haven't generated anything in the keysdirectory yet, the warning is nothing to be concerned about.

NOTE: If you run `./clean-all`, I will be doing a `rm -rf` on `/etc/openvpn/easy-rsa/keys`
Now we'll clear the working directory of any possible old or example keys to make way for our new ones.

{% highlight bash %}
./clean-all
{% endhighlight %}

This final command builds the certificate authority (CA) by invoking an interactive **OpenSSL** command. The output will prompt you to confirm the Distinguished Name variables that were entered earlier into the Easy-RSA's variable file (country name, organization, etc.).

{% highlight bash %}
./build-ca
{% endhighlight %}

Simply press ENTER to pass through each prompt. If something must be changed, you can do that from within the prompt.

### Generate a Certificate and Key for the Server

Still working from `/etc/openvpn/easy-rsa`, now enter the command to build the server's key. Where you see server marked in red is the export `KEY_NAME` variable we set in Easy-RSA's vars file earlier in Step 2.

{% highlight bash %}
./build-key-server server
{% endhighlight %}

Similar output is generated as when we ran `./build-ca`, and you can again press ENTER to confirm each line of the Distinguished Name. However, this time there are two additional prompts:

{% highlight bash %}
Please enter the following 'extra' attributes
to be sent with your certificate request
A challenge password []:
An optional company name []:
{% endhighlight %}

Both should be left blank, so just press ENTER to pass through each one.

Two additional queries at the end require a positive (`y`) response:

{% highlight bash %}
Sign the certificate? [y/n]
1 out of 1 certificate requests certified, commit? [y/n]
{% endhighlight %}

The last prompt above should complete with:

{% highlight bash %}
Write out database with 1 new entries
Data Base Updated
{% endhighlight %}

### Move the Server Certificates and Keys

OpenVPN expects to see the server's CA, certificate and key in `/etc/openvpn`. Let's copy them into the proper location.

{% highlight bash %}
cp /etc/openvpn/easy-rsa/keys/{server.crt,server.key,ca.crt} /etc/openvpn
{% endhighlight %}

You can verify the copy operation was successful with this command:

{% highlight bash %}
ls /etc/openvpn
{% endhighlight %}

You should see the certificate and key files for the server.

At this point, the **OpenVPN** server is ready to go. Start it and check the status.

{% highlight bash %}
service openvpn start
service openvpn status
{% endhighlight %}

The status command should return this result:

{% highlight bash %}
VPN 'server' is running
{% endhighlight %}

Congratulations! Your OpenVPN server is operational.

If the status message says the VPN is not running, take a look at the `/var/log/syslog file` for errors such as:

{% highlight bash %}
Options error: --key fails with 'server.key': No such file or directory
{% endhighlight %}

That error indicates that `server.key` was not copied to `/etc/openvpn` correctly. Re-copy the file and try again.


## Step 3 - Generate Certificates and Keys for Clients

So far we've installed and configured the **OpenVPN** server, created a Certificate Authority, and created the server's own certificate and key. In this step, we use the server's CA to generate certificates and keys for each client device that will be connecting to the VPN. These files later will be installed onto the client devices, such as a laptop or smartphone.

### Key and Certificate Building

It's ideal for each client connecting to the VPN to have its own unique certificate and key. This setup is preferable to generating one general certificate and key to use among all client devices.

**Note:** By default, **OpenVPN** does not allow simultaneous connections to the server from clients using the same certificate and key. (See `duplicate-cn` in `/etc/openvpn/server.conf`.)

To create separate authentication credentials for each device you intend to connect to the VPN, you should complete this step for each device, but change the name `client1` below to something different such as `client2` or `iphone2`. With separate credentials per device, they can later be deactivated at the server individually, if need be. The remaining examples in this tutorial will use `client1` as our example client device's name.

As we did with the server's key, now we build one for our `client1` example. You should still be working out of `/etc/openvpn/easy-rsa`.

{% highlight bash %}
./build-key client1
{% endhighlight %}

Once again, you'll be asked to change or confirm the Distinguished Name variables and these two prompts which should be left blank. Press ENTER to accept the defaults.

{% highlight bash %}
Please enter the following 'extra' attributes
to be sent with your certificate request
A challenge password []:
An optional company name []:
{% endhighlight %}

As before, these two confirmations at the end of the build process require a (`y`) response:

{% highlight bash %}
Sign the certificate? [y/n]
1 out of 1 certificate requests certified, commit? [y/n]
{% endhighlight %}

If the key build was successful, the output will again be:

{% highlight bash %}
Write out database with 1 new entries
Data Base Updated
{% endhighlight %}

The example client configuration file should be copied to the Easy-RSA key directory too. We'll use it as a template which will be downloaded to client devices for editing. In the copy process, we are changing the name of the example file from `client.conf` to `client.ovpn` because the `.ovpn` file extension is what the clients will expect to use.

{% highlight bash %}
cp /usr/share/doc/openvpn/examples/sample-config-files/client.conf /etc/openvpn/easy-rsa/keys/client.ovpn
{% endhighlight %}

You can repeat this section again for each client, replacing `client1` with the appropriate client name throughout.

### Transferring Certificates and Keys to Client Devices

Recall from the steps above that we created the client certificates and keys, and that they are stored on the **OpenVPN** server in the `/etc/openvpn/easy-rsa/keys` directory.

For each client we need to transfer the client certificate, key, and profile template files to a folder on our local computer or another client device.

In this example, our `client1` device requires its certificate and key, located on the server in:

{% highlight bash %}
/etc/openvpn/easy-rsa/keys/client1.crt
/etc/openvpn/easy-rsa/keys/client1.key
{% endhighlight %}

The `ca.crt` and `client.ovpn` files are the same for all clients. Download these two files as well; notice that the `ca.crt` file is in a different directory than the others.

{% highlight bash %}/etc/openvpn/easy-rsa/keys/client.ovpn
/etc/openvpn/ca.crt
{% endhighlight %}

While the exact applications used to accomplish this transfer will depend on your choice and device's operating system, you want the application to use SFTP (SSH file transfer protocol) or SCP (Secure Copy) on the backend. This will transport your client's VPN authentication files over an encrypted connection.

Here is an example SCP command using our `client1` example. It places the file `client1.key` into the Downloads directory on the local computer.

{% highlight bash %}
scp root@your-server-ip:/etc/openvpn/easy-rsa/keys/client1.key Downloads/
{% endhighlight %}

Here are several tools and tutorials for securely transfering files from the server to a local computer:

WinSCP
How To Use SFTP to Securely Transfer Files with a Remote Server
How To Use Filezilla to Transfer and Manage Files Securely on your VPS

At the end of this section, make sure you have these four files on your client device:

{% highlight bash %}
client1.crt
client1.key
client.ovpn
ca.crt
{% endhighlight %}

## Step 4 - Creating a Unified OpenVPN Profile for Client Devices

There are several methods for managing the client files but the easiest uses a unified profile. This is created by modifying the client.ovpn template file to include the server's Certificate Authority, and the client's certificate and its key. Once merged, only the single client.ovpn profile needs to be imported into the client's OpenVPN application.

We will create a single profile for our client1 device on the local computer we downloaded all the client files to. This local computer could itself be an intended client or just a temporary work area to merge the authentication files. The original client.ovpn template file should be duplicated and renamed. How you do this will depend on the operating system of your local computer.

Note: The name of your duplicated client.ovpn doesn't need to be related to the client device. The client-side OpenVPN application will use the file name as an identifier for the VPN connection itself. Instead, you should duplicate client.ovpn to whatever you want the VPN's nametag to be in your operating system. For example: work.ovpn will be identified as work, school.ovpn as school, etc.

In this tutorial, we'll name the VPN connection Test1 so Test1.ovpn will be the file name referenced from this point on. Once named, we then must open Test1.ovpn in a text editor; you can use whichever editor you prefer.

The first area of attention will be for the IP address of your Droplet. Near the top of the file, change my-server-1 to reflect your VPN's IP.

{% highlight bash %}
# The hostname/IP and port of the server.
# You can have multiple remote entries
# to load balance between the servers.
remote my-server-1 1194
{% endhighlight %}

Next, find the area shown below and uncomment `user nobody` and `group nogroup`, just like we did in `server.conf` in Step 1. Note: This step doesn't apply to Windows so you can skip it. The entry should look like this when done:

{% highlight bash %}
# Downgrade privileges after initialization (non-Windows only)
user nobody
group nogroup
{% endhighlight %}

The area given below needs the three lines shown to be commented out so we can instead include the certificate and key directly in the `Test1.ovpn` file. It should look like this when done:

{% highlight bash %}
# SSL/TLS parms.
# . . .
#ca ca.crt
#cert client.crt
#key client.key
{% endhighlight %}

To merge the individual files into the one unified profile, the contents of the `ca.crt`, `client1.crt`, and `client1.key` files are pasted directly into the `.ovpn` profile using a basic XML-like syntax. The XML at the end of the file should take this form:

{% highlight bash %}
<ca>
(insert ca.crt here)
</ca>
<cert>
(insert client1.crt here)
</cert>
<key>
(insert client1.key here)
</key>
{% endhighlight %}

When finished, the end of the file should be similar to this abbreviated example:

{% highlight bash %}
<ca>
-----BEGIN CERTIFICATE-----
. . .
-----END CERTIFICATE-----
</ca>

<cert>
Certificate:
. . .
-----END CERTIFICATE-----
. . .
-----END CERTIFICATE-----
</cert>

<key>
-----BEGIN PRIVATE KEY-----
. . .
-----END PRIVATE KEY-----
</key>
{% endhighlight %}

The `client1.crt` file has some extra information in it; it's fine to just include the whole file.

Save the changes and exit. We now have a unified **OpenVPN** client profile to configure our `client1`.

 From here, we just need to feed the `.ovpn` file into the VPN client of our choice, whether that be Tunnelblick, Viscosity (both for OSX) or of your choice.

Before we test this, though, we need to make sure that OpenStack is prepared to allow this traffic to go through. Let's take a look at our instances:

{% highlight bash %}

$ nova list +--------------------------------------+----------------+--------+------------+-------------+--------------------------------------+
| ID | Name | Status | Task State | Power State | Networks | +--------------------------------------+----------------+--------+------------+-------------+--------------------------------------+
| 4f239959-be46-4fd3-963a-7c70db305d74 | jkbastion | ACTIVE | - | Running | internal=10.230.7.72, 173.247.105.20 | | 0d3c2002-ea02-4311-8142-b622f05407b4 | jkinternal-ssh | ACTIVE | - | Running | internal=10.230.7.68 | | 746e0ef8-48ee-4867-9c9d-e3d53a7e68bc | jkinternal-web | ACTIVE | - | Running | internal=10.230.7.69 | +--------------------------------------+----------------+--------+------------+-------------+--------------------------------------+
{% endhighlight %}

Formatting aside due to constrained space, what we have here are 3 instances; jkbastion, which has a floating IP, and also jkinternal-ssh and jkinternal-web, which obviously correlate to web and ssh (the web VM is running nginx).

Also, let's peek at our security groups, to make sure we're allowing UDP 1194 to our bastion host:

{% highlight bash %}
$ nova secgroup-list
+--------------------------------------+-----------+------------------------+
| Id                                   | Name      | Description            |
+--------------------------------------+-----------+------------------------+
| 55608023-c88e-4446-b67c-b64e741df5cb | default   | default                |
| f33a4643-4440-4649-8ba6-aef09b00b7f7 | jkbastion | bastion security group |
| dcec8a37-9541-4286-a4ad-0290a44efbae |  jksec    | Jason Kennedy's shiz   |
+------------------------------ --------+-----------+------------------------+
{% endhighlight %}

Details of jkbastion:

{% highlight bash %}
$ nova secgroup-list-rules f33a4643-4440-4649-8ba6-aef09b00b7f7
+-------------+-----------+---------+-----------+--------------+
| IP Protocol | From Port | To Port | IP Range  | Source Group |
+-------------+-----------+---------+-----------+--------------+
| tcp         | 22        | 22      | 0.0.0.0/0 |              |
| udp         | 1194      | 1194    | 0.0.0.0/0 |              |
+-------------+-----------+---------+-----------+--------------+
{% endhighlight %}

That should do it! With the VPN connected, you should be able to hit internal virtual machines with the services you need.  

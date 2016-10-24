---
layout: page
title: Ursula and OpenStack
author: Lampros Chaidas
editor: Leslie Lundquist
dateAdded: October 20, 2016
tags: [userdocs, openstack, ursula, ubuntu, playbooks]
weight: 3
featured: TRUE
---

## Ursula and OpenStack

Most of you probably are familiar with [OpenStack](http://www.openstack.org), but probably not everyone is familiar with [Ursula](https://github.com/blueboxgroup/ursula).  At IBM Blue Box, we use Ursula to install OpenStack cloud for our customers. Automated installation reduces user errors and results in faster, cleaner, more customizable OpenStack installations. This blog gets you started on understanding and working with Ursula. All of our Ursula playbooks are open source, and they are available on GitHub. Eventually, you could customize some for your own use.

### Ursula is: 

* The collection of Ansible playbooks that [Blue Box](https://github.com/blueboxgroup/ursula) created, to deploy and manage OpenStack cloud.

Ursula can be installed in two ways: one way is by using [Vagrant](https://www.vagrantup.com), and the other way is by "Manual Deployment." This post concentrates on the manual deployment method. 

Ursula comes with instructions on how to perform a manual deployment; however, those can be rather intimidating for newcomers to OpenStack. In this post, I'll share my experiences with installing Ursula, and give you some detailed instructions on how I did it, and how to troubleshoot it, in case you have difficulties.

### Requirements: Two Virtual Private Servers (VPS)

 * 1x VPS in which to set up Ansible. I chose to do this on a CentOS 6.x VPS. I used a 2GB, 2 core VPS.
 * 1x VPS to be used as the deployment target. This target has more specific requirements:
   * Ubuntu 14 LTS (Do not use Ubuntu 12 LTS.)
   * 8GB of RAM (It probably will deploy on less, but it may be quite slow.)
   * 4 cores
   * An IP address. In this example, the public IP of our VPS is 69.87.123.456 (which is obviously not a valid IP address!)

### Prepare the CentOS 6.x VPS
Ansible will use this CentOS VPS to install OpenStack on the Ubuntu one! Here are the steps:

Step 1. Install the [IUS (Inline with Upstream Stable)](https://ius.io/) repository. We do this so we can get Python 2.7 binaries:

  ```
  yum -y install https://centos6.iuscommunity.org/ius-release.rpm 
  ```

Step 2. Install the Python 2.7 packages and some dependencies:

  ```
  yum -y install python27 python27-devel python27-pip.noarch openssh-clients git libffi-devel openssl-devel screen gcc
  ```

Step 3. Create a Virtual Environment for Python. We’ll call it `ursula-python`:

  ```
  pip2.7 install virtualenv
  virtualenv -p /usr/bin/python2.7 ursula-python
  ```

Step 4. Activate the Virtual Environment:

  ```
  source ursula-python/bin/activate
  ```

Step 5. Use git to clone the Ursula repository and install its Python requirements:

  ```
  git clone https://github.com/blueboxgroup/ursula.git
  cd ~/ursula/
  pip2.7 install -r requirements.txt
  ```

Step 6. Set up an SSH configuration for the `allinone`. Note that you must already have set up SSH key authentication between the CentOS 6.x VPS and the Ubuntu target:

Edit or create `~/.ssh/config` and add the following information:

  ```
  Host allinone
    HostName 69.87.123.456 #replace with real IP
    User root
    IdentityFile /root/id_rsa #replace with your private key
    StrictHostKeyChecking no
    UserKnownHostsFile=/dev/null
  ```

The example above assumes that the username of your target Ubuntu 14 VPS is `root`, the IP is `69.87.123.456` and the private SSH key is located at `/root/id_rsa` -– change those as needed. 

### Fix/correct the SSL certificate that comes in `envs/example/defaults-2.0.yml`

Step 1. Confirm that the cert is broken by extracting it and examining it:

  ```
  cd ~/ursula/envs/example
  ```

Step 2. Extract the cert to the file `defaults2.0-cert.crt`

  ```
  cat defaults-2.0.yml  | grep crt: -A50 |grep -v crt: | grep "END CERTIFICATE-----" -B 50 | tr -d ' '> defaults2.0-cert.crt
  sed -i -- 's/-----BEGINCERTIFICATE-----/-----BEGIN CERTIFICATE-----'/g defaults2.0-cert.crt
  sed -i -- 's/-----ENDCERTIFICATE-----/-----END CERTIFICATE-----'/g defaults2.0-cert.crt
  ```

Step 3. Try to get details out of it:

  ```
  openssl x509 -in defaults2.0-cert.crt -text -noout
  unable to load certificate
  140483871201096:error:0D0680A8:asn1 encoding routines:ASN1_CHECK_TLEN:wrong tag:tasn_dec.c:1343:
  140483871201096:error:0D07803A:asn1 encoding routines:ASN1_ITEM_EX_D2I:nested asn1 error:tasn_dec.c:393:Type=X509
  140483871201096:error:0906700D:PEM routines:PEM_ASN1_read_bio:ASN1 lib:pem_oth.c:83:
  ```

As you can see from the error, this one is obviously broken and needs to be replaced.

Step 4. Generate a new self-signed certificate and private key. We'll use a fake hostname as the Common Name. In this case, the Common Name is `openstack.chaidas.com`. 

  ```
  cd /etc/ssl/
  openssl req -subj '/CN=openstack.chaidas.com/C=US' -new -newkey rsa:2048 -sha256 -days 365 -nodes -x509 -keyout   serverkey.pem -out server.crt
  ```

Step 5. Now replace the broken cert with this one you generated:

  ```
  cd ~/ursula/envs/example
  # Backup your defaults-2.0.yml file
  cp defaults-2.0.yml ~
  # Remove the old cert
  sed -i -- '/-----BEGIN CERTIFICATE-----/,/-----END CERTIFICATE-----/d' defaults-2.0.yml
  # Remove the old private key
  sed -i -- '/-----BEGIN RSA PRIVATE KEY-----/,/-----END RSA PRIVATE KEY-----/d' defaults-2.0.yml
  # Now tell the playbook to load the certificate and private key from the above files.
  sed -i -- 's!crt: |!crt: "{{ lookup(\x27'file\\x27',\x27'/etc/ssl/server.crt\\x27') }}"!g' defaults-2.0.yml 
  sed -i -- 's!key: |!key: "{{ lookup(\x27'file\\x27',\x27'/etc/ssl/serverkey.pem\\x27') }}"!g' defaults-2.0.yml 
  ```

Step 6. Make sure to change the FQDN to the one you just used for the Common Name (in this example, it is `openstack.chaidas.com`) . Do not skip this step, otherwise things will break, down the road! 

  ```
  sed -i -- 's!fqdn: openstack.example.com!fqdn: openstack.chaidas.com!g' defaults-2.0.yml
  ```

### Start the deployment

Step 1. Inside a screen session, run the `allinone` installation. Note that a successful deployment takes about 1 hour and 26 minutes on an 8GB, 4 Core VPS.

  ```
  screen
  source ursula-python/bin/activate
  cd ~/ursula
  ursula envs/example/allinone site.yml
  ```

Step 2. Once this process is done, you should be able to log in to Horizon by going to the IP address of your VPS (that would be the `69.87.123.456` in this example). The username is "**admin**" and the default password is "**asdf**".

Step 3. **Enjoy!**

## Common Errors and Resolutions

**ERROR 1: Packages not downloading due to SSL errors**

```
TASK [apt-repos : add any dependent repository keys from url] ******************
Thursday 13 October 2016  21:08:49 +0000 (0:00:11.179)       0:00:16.858 ******
fatal: [allinone]: FAILED! => {"failed": true, "msg": "The conditional check 'common.hwraid.enabled|bool and ansible_distribution_version == \"12.04\"' failed. The error was: {u'logs': [{u'paths': [u'/var/log/audit/audit.log'], u'tags': u'audit,common', u'type': u'syslog', u'fields': None}], u'ipmi': {u'baud_rate': 115200, u'enabled': False, u'state': 'probe', u'serial_console': u'ttyS1'}, u'setuptools_version': u'system', u'serial_console': {u'enabled': True, u'name': u'ttyS0'}, u'ssh': {u'allow_from': [u'0.0.0.0/0', u'::/0'], u'disable_dns': True, u'disable_root': False}, u'os_tuning_params_clean': [{u'name': u'net.ipv4.tcp_syncookies'}, {u'name': u'net.ipv4.tcp_synack_retries'}], u'monitoring': {u'scan_for_log_errors': False, u'sensu_checks': {u'check_static_route': {u'criticality': u'critical'}, u'vyatta': {u'tunnels': {u'criticality': u'critical'}}, u'check_lro': {u'warning': False, u'enabled': True, u'devices': u\"{{ hostvars[inventory_hostname][hostvars[inventory_hostname].primary_interface|remove_vlan_tag]|net_physical_devices|join(',') }}\"}, u'check_raid': {u'criticality': u'critical'}}}, u'packages_to_remove': [u'language-selector-common'], u'logging': {u'debug': False, u'verbose': True}, u'python_extra_packages': [], u'ssh_private_keys': [], u'ursula_monitoring': {u'path': u'/opt/ursula-monitoring', u'git_rev': u'master', u'git_repo': u'https://github.com/blueboxgroup/ursula-monitoring.git', u'tar_url': 'https://file-mirror.openstack.blueboxgrid.com/ursula-monitoring/2.2.5.tar.gz', u'method': 'tar', u'tar_version': '2.2.5'}, u'hwraid': {u'clients': [u'tw-cli', u'megacli'], u'enabled': True}, u'pip_version': u'8.0.2', u'system_tools': {u'mcelog': False}, u'ntpd': {'servers': []}}: template error while templating string: unexpected '/'. String: {{ lookup(file,/etc/ssl/server.crt) }}"}
```

**Fix with the following steps:**

1. On the target, delete the files under `/etc/apt/sources.list.d/apt_mirror_openstack_*` that is: `rm /etc/apt/sources.list.d/apt_mirror_openstack_*`

2. Back on the Ansible host, run this command: `sed -i -- 's!https://apt-mirror.openstack.blueboxgrid.com!http://apt-mirror.openstack.blueboxgrid.com!g' ~/ursula/envs/example/defaults-2.0.yml`

3. Re-run Ursula: `ursula envs/example/allinone site.yml`

**ERROR 2: The Keystone API cannot talk to Keystone**

```
TASK [keystone-setup : keystone tenants] ***************************************
Friday 14 October 2016  20:10:32 +0000 (0:00:03.005)       0:22:32.770 ********
failed: [allinone] (item=admin) => {"extra_data": null, "failed": true, "item": "admin", "msg": "Could not determine a suitable URL for the plugin"}
failed: [allinone] (item=service) => {"extra_data": null, "failed": true, "item": "service", "msg": "Could not determine a suitable URL for the plugin"}
failed: [allinone] (item=demo) => {"extra_data": null, "failed": true, "item": "demo", "msg": "Could not determine a suitable URL for the plugin"}
```

**Fix with these steps:**

Edit the file `~/ursula/envs/example/allinone/group_vars/all.yml`

**Make this change to the file:**

Find the line: `floating_ip: 172.16.0.100`

Change it to this:

![floating_ip_invisible_code.png]({{site/baseurl}}/img/floating_ip_invisible_code.png)

**ERROR 3: `uuid-runtime` package missing**

```
TASK [nova-data : generate really unique uuid] *********************************
Sunday 16 October 2016  02:28:52 +0000 (0:00:01.052)       0:25:53.449 ********
fatal: [allinone]: FAILED! => {"changed": false, "cmd": "uuidgen -t", "failed": true, "msg": "[Errno 2] No such file or directory", "rc": 2}
```

**Fix it in this way:**

1. Edit the file `~/ursula/roles/common/tasks/main.yml`

2. And add this line under the package listing:

    `- uuid-runtime`

### Sources:

* [ask.openstack.org - openstack Could not determine a suitable URL for the plugin](https://ask.openstack.org/en/question/67118/openstack-could-not-determine-a-suitable-url-for-the-plugin/)
* [superuser - How do I install uuidgen](http://superuser.com/a/621300)
* [stackoverflow - Escape single quote](http://stackoverflow.com/a/24509515)
* [Github - BlueBoxGroup/Ursula](https://github.com/blueboxgroup/ursula)

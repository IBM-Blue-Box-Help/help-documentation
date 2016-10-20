## Ursula and OpenStack

Most of you are probably familiar with [OpenStack](http://www.openstack.org), but probably not everyone is familiar with [Ursula](https://github.com/blueboxgroup/ursula).  At IBM Blue Box, we use Ursula to install OpenStack cloud for our customers. Automated installation reduces user errors and results in faster, cleaner, more customizable OpenStack installations. This blog gets you started on understanding and working with Ursula. All of our Ursula playbooks are open source, and they are available on GitHub. Eventually, you could customize some for your own use.

### Ursula is two things: 

1. The [Blue Box](https://www.blueboxcloud.com) fork of Ansible.
2. The [Blue Box](https://github.com/blueboxgroup/ursula) collection of Ansible playbooks that we created, to install OpenStack.

Ursula can be installed in two ways—one way is by using [Vagrant](https://www.vagrantup.com), and the other way is by "Manual Deployment". This post concentrates on the manual deployment method. 

Ursula comes with instructions on how to perform a manual deployment; however, those can be rather intimidating for newcomers to OpenStack. So, I'll share my experiences with installing it, and give you some detailed instructions on how I did it, and hoe to troubleshoot it, in case you have difficulties.

### Requirements: Two Virtual Private Servers (VPS)

 * 1x VPS in which to set up Ansible – I chose to do this on a CentOS 6.x VPS. I used a 2GB, 2 core VPS.
 * 1x VPS to be used as the deployment target—this target has more specific requirements:

  * Ubuntu 14 LTS (Do not use Ubuntu 12 LTS.)
  * 8GB of RAM (It probably will deploy on less, but it may be quite slow.)
  * 4 cores
  * An IP address. In this example the public IP of our VPS is 69.87.123.456 (which is obviously not a valid IP address!)

**We’ll prepare the CentOS 6.x VPS, and Ansible prepares the other one! Here are the steps:**

1. Install the IUS (Inline with Upstream Stable) repository. We do this so we can get Python 2.7 binaries:

```
yum -y install https://centos6.iuscommunity.org/ius-release.rpm 
```

2. Install the Python 2.7 packages and some dependencies:

```
yum -y install python27 python27-devel python27-pip.noarch openssh-clients git libffi-devel openssl-devel screen gcc
```

3. Create a Virtual Environment for Python. We’ll call it "ursula-python"

```
pip2.7 install virtualenv
virtualenv -p /usr/bin/python2.7 ursula-python
```

4. Activate the Virtual Environment.

```
source ursula-python/bin/activate
```

5. Use git to clone the Ursula repository and install its Python requirements:

```
git clone https://github.com/blueboxgroup/ursula.git
cd ~/ursula/
pip2.7 install -r requirements.txt
```

6. Set up an SSH configuration for the `allinone`. Note that you must already have set up SSH key authentication between the CentOS 6.x VPS and the Ubuntu target:

Edit or create ~/.ssh/config and add the following:

```
Host allinone
  HostName 69.87.123.456 #replace with real IP
  User root
  IdentityFile /root/id_rsa #replace with your private key
  StrictHostKeyChecking no
  UserKnownHostsFile=/dev/null
```

7. Fix/correct the SSL certificate that comes in `envs/example/defaults-2.0.yml`

7.1 Confirm that the cert is broken by extracting it and examining it:

```
cd ~/ursula/envs/example
```

Extract the cert to the file `defaults2.0-cert.crt`

```
cat defaults-2.0.yml  | grep crt: -A50 |grep -v crt: | grep "END CERTIFICATE-----" -B 50 | tr -d ' '> defaults2.0-cert.crt
sed -i -- 's/-----BEGINCERTIFICATE-----/-----BEGIN CERTIFICATE-----'/g defaults2.0-cert.crt
sed -i -- 's/-----ENDCERTIFICATE-----/-----END CERTIFICATE-----'/g defaults2.0-cert.crt
```

Try to get details out of it:

```
openssl x509 -in defaults2.0-cert.crt -text -noout
unable to load certificate
140483871201096:error:0D0680A8:asn1 encoding routines:ASN1_CHECK_TLEN:wrong tag:tasn_dec.c:1343:
140483871201096:error:0D07803A:asn1 encoding routines:ASN1_ITEM_EX_D2I:nested asn1 error:tasn_dec.c:393:Type=X509
140483871201096:error:0906700D:PEM routines:PEM_ASN1_read_bio:ASN1 lib:pem_oth.c:83:
```

As you can see from the error, this one is obviously broken and needs to be replaced.

7.2 Generate a new self-signed certificate and private key. We'll use a fake hostname as the Common Name.

```
cd /etc/ssl/
openssl req -subj '/CN=openstack.chaidas.com/C=US' -new -newkey rsa:2048 -sha256 -days 365 -nodes -x509 -keyout serverkey.pem -out server.crt
```

7.3 Now replace the broken cert with this one you generated:

```
cd ~/ursula/envs/example
# Backup your defaults-2.0.yml file
cp defaults-2.0.yml ~
# Remove the old cert
sed -i -- '/-----BEGIN CERTIFICATE-----/,/-----END CERTIFICATE-----/d' defaults-2.0.yml
# Remove the old private key
sed -i -- '/-----BEGIN RSA PRIVATE KEY-----/,/-----END RSA PRIVATE KEY-----/d' defaults-2.0.yml
# Now tell the playbook to load the certificate and private key from the above files. (note: http://stackoverflow.com/a/24509515)
sed -i -- 's!crt: |!crt: "{{ lookup(\x27'file\\x27',\x27'/etc/ssl/server.crt\\x27') }}"!g' defaults-2.0.yml 
sed -i -- 's!key: |!key: "{{ lookup(\x27'file\\x27',\x27'/etc/ssl/serverkey.pem\\x27') }}"!g' defaults-2.0.yml 
```

7.4 Make sure to change the FQDN to the one you just used for the Common Name. Do not skip this step, otherwise things will break, down the road! 

```
sed -i -- 's!fqdn: openstack.example.com!fqdn: openstack.chaidas.com!g' defaults-2.0.yml
```

8. Inside a screen session, run the `allinone` installation. Note that a successful deployment takes about 1 hour and 26 minutes on a 8GB, 4 Core VPS.

```
screen
source ursula-python/bin/activate
cd ~/ursula
ursula envs/example/allinone site.yml
```

9. Once this process is done, you should be able to log in to Horizon by going to the IP address of your VPS (that would be the 69.87.123.456 in this example). The username is "admin" and the default password is "asdf".

Enjoy! 

### Common Errors and Resolutions

## ERROR 1 

TASK [apt-repos : add any dependent repository keys from url] ******************
Thursday 13 October 2016  21:08:49 +0000 (0:00:11.179)       0:00:16.858 ******
fatal: [allinone]: FAILED! => {"failed": true, "msg": "The conditional check 'common.hwraid.enabled|bool and ansible_distribution_version == \"12.04\"' failed. The error was: {u'logs': [{u'paths': [u'/var/log/audit/audit.log'], u'tags': u'audit,common', u'type': u'syslog', u'fields': None}], u'ipmi': {u'baud_rate': 115200, u'enabled': False, u'state': 'probe', u'serial_console': u'ttyS1'}, u'setuptools_version': u'system', u'serial_console': {u'enabled': True, u'name': u'ttyS0'}, u'ssh': {u'allow_from': [u'0.0.0.0/0', u'::/0'], u'disable_dns': True, u'disable_root': False}, u'os_tuning_params_clean': [{u'name': u'net.ipv4.tcp_syncookies'}, {u'name': u'net.ipv4.tcp_synack_retries'}], u'monitoring': {u'scan_for_log_errors': False, u'sensu_checks': {u'check_static_route': {u'criticality': u'critical'}, u'vyatta': {u'tunnels': {u'criticality': u'critical'}}, u'check_lro': {u'warning': False, u'enabled': True, u'devices': u\"{{ hostvars[inventory_hostname][hostvars[inventory_hostname].primary_interface|remove_vlan_tag]|net_physical_devices|join(',') }}\"}, u'check_raid': {u'criticality': u'critical'}}}, u'packages_to_remove': [u'language-selector-common'], u'logging': {u'debug': False, u'verbose': True}, u'python_extra_packages': [], u'ssh_private_keys': [], u'ursula_monitoring': {u'path': u'/opt/ursula-monitoring', u'git_rev': u'master', u'git_repo': u'https://github.com/blueboxgroup/ursula-monitoring.git', u'tar_url': 'https://file-mirror.openstack.blueboxgrid.com/ursula-monitoring/2.2.5.tar.gz', u'method': 'tar', u'tar_version': '2.2.5'}, u'hwraid': {u'clients': [u'tw-cli', u'megacli'], u'enabled': True}, u'pip_version': u'8.0.2', u'system_tools': {u'mcelog': False}, u'ntpd': {'servers': []}}: template error while templating string: unexpected '/'. String: {{ lookup(file,/etc/ssl/server.crt) }}"}

**Fix with:**
1. On the target, delete the files under `/etc/apt/sources.list.d/apt_mirror_openstack_*` that is: `rm /etc/apt/sources.list.d/apt_mirror_openstack_*`
2. Back on the Ansible host run this command: 
sed -i -- 's!https://apt-mirror.openstack.blueboxgrid.com!http://apt-mirror.openstack.blueboxgrid.com!g' ~/ursula/envs/example/defaults-2.0.yml
3. Re-run Ursula: `ursula envs/example/allinone site.yml`

## ERROR 2

TASK [keystone-setup : keystone tenants] ***************************************
Friday 14 October 2016  20:10:32 +0000 (0:00:03.005)       0:22:32.770 ********
failed: [allinone] (item=admin) => {"extra_data": null, "failed": true, "item": "admin", "msg": "Could not determine a suitable URL for the plugin"}
failed: [allinone] (item=service) => {"extra_data": null, "failed": true, "item": "service", "msg": "Could not determine a suitable URL for the plugin"}
failed: [allinone] (item=demo) => {"extra_data": null, "failed": true, "item": "demo", "msg": "Could not determine a suitable URL for the plugin"}

**Fix with:**

Edit the file ~/ursula/envs/example/allinone/group_vars/all.yml

**Make this change to the file:**
floating_ip: 172.16.0.100
Change it to this:
floating_ip: "{{ hostvars[inventory_hostname][primary_interface]['ipv4']['address'] }}"

## ERROR 3

TASK [nova-data : generate really unique uuid] *********************************
Sunday 16 October 2016  02:28:52 +0000 (0:00:01.052)       0:25:53.449 ********
fatal: [allinone]: FAILED! => {"changed": false, "cmd": "uuidgen -t", "failed": true, "msg": "[Errno 2] No such file or directory", "rc": 2}

**Fix it in this way:**

Edit the file ` ~/ursula/roles/common/tasks/main.yml`

**Add this flag:**

    - uuid-runtime

## ERROR 4

TASK [horizon : custom horizon logo] *******************************************
Sunday 16 October 2016  03:52:25 +0000 (0:00:00.423)       0:28:01.445 ********
skipping: [allinone] => (item={u'url': u'', u'name': u'img/logo.png'})
skipping: [allinone] => (item={u'url': u'', u'name': u'img/logo-splash.png'})
skipping: [allinone] => (item={u'url': u'', u'name': u'img/favicon.ico'})

TASK [horizon : Enable/Disable lbaas dashboard] ********************************
Sunday 16 October 2016  03:52:26 +0000 (0:00:00.775)       0:28:02.221 ********
fatal: [allinone]: FAILED! => {"failed": true, "msg": "the field 'args' has an invalid value, which appears to include a variable that is undefined. The error was: 'dict object' has no attribute 'lbaas'\n\nThe error appears to have been in '/root/ursula/roles/horizon/tasks/main.yml': line 115, column 3, but may\nbe elsewhere in the file depending on the exact syntax problem.\n\nThe offending line appears to be:\n\n\n- name: Enable/Disable lbaas dashboard\n  ^ here\n"}

.... this error means that you accidentally deleted the `lbaas:false` lines :)



**Sources:** 
https://ask.openstack.org/en/question/67118/openstack-could-not-determine-a-suitable-url-for-the-plugin/
http://superuser.com/a/621300

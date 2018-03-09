---
layout: page
title:  "Virtual python environments and you: A developer's primer"
featured: true
weight: 8
tags: [getting started, python, environments]
author: Jason Kennedy
dateAdded: November 6th, 2015
---

One of the first things you should do before you start playing with `stackrc` files and api's with **OpenStack** is get your computer ready to do the development work. What this normally means is installing some client-side tools that let us interact with our **OpenStack** environments remotely.

The trouble is, it's extremely easy to mess up your machine by installing things the wrong way. Sometimes it's necessary to run different tools or even different versions of the same tooling (**OpenStack** is fun!). For these things, you should be working in virtual environments.

I have written previously about installing `python-novaclient` in OS X; today I'll install `python-openstackclient` in a python virtual environment that I create using `vex`.

`Vex` is actually a wrapper around `virtualenv`, making that tool simpler to use. I prefer `vex` because you can run one-off commands to specific environments without having to actually enter said environments; as it says, making the tools simpler to use. Let me show you:

{% highlight bash %}
blix:~ jkomg$ sudo pip install vex
Password:
Downloading/unpacking vex
  Downloading vex-0.0.18-py2.py3-none-any.whl
Requirement already satisfied (use --upgrade to upgrade): virtualenv in /usr/local/lib/python2.7/site-packages (from vex)
Installing collected packages: vex
Successfully installed vex
Cleaning up...
{% endhighlight %}

This is what you should see after it's set up:

{% highlight bash %}
blix:~ jkomg$ vex
Error: could not find a virtualenv name in the command line.
{% endhighlight %}

Now, you have a decision to make. You should have the `openrc/stackrc` file from your environment (you get it from **Horizon**). You can either source it outside the virtual environment, or within. If you source it outside, you'll be able to run one-off commands, which I'll show you below. If you source it inside, you'll need to work from within the virtual environment so you can interact with your cloud. Either way is fine.

{% highlight bash %}
blix:~ jkomg$ source Downloads/jkennedy-openrc.sh
Please enter your OpenStack Password:
blix:~ jkomg$
{% endhighlight %}

You're all but done. All you need to do now is create a virtual environment for yourself to install your dev tools into.

{% highlight bash %}
blix:~ jkomg$ vex --make openstack
New python executable in /Users/jkomg/.virtualenvs/openstack/bin/python2.7
Also creating executable in /Users/jkomg/.virtualenvs/openstack/bin/python
Installing setuptools, pip, wheel...done.
bash-3.2$
{% endhighlight %}

Note you're in a different bash shell. Once inside, just install the tool that you want (in our case, we'll use `python-openstackclient`):

{% highlight bash %}
bash-3.2$ pip install python-openstackclient
Collecting python-openstackclient
  Using cached python_openstackclient-1.8.0-py2.py3-none-any.whl
Collecting cliff>=1.14.0 (from python-openstackclient)
  Using cached cliff-1.15.0-py2-none-any.whl
Collecting oslo.i18n>=1.5.0 (from python-openstackclient)
  Using cached oslo.i18n-2.7.0-py2.py3-none-any.whl
Collecting requests!=2.8.0,>=2.5.2 (from python-openstackclient)
  Using cached requests-2.8.1-py2.py3-none-any.whl
Collecting python-keystoneclient!=1.8.0,>=1.6.0 (from python-openstackclient)
...(there's a lot)
novaclient-2.34.0 python-openstackclient-1.8.0 pytz-2015.7 requests-2.8.1 simplejson-3.8.1 six-1.10.0 stevedore-1.9.0 unicodecsv-0.14.1 warlock-1.2.0 wrapt-1.10.5
bash-3.2$
{% endhighlight %}

From here, it should be smooth sailing:

{% highlight bash %}
bash-3.2$ nova list
+--------------------------------------+---------+--------+------------+-------------+---------------------------------------+
| ID                                   | Name    | Status | Task State | Power State | Networks                              |
+--------------------------------------+---------+--------+------------+-------------+---------------------------------------+
| 0cdc83f5-82a3-4796-83a4-ed978cf68421 | cf-test | ACTIVE | -          | Running     | internal=10.230.7.238, 173.247.105.20 |
| 0e8ac52a-6536-4e4f-a202-afcfa128e1a8 | dev     | ACTIVE | -          | Running     | internal=10.230.7.59, 173.247.105.119 |
+--------------------------------------+---------+--------+------------+-------------+---------------------------------------+
bash-3.2$
{% endhighlight %}

To get out of the virtual environment shell, simply type `exit`. To see what current virtual environments you have running, type:

{% highlight bash %}
blix:~ jkomg$ vex --list
openstack
test
ursula
{% endhighlight %}

and to get back into an existing environment:

{% highlight bash %}
blix:~ jkomg$ vex openstack
bash-3.2$
{% endhighlight %}

The best part of using `vex`, though, is the simplicity. From your standard terminal prompt, you can interact directly with any of the python virtual environments you've created without having to jump into them:

{% highlight bash %}
blix:~ jkomg$ vex openstack nova list
+--------------------------------------+---------+--------+------------+-------------+---------------------------------------+
| ID                                   | Name    | Status | Task State | Power State | Networks                              |
+--------------------------------------+---------+--------+------------+-------------+---------------------------------------+
| 0cdc83f5-82a3-4796-83a4-ed978cf68421 | cf-test | ACTIVE | -          | Running     | internal=10.230.7.238, 173.247.105.20 |
| 0e8ac52a-6536-4e4f-a202-afcfa128e1a8 | dev     | ACTIVE | -          | Running     | internal=10.230.7.59, 173.247.105.119 |
+--------------------------------------+---------+--------+------------+-------------+---------------------------------------+
blix:~ jkomg$
{% endhighlight %}

That's it! bear in mind you can create endless `vex` and nest sessions, which  eventually will stop the world from spinning, flinging us all into space*, so I don't recommend it.

Happy developing!

*not true

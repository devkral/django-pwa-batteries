django-pwa-batteries
====================

Installation
============
Install from PyPI:

currently not possible

Install from Github (development):

```
pip install git+https://github.com/devkral/django-pwa-batteries.git
```

Install with pipenv:

```
git clone https://github.com/devkral/django-pwa-batteries.git
cd ./django-pwa-batteries
pipenv install
```

Setup
=====

Add `pwa_batteries` to your list of `INSTALLED_APPS`.

```python
INSTALLED_APPS = [
    ...
    'pwa_batteries',
    ...
]
```

Create a template and inherit from `pwa_batteries/serviceworker.js`. Replace the missing parts.
Add afterwards path to own serviceworker in settings:

```python
PWA_SERVICE_WORKER_PATH = "<path to myworker>"
```


Also set the pwa parameters from [django-progressive-web-app](http://github.com/svvitale/django-progressive-web-app "django-progressive-web-app")

License
=======
See LICENSE.md

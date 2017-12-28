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

Add `pwa_batteries` to your list of `INSTALLED_APPS` and add `PWA_SERVICE_WORKER_PATH="pwa_batteries/serviceworker.js"` in settings.py:

```python
INSTALLED_APPS = [
    ...
    'pwa_batteries',
    ...
]

PWA_SERVICE_WORKER_PATH="pwa_batteries/serviceworker.js"
```

Also set the pwa parameters from [django-progressive-web-app](http://github.com/svvitale/django-progressive-web-app "django-progressive-web-app")

License
=======
See LICENSE.md

django-pwa-batteries
====================
NOTE: django-pwa is currently the way to go, I may restart development as an abstraction layer for easier pwas
until now the repo can be considered broken



Installation
============
Install from PyPI:

currently not possible

Install from Github (development):

```
pip install git+https://github.com/devkral/django-pwa-batteries.git
```

Install with poetry:

```
git clone https://github.com/devkral/django-pwa-batteries.git
cd ./django-pwa-batteries
poetry install
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


Also set the pwa parameters from [django-pwa](https://github.com/silviolleite/django-pwa "django-pwa")

License
=======
See LICENSE.md

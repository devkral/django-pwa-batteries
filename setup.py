import os
from setuptools import find_packages, setup

short_description = 'Move logic to frontend'

try:
    import pypandoc
    long_description = pypandoc.convert('README.md', 'rst')
except:
    long_description = short_description

install_requirements = [
    "django>=2",
    "django-progressive-web-app",
]
setup(
    name='django-pwa-batteries',
    version='0.1',
    packages=find_packages("pwa_batteries"),
    install_requires=install_requirements,
    include_package_data=True,
    license='MIT License',
    description=short_description,
    long_description=long_description,
    url='https://github.com/devkral/django-pwa-batteries',
    author='Alexander Kaftan',
    author_email='devkral@web.de',
    classifiers=[
        'Environment :: Web Environment',
        'Framework :: Django',
        'Framework :: Django :: 2.0',
        'Intended Audience :: Developers',
        'License :: OSI Approved :: MIT License',
        'Operating System :: OS Independent',
        'Programming Language :: Python',
        'Programming Language :: Python :: 3',
        'Programming Language :: Python :: 3.4',
        'Programming Language :: Python :: 3.5',
        'Programming Language :: Python :: 3.6',
        'Topic :: Internet :: WWW/HTTP',
        'Topic :: Internet :: WWW/HTTP :: Dynamic Content',
    ],
)

import django
from .views import EndpointJson, ServedHelper

if django.VERSION[0] >= 2:
    from django.urls import path
    urlpatterns = [
        path('pwa_batteries.js', ServedHelper.as_view(), name="pwa_batteries_helper"),
        path('endpoint/json', EndpointJson.as_view(), name="pwa_endpoint_json"),
    ]
else:
    from django.conf.urls import url
    urlpatterns = [
        url('pwa_batteries.js$', ServedHelper.as_view(), name="pwa_batteries_helper"),
        url('endpoint/json$', EndpointJson.as_view(), name="pwa_endpoint_json"),
    ]

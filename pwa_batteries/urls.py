from django.urls import path
from .views import EndpointJson, ServedHelper

# Serve up serviceworker.js and manifest.json at the root
urlpatterns = [
    path('pwa_batteries.js', ServedHelper.as_view(), name="pwa_batteries_helper"),
    path('endpoint/json', EndpointJson.as_view(), name="pwa_endpoint_json"),
]

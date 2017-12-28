from django.urls import path
from .views import EndpointJson

# Serve up serviceworker.js and manifest.json at the root
urlpatterns = [
    path('endpoint/json', FetchJson.as_view(), name="pwa_endpoint_json"),
]

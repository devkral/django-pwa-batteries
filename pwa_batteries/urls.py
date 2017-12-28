from django.urls import path
from .views import FetchJson, UpdateJson, DeleteJson

# Serve up serviceworker.js and manifest.json at the root
urlpatterns = [
    path('endpoint/json', FetchJson.as_view(), name="pwa_endpoint_json"),
]

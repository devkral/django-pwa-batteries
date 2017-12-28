from django.urls import path
from .views import FetchJson, UpdateJson, DeleteJson

# Serve up serviceworker.js and manifest.json at the root
urlpatterns = [
    path('fetch/json', FetchJson.as_view(), name="pwa_fetch_json"),
    path('update/json', UpdateJson.as_view(), name="pwa_update_json"),
    path('delete/json', DeleteJson.as_view(), name="pwa_delete_json"),
]

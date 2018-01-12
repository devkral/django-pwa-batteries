from django.urls import path
from django.conf import settings
from graphene_django.views import GraphQLView
#from .views import EndpointJson

# Serve up serviceworker.js and manifest.json at the root
urlpatterns = [
    path('endpoint/graphql', GraphQLView.as_view(graphiql=True), name="pwa_endpoint_graphql"),
    #path('endpoint/json', EndpointJson.as_view(), name="pwa_endpoint_json"),
]

from django.views import View
from django.views.generic import TemplateView
from django.apps import apps
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

class ServedHelper(TemplateView):
    template_name = "pwa_batteries/pwa_batteries.js"
    content_type = "application/javascript"


class EndpointJson(View):
    @csrf_exempt
    def dispatch(self, *args, **kwargs):
        return super().dispatch(*args, **kwargs)

    def post(self, *args, **kwargs):
        """ Fetch """
        data = json.loads(self.request.body)
        query_results = {}
        for counter, entry in enumerate(data):
            model_name, value = list(entry.items())[0]
            try:
                model = apps.get_model(app_label=model_name)
            except Exception as exc:
                continue
            if not hasattr(model, "process_pwa_query"): # process data and check permissions (filter if no permission)
                continue
            query = model.objects.filter(**value.get("filter", {})).exclude(**value.get("exclude", {}))
            query_results[counter] = model.process_pwa_query(query, self.request)
        return JsonResponse(query_results)

    def put(self, *args, **kwargs):
        """ Create/Update depending on filter,exclude """
        data = json.loads(self.request.body)
        query_results = []
        for counter, (model_name, value) in enumerate(data):
            try:
                model = apps.get_model(app_label=model_name)
            except Exception as exc:
                query_results.append("{}: invalid: {}".format(counter, model_name))
                continue
            if not hasattr(model, "update_pwa_request"): # updates and check permission
                query_results.append("{}: invalid: {}".format(counter, model_name))
                continue
            if "filter" in value or "exclude" in value:
                query = model.objects.filter(**value.get("filter", {})).exclude(**value.get("exclude", {}))
                # delete_pwa_request should return "success" if successfull, errorstring elsewise
                # last parameter specifies if new objects should be created: False => update
                last = model.update_pwa_request(query, value.get("data", {}), self.request, False)
            else:
                query = model.objects.none()
                # delete_pwa_request should return "success" if successfull, errorstring elsewise
                # last parameter specifies if new objects should be created: False => create or bulk_create
                last = model.update_pwa_request(query, value.get("data", {}), self.request, True)

            if last != "success":
                query_results.append("{}: {}".format(counter, last))
        return JsonResponse(query_results)

    def delete(self, *args, **kwargs):
        """ Delete """
        data = json.loads(self.request.body)
        query_results = []
        for counter, (model_name, value) in enumerate(data):
            try:
                model = apps.get_model(app_label=model_name)
            except Exception as exc:
                query_results.append("{}: invalid: {}".format(counter, model_name))
                continue
            if not hasattr(model, "delete_pwa_request"): # updates and check permission
                query_results.append("{}: invalid: {}".format(counter, model_name))
                continue
            query = model.objects.filter(**value.get("filter", {})).exclude(**value.get("exclude", {}))
            # delete_pwa_request should return "success" if successfull, errorstring elsewise
            last = model.delete_pwa_request(query, self.request)
        if last != "success":
            query_results.append("{}: {}".format(counter, last))
        return JsonResponse(query_results)

from django.views import View
from django.apps import apps
from django.http import JsonResponse
import json

class FetchJson(View):
    def post(self, *args, **kwargs):
        data = json.loads(self.request.body)
        query_results = {}
        for model_name, value in data.items():
            try:
                model = apps.get_model(app_label=model_name)
            except Exception as exc:
                continue
            if not hasattr(model, "process_pwa_query"): # extracts allowed data from query
                continue
            query = model.objects.filter(**value.get("filter", {})).exclude(**value.get("exclude", {}))
            query_results[model_name] = model.process_pwa_query(query, self.request)
        return JsonResponse(query_results)

    def put(self, *args, **kwargs):
        data = json.loads(self.request.body)
        query_results = {has_error: False, items: []}
        for model_name, value in data:
            try:
                model = apps.get_model(app_label=model_name)
            except Exception as exc:
                query_results.append("invalid: %s" % model_name)
                query_results["has_error"] = True
                continue
            if not hasattr(model, "update_pwa_request"): # updates and check permission
                query_results.append("invalid: %s" % model_name)
                query_results["has_error"] = True
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

            query_results["items"].append(last)
            if last != "success":
                query_results["has_error"] = True
        return JsonResponse(query_results)

    def delete(self, *args, **kwargs):
        data = json.loads(self.request.body)
        query_results = {has_error: False, items: []}
        for model_name, value in data:
            try:
                model = apps.get_model(app_label=model_name)
            except Exception as exc:
                query_results.append("invalid: %s" % model_name)
                query_results["has_error"] = True
                continue
            if not hasattr(model, "delete_pwa_request"): # updates and check permission
                query_results.append("invalid: %s" % model_name)
                query_results["has_error"] = True
                continue
            query = model.objects.filter(**value.get("filter", {})).exclude(**value.get("exclude", {}))
            # delete_pwa_request should return "success" if successfull, errorstring elsewise
            last = model.delete_pwa_request(query, self.request)
            query_results["items"].append(last)
            if last != "success":
                query_results["has_error"] = True
        return JsonResponse(query_results)



def get_cfg(settings, prefix):
    return {k[len(prefix):]: v for k, v in settings.items() if k.startswith(prefix)}


class ListParams:
    def __init__(self, q, limit, offset, dry):
        self.q = q
        self.limit = limit
        self.offset = offset
        self.dry = dry
        self.query_keys = [x for x in self.q.split(' ') if len(x) > 0]

def get_list_params(request):
    return ListParams(request.GET.get('q', ''),
                      request.GET.get('limit', 10),
                      request.GET.get('offset', 0),
                      request.GET.get('dry', '0') == '1')
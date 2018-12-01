from naki.model import DBSession, MetaKey, Metadata
import sqlalchemy

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


def check_missing_metakeys(metakeys, type):
    required_keys = DBSession.query(MetaKey).filter(MetaKey.mandatory.contains(type))
    print('Required keys: %s' % (','.join((x.key for x in required_keys))))
    missing_keys = []
    for key in required_keys:
        if not key.key in metakeys:
            print('Missing key %s' % key.key)
            missing_keys.append(key.key)
    return missing_keys


def update_metakeys(metakeys):
    present_keys = [x for x in DBSession.query(MetaKey).filter(MetaKey.key.in_(metakeys)).all()]
    new_keys = [m for m in metakeys if not m in (x.key for x in present_keys)]
    print('All keys: %s' % str(metakeys))
    print('New keys: %s' % str(new_keys))
    print('Present keys: %s' % (', '.join(str(x.get_dict()) for x in present_keys)))

    for key in new_keys:
        k = MetaKey(key, 'string', '', '')
        try:
            DBSession.add(k)
            print('Created key %s' % key)
        except sqlalchemy.exc.IntegrityError:
            # We don't exlicitely lock the tables here, so this may actually happen... but it's not fatal
            print('Key already exists')

def update_metadata(new_meta, item_id, type):
    '''
    Adds new metadata and removes old ones.
    The method creates metakey records if required
    :param new_meta: list of dicts {'key':'', 'value':''} from request (usially self._request.validated['metadata']
    :param item_id: ID of item (gi/dg/ds/view/...)
    :param type: type of metadata (eg. 'item')
    :return:
    '''
    metadata = [x for x in DBSession.query(Metadata).filter(sqlalchemy.and_(Metadata.id == item_id, Metadata.target == type)).all()]
    metakeys = [m['key'] for m in new_meta]
    update_metakeys(metakeys)
    for meta in new_meta:
        m = next((x for x in metadata if x.key == meta['key']), None)
        if m:
            m.value = meta['value']
        else:
            m = Metadata(item_id, type, meta['key'], meta['value'])
            DBSession.add(m)
    for meta in metadata:
        m = next((x for x in new_meta if x['key'] == meta.key), None)
        if not m:
            print('Deleting meta')
            DBSession.delete(meta)


def meta_record(key, data):
        return {'key': key.key, 'type': key.type, 'value': data.value}

def add_metadata_record(item_dict, item_id, type):
    item_dict['metadata'] = [meta_record(x[1], x[0]) for x in
                       DBSession.query(Metadata, MetaKey) \
                           .join(MetaKey, MetaKey.key == Metadata.key)\
                           .filter(sqlalchemy.and_(Metadata.id == item_id, Metadata.target == type)) \
                           .all()]
    return item_dict
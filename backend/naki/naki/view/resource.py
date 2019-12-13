from cornice.resource import resource, view
from cornice import Service
from pyramid.httpexceptions import HTTPServerError, HTTPNotFound
from pyramid.response import FileResponse
from pyramid.security import Everyone
import os
import shutil
import magic

from naki.lib.auth import RIGHTS
from naki.lib.cors import NAKI_CORS_POLICY
from naki.lib.metadata import load_metadata
from naki.lib.rest import APIResponse
from naki.lib.utils import get_cfg
from naki.model import Link, DBSession, DigitalItem
from PIL import Image
import subprocess
import base64

DUMMY_THUMB = b'/9j/4AAQSkZJRgABAQIASABIAAD/2wBDAAMCAgICAgMCAgIDAwMDBAYEBAQEBAgGBgUGCQgKCgkICQkKDA8MCgsOCwkJDRENDg8QEBEQCgwSExIQEw8QEBD/wAALCABAAEABAREA/8QAHAAAAwEBAQADAAAAAAAAAAAAAQIGAAMFBAcJ/8QAMxAAAQMCAgYHCAMAAAAAAAAAAQACAwQFBhExQVFylLISFCE2VHTTExUWJlaztNFCRmT/2gAIAQEAAD8A/VNSdzud9ffa2iorpHSwUrIei3qzXlxc0kkklcetYn+oWcEz9oGrxOP7CzgmftbrmJ/qFnBM/aODca1FxmdZsRNjirxNNHTzMb0Y6prHuHYP4vAGZbr0jWBZLLKNqu8123abkKcnYlJyQJJXgUtThW52Oajr7jHDUtrKmRpHSD2O9s4tIIGbSMgQV7mDMdQXGsGGbpXxTXFjS6CdvYKpjdJy1PA0jQdI1gWqyjKzvPdt2m5CmJySk7UpKGfR0Fc4DniCyk+Kk+xKrpZRdafme7btNyFElKTmlJQJ1lc6c54gsnmpPx5VeLKJrjlii7blNyFHPalJ2JSckpOaWmPzDZB/qk/HlV6soi4HLFF23KbkKBOaBOSUnWUpKFJ3hsvmpPsSq+WUPce9F13KbkKUnYgTklJzSkoUfeKy+ak+xKvsBZSV3w/f5b5V3C3R0MsNSyIZTTvjc0tBB7AxwI7dq+P7hxb4O1cbJ6SX3Bi3wdq42T0ljh/F3g7VxsnpIfD2LfCWrjZPSXW24axE29W+ur47fHBRyPld7Koe9xzjewAAsA0u26lZr//Z'



def prepare_image(request, item, res, full_path, image_path):
    '''

    :param item: DigitalItem
    :param res: (WIDTH, HEIGHT) tuple
    :return:
    '''

    mime = item.mime


    if mime.startswith('image/'):
        if not os._exists(image_path):
            img = Image.open(full_path)
            if img.size[0] / res[0] > img.size[1] / res[1]:
                res = [res[0], int(img.size[1] * res[0] / img.size[0])]
            else:
                res = [int(img.size[0] * res[1] / img.size[1]), res[1]]
            img2 = img.resize(res)
            img2.save(image_path)
        return FileResponse(image_path, request=request)
    elif mime.startswith('video/'):
        if not os._exists(image_path):
            subprocess.run(
                ['ffmpeg', '-y', '-i', full_path, '-ss', '00:00:01.000', '-vframes', '1', '-s', '%dx%d'%res, image_path],
                stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        return FileResponse(image_path, request=request)
    elif mime == 'application/pdf':
        if not os._exists(image_path):
            subprocess.run(
                ['convert', '%s[0]' % full_path, '-density', '150', '-resize', '%dx%d'%res, image_path],
                stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        return FileResponse(image_path, request=request)
    else:
        resp = request.response
        resp.status_int = 200
        resp.body = base64.b64decode(DUMMY_THUMB)
        resp.content_type = 'image/jpg'
        return resp



resource_get_service = Service(name='get resource', path='/api/v1/storage/resource/{id:[a-zA-Z0-9-]*}*opts',
                               description='Download item', cors_policy=NAKI_CORS_POLICY)


@resource_get_service.get(permission=Everyone)
def download_resource(request):
    '''
    Expects requests for DI from storage. Optionally accepts params
    :param request:
    :return:
    '''
    print(request.matchdict['id'], request.matchdict['opts'])
    item_id = request.matchdict['id']
    opts = request.matchdict['opts']
    item_info = DBSession.query(DigitalItem, Link) \
        .filter(DigitalItem.id_item == request.matchdict['id']) \
        .join(Link, Link.id_item == DigitalItem.id_item).all()

    if len(item_info) == 0:
        raise HTTPNotFound()

    # TODO: Check access (somehow...)

    cfg = get_cfg(request.registry.settings, 'naki.storage.')
    root = cfg.get('root', None)
    prefix = 'storage:'
    path = None
    for item, link in item_info:
        print(link.uri)
        if link.uri.startswith(prefix):
            path = link.uri[len(prefix):]
            break

    if path is None:
        raise HTTPNotFound()
    if path.startswith('/'):
        path = path[1:]
    full_path = os.path.join(root, path)

    if 'thumbnail' in opts:
        item = item_info[0][0]
        thumb_dir = cfg.get('thumbnails', os.path.join(root, '.thumbnails'))
        os.makedirs(thumb_dir, exist_ok=True)
        thumb_path = os.path.join(thumb_dir, item_id + '.jpg')
        return prepare_image(request, item, (128, 128), full_path, thumb_path)
    elif 'preview' in opts:
        item = item_info[0][0]
        preview_dir = cfg.get('preview', os.path.join(root, '.preview'))
        os.makedirs(preview_dir, exist_ok=True)
        preview_path = os.path.join(preview_dir, item_id + '.jpg')
        return prepare_image(request, item, (1280, 720), full_path, preview_path)

    resp = FileResponse(full_path, request=request)
    d, fname = os.path.split(full_path)
    resp.content_disposition = '%s; filename="%s"'%('attachment' if 'download' in opts else ' inline', fname)
    return resp

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
from naki.model import Link, DBSession
from naki.lib.mods import parse_mods


def guess_mime(magic, path):
    mime = magic.from_file(path)
    # Let's add few hand made rules for specific files we may need...
    if mime == 'text/plain' and path.lower().endswith('.bvh'):
        mime = 'motion/bvh'
    return mime


def strip_path(root, path):
    return path[len(root):] if path.startswith(root) else path


@resource(path='/api/v1/storage/get/*path', collection_path='/api/v1/storage/list/*path', cors_policy=NAKI_CORS_POLICY)
class StorageRes(object):
    def __init__(self, request, context=None):
        self._context = context
        self._request = request
        self._cfg = get_cfg(request.registry.settings, 'naki.storage.')
        self._root = self._cfg.get('root', None)
        self._mime = magic.Magic(mime=True)

    def _strip_path(self, path):
        return strip_path(self._root, path)

    def _guess_mime(self, path):
        return guess_mime(self._mime, path)

    @view(permission=Everyone)
    def get(self):
        path = os.path.join(self._root, *self._request.matchdict['path'])
        try:
            return FileResponse(path, request=self._request)
        except FileNotFoundError:
            raise HTTPNotFound()
        except IsADirectoryError:
            raise HTTPNotFound()

    def _load_metadata(self, full_path, mime):
        m = load_metadata(full_path, mime)
        mods_file = full_path+'.mods.xml'
        if os.path.exists(mods_file):
            try:
                mods = open(mods_file, 'rb').read().decode('utf8')
                mods_meta = parse_mods(mods)
                m.update(mods_meta)
            except Exception as e:
                print('Exception processing mods: %s' % str(e))
        return m

    def _process_file(self, file, full_path, used_paths):
        mime = self._guess_mime(full_path)
        stripped_path = self._strip_path(full_path)
        used = stripped_path in used_paths
        return {'name': file,
                'mime': mime,
                'path': stripped_path,
                'used': used,
                'metadata': self._load_metadata(full_path, mime) if not used else {}}

    @view(permission=RIGHTS.Editor)
    def collection_get(self):
        if not self._root:
            raise HTTPServerError()

        prefix = 'storage:'
        used_paths = [x[0][len(prefix):] for x in DBSession.query(Link.uri).filter(Link.type == 'data').all() if
                      x[0].startswith(prefix)]
        if self._request.GET.get('dirs', '0') == '1':
            directories = {}
            for root, dirs, files in os.walk(self._root):
                d = directories
                for dd in self._strip_path(root).split('/')[1:]:
                    d = d['dirs'][dd]
                d['dirs'] = {dd: {} for dd in dirs}
                d['file_count'] = len(files)
                d['new_files'] = len([x for x in files if not self._strip_path(os.path.join(root, x)) in used_paths])

            return APIResponse(directories)

        print(self._request.matchdict['path'])
        req_path = os.path.join(self._root, *self._request.matchdict['path'])
        print(req_path)

        r, d, f = next(os.walk(req_path))
        res = {'files': [self._process_file(file, os.path.join(r, file), used_paths) for file in f if not file.endswith('.mods.xml')],
               'path': self._strip_path(r),
               'dirs': d}
        print(res)

        return APIResponse(res)

upload_service = Service(name='upload', path='/api/v1/storage/upload/{filename}', description='Upload servicex', cors_policy=NAKI_CORS_POLICY)

@upload_service.post(permission=RIGHTS.Researcher)
def upload_file(request):
    cfg = get_cfg(request.registry.settings, 'naki.storage.')
    root = cfg.get('root', None)
    if not root:
        raise HTTPServerError()
    prefix = 'storage:'
    filename = request.matchdict['filename']
    print('File: ' + filename)
    target_dir = request.GET.get('dir', 'upload')
    while target_dir.startswith('/'):
        target_dir = target_dir[1:]
    print(target_dir)
    # print(request.body)
    path = os.path.join(root, target_dir)
    print(root, path)
    filepath = os.path.join(path, filename)
    os.makedirs(path, exist_ok=True)
    f = open(filepath, 'wb')
    f.write(request.body)
    f.close()
    mime = guess_mime(magic.Magic(mime=True), filepath)
    return APIResponse({
        'name': filename,
        'mime': mime,
        'used': False,
        'path': strip_path(root, filepath),
        'metadata': load_metadata(filepath, mime)
    })

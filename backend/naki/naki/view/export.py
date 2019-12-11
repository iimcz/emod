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
from naki.model import Link, DBSession, DigitalItem, DigitalSet, DIGroup, GroupSet, GroupItem, Metadata
from naki.lib.mods import generate_mods
from PIL import Image
import subprocess
import base64
import zipfile
from lxml import etree
import datetime

XLINK = 'http://www.w3.org/1999/xlink'
METS = 'http://www.loc.gov/METS/'
MODS = 'http://www.loc.gov/mods/v3'
NSMAP = {'mets': METS,
         'xlink': XLINK,
         'mods': MODS}


def get_metadata(ids, target):
    meta = [x for x in DBSession.query(Metadata). \
        filter(Metadata.target == target). \
        filter(Metadata.id.in_(ids)).all()]

    ret = {}
    for m in meta:
        if not m.id in ret:
            ret[m.id] = {}
        r = ret[m.id]
        r[m.key] = m.value
    return ret


def get_export_name(meta, id):
    if 'export_name' in meta:
        return meta['export_name']
    if 'original_name' in meta:
        return meta['original_name']
    return str(id)


def wrap_mods(mods, item_id):
    '''

    :param mods: string with mods XML
    :return:
    '''
    parser = etree.XMLParser(remove_blank_text=True)
    mods_xml = etree.fromstring(mods.encode('utf-8'), parser=parser)

    # Add namespace
    for el in mods_xml.iter():
        el.tag = '{%s}%s' % (MODS, el.tag)

    el1 = etree.Element('{%s}xmlData' % METS)
    el2 = etree.Element('{%s}mdWrap' % METS)
    el2.attrib['MDTYPE'] = 'MODS'
    el2.attrib['MDTYPEVERSION'] = mods_xml.attrib.get('version', '3.6')
    el2.attrib['MIMETYPE'] = 'text/xml'
    el3 = etree.Element('{%s}dmdSec' % METS)
    el3.attrib['ID'] = item_id

    el1.append(mods_xml)
    el2.append(el1)
    el3.append(el2)

    return el3


export_service = Service(name='export resource', path='/api/v1/export/{id:[a-zA-Z0-9-]*}*opts',
                         description='Export set', cors_policy=NAKI_CORS_POLICY)


@export_service.get(permission=Everyone)
def export_set(request):
    '''
    Exports a set
    :param request:
    :return:
    '''

    cfg = get_cfg(request.registry.settings, 'naki.storage.')
    root = cfg.get('root', None)
    prefix = 'storage:'
    export_dir = cfg.get('export', os.path.join(root, '.export'))

    print(request.matchdict['id'])
    set_id = request.matchdict['id']
    opts = request.matchdict['opts']
    xml_only = 'xml' in opts

    # This would fail if there are no metadata for the set ... which seems fine
    set_meta = get_metadata([set_id], 'set')[set_id]
    # print(set_meta)
    group_list = [x for x in DBSession.query(GroupSet.id_group).filter(GroupSet.id_set == set_id).all()]

    group_meta = get_metadata(group_list, 'group')
    # print(group_meta)

    group_items_raw = [x for x in DBSession.query(GroupItem.id_group, GroupItem.id_item).filter(
        GroupItem.id_group.in_(group_list)).all()]
    # print(group_items)

    item_meta = get_metadata([x[1] for x in group_items_raw], 'item')
    # print(item_meta)

    items_to_ignore = []
    print('Retrieved %d item metas' % len(item_meta))
    for item_id, item in item_meta.items():
        if not item.get('export', '0') == '1':
            items_to_ignore.append(item_id)

    for item_id in items_to_ignore:
        del item_meta[item_id]

    items_to_ignore = []

    item_links = {x.id_item: x.uri for x in DBSession.query(Link).filter(Link.id_item.in_(item_meta.keys())).filter(
        Link.uri.startswith(prefix)).all()}

    print(item_links)
    for item_id in item_meta:
        if not item_id in item_links:
            items_to_ignore.append(item_id)

    for item_id in items_to_ignore:
        del item_meta[item_id]

    print('Filtered meta metas t0 %d' % len(item_meta))
    print(item_meta)

    item_info = {x.id_item: x for x in
                 DBSession.query(DigitalItem).filter(DigitalItem.id_item.in_(item_meta.keys())).all()}

    group_items = {}
    for g in group_items_raw:
        print(g[1])
        if g[1] not in item_meta:
            # Item is in the set, but we don't have any metadata
            # That means the item is probably broken or not for export
            continue
        if not g[0] in group_items:
            group_items[g[0]] = []
        gg = group_items[g[0]]
        gg.append(g[1])

    print(group_items)

    # Now we have to process all groups/items and put them i an archive
    set_name = get_export_name(set_meta, set_id)
    archive_name = os.path.join(export_dir, set_name + '.zip')
    print('Archiving into %s' % archive_name)
    os.makedirs(export_dir, exist_ok=True)
    metadata_filename = os.path.join(set_name, set_name + '.xml')
    metadata_root = etree.Element('{%s}mets' % METS, nsmap=NSMAP)
    metadata_root.attrib['LABEL'] = set_meta.get('description', set_name)
    metadata_root.attrib['ID'] = set_id


    hdr = etree.Element('{%s}metsHdr' % METS)
    hdr.attrib['CREATEDATE']=datetime.datetime.now().isoformat()

    agent = etree.Element('{%s}metsHdr' % METS)
    agent.attrib['ROLE']='CREATOR'
    agent.attrib['TYPE']='OTHER'

    agent_name = etree.Element('{%s}name' % METS)
    agent_name.text = 'EMOD'
    agent.append(agent_name)
    hdr.append(agent)
    metadata_root.append(hdr)


    fileSec_root = etree.Element('{%s}fileSec' % METS)
    structMap_root = etree.Element('{%s}structMap' % METS)
    structMap_root.attrib['TYPE'] = 'logical'

    with zipfile.ZipFile(archive_name, 'w') as z:
        for grp_id, items in group_items.items():
            gmeta = group_meta[grp_id]
            print(gmeta)
            grp_name = get_export_name(gmeta, grp_id)
            print('Dir %s' % grp_name)

            desc = gmeta.get('description', grp_name)
            file_group = etree.Element('{%s}fileGrp' % METS)
            file_group.attrib['USE'] = desc
            group_struct = etree.Element('{%s}div' % METS)
            group_struct.attrib['LABEL'] = desc

            for item_id in items:
                link = item_links[item_id][len(prefix):]
                meta = item_meta[item_id]
                item_name = get_export_name(meta, os.path.split(link)[1])

                if link.startswith('/'):
                    link = link[1:]
                item_path = os.path.join(root, link)
                item_arcname = os.path.join(set_name, grp_name, item_name)
                print('Adding %s as %s' % (item_path, item_arcname))
                if not xml_only:
                    z.write(item_path, item_arcname)
                else:
                    z.writestr(item_arcname, b'EMPTY')
                meta2 = [Metadata(item_id, 'item', x, meta[x]) for x in meta]
                mods = generate_mods(None, meta2, formated=False)
                metadata_root.append(wrap_mods(mods, item_id))

                item_file = etree.Element('{%s}file' % METS)
                item_file.attrib['ID'] = item_id
                item_file.attrib['MIMETYPE'] = item_info[item_id].mime
                floc = etree.Element('{%s}FLocat' % METS, nsmap=NSMAP)
                floc.attrib['LOCTYPE'] = 'OTHER'
                floc.attrib['{%s}href' % XLINK] = item_arcname
                # TODO fill attribs
                item_file.append(floc)
                file_group.append(item_file)

                item_fptr = etree.Element('{%s}fptr' % METS)
                item_fptr.attrib['FILEID'] = item_id
                group_struct.append(item_fptr)

            fileSec_root.append(file_group)
            structMap_root.append(group_struct)

        metadata_root.append(fileSec_root)
        metadata_root.append(structMap_root)
        xml_text = etree.tostring(etree.ElementTree(metadata_root), xml_declaration=True, pretty_print=True,
                                  encoding='utf-8')
        z.writestr(metadata_filename, xml_text)
        z.close()
    print('Finished')

    resp = request.response
    resp.status_int = 200
    resp.body = xml_text
    resp.content_type = 'text/xml'
    return resp

    # return APIResponse(xml_text)

# <mets:fileSec>
# <mets:fileGrp USE="archive image">
# <mets:file ID="epi01m" MIMETYPE="image/tiff">
# <mets:FLocat
# xlink:href="http://www.loc.gov/standards/mets/docgroup/
# full/01.tif" LOCTYPE="URL"/>
# </mets:file>

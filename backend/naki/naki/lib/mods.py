from naki.model.digital_item import DigitalItem
from naki.model.metadata import Metadata
from naki.model.meta import DBSession
import re
from lxml import etree

# Ignoring XML NS for now
# <mods xsi:schemaLocation="http://www.loc.gov/mods/v3 http://www.loc.gov/standards/mods/v3/mods-3-6.xsd" version="3.6">


MODS_HEADER = '<?xml version="1.0" encoding="UTF-8"?>\n' + \
              '<mods version="3.7">'
MODS_FOOTER = '</mods>'

TAGS = {
    'abstract': ['<abstract>'],
    'language': ['<language>', '<languageTerm>'],
    'date': ['<originInfo>', '<dateCreated>'],
    'edition': ['<originInfo>', '<edition>'],
    'place': ['<originInfo>', '<place>'],
    'publisher': ['<originInfo>', '<publisher>'],
    'length': ['<physicalDescription>', '<extent>'],
    'form': ['<physicalDescription>', '<form>'],
    'note': ['<physicalDescription>', '<note>'],
    'part_name': ['<titleInfo>', '<partName>'],
    'description': ['<titleInfo>', '<title>'],
    'topic': ['<subject>', '<topic>'],
    'type': ['<typeOfResource>'],

}


def find_metavalue(key, metadata):
    for m in metadata:
        if m.key == key:
            return m.value
    return None


def update_or_create_tag(tags, tag_data, value):
    for t in tags:
        if t['tag'] == tag_data[0]:
            if len(tag_data) == 1:
                t['value'] = value
                return None
            else:
                return update_or_create_tag(t['children'], tag_data[1:], value)
    else:
        tt = {'tag': tag_data[0], 'children': [], 'value': None}
        tags.append(tt)
        if len(tag_data) == 1:
            tt['value'] = value
            return None
        return update_or_create_tag(tt['children'], tag_data[1:], value)


def add_tag(tags, metakey, value):
    t = TAGS.get(metakey)
    if not t:
        return
    update_or_create_tag(tags, t, value)


def process_name(tags, metadata):
    value = find_metavalue('name', metadata)
    if value is None:
        return
    for person in value.split(';'):
        name, role = person.split(',', 1)
        t = {'tag': '<name>', 'children': [
            {'tag': '<namePart>', 'children': [], 'value': name.strip()},
            {'tag': '<role>', 'children': [
                {'tag': '<roleTerm>', 'children': [], 'value': role.strip()}
            ]}
        ]}
        tags.append(t)


def process_subject(tags, metadata):
    value = find_metavalue('subject', metadata)
    if value is None:
        return
    for person in value.split(';'):
        name, role = person.split(',', 1)
        t = {'tag': '<subject>', 'children': [
            {'tag': '<name>', 'children': [], 'value': name.strip()},
            {'tag': '<role>', 'children': [
                {'tag': '<roleTerm>', 'children': [], 'value': role.strip()}
            ]}
        ]}
        tags.append(t)


def strip_tag(raw_tag):
    m = re.search(r'\<([a-zA-Z0-9-_]+).*', raw_tag)
    if not m:
        return None
    return m[1]


def stringify_tag(t, indent=0, formated=True):
    tag = t['tag']
    m = strip_tag(tag)
    if m is None:
        print('BAD TAG')
        return ''
    end_tag = '</%s>' % m
    data = ''
    indent_char = '\t' if formated else ''
    cr = '\n' if formated else ''
    ind = indent * indent_char
    if len(t['children']) > 0:
        data = cr.join([stringify_tag(x, indent + 1, formated) for x in t['children']])
    else:
        data = (indent + 1) * indent_char + t['value']
    return cr.join([ind + tag, ind + data, ind + end_tag])


def generate_mods(di, metadata, formated=True):
    '''

    :param di: Digital Item object
    :param metadata: list of metadata related to item or None
    :return: string with mods
    '''

    if metadata is None:
        metadata = [x for x in DBSession.query(Metadata).filter(Metadata.id == di.id_item).all()]

    # for m in metadata:
    #     print(str(m.get_dict()))

    # tags shoud be array of terms in form:
    # {'tag': '<TAG1>', 'children': {'tag': '<TAG2>', 'value': 'VALUE}}
    tags = []
    for metakey in TAGS:
        # print('Testing key %s' % metakey)
        value = find_metavalue(metakey, metadata)
        if value:
            # print('Adding metakey %s: %s' % (metakey, value))
            add_tag(tags, metakey, value)

    process_name(tags, metadata)
    process_subject(tags, metadata)

    return '\n'.join([MODS_HEADER] + [stringify_tag(x, 1, formated) for x in tags] + [MODS_FOOTER])


def parse_names(tree):
    names = tree.xpath('/mods/name')
    res = []
    for name in names:
        n = name.xpath('namePart')
        r = name.xpath('role/roleTerm')
        if len(n) > 0 and len(r) > 0:
            res.append('%s, %s' % (n[0].text.strip(), r[0].text.strip()))
    if len(res):
        return {'name': ';'.join(res)}
    return {}


def parse_subjects(tree):
    names = tree.xpath('/mods/subject')
    res = []
    for name in names:
        n = name.xpath('namePart')
        r = name.xpath('role/roleTerm')
        if len(n) > 0 and len(r) > 0:
            res.append('%s, %s' % (n[0].text.strip(), r[0].text.strip()))
    if len(res):
        return {'subject': ';'.join(res)}
    return {}


def parse_mods(mods):
    '''
    Parses MODS data
    :param mods: string with mods xml
    :return: metadata array
    '''
    metadata = {}
    tree = etree.fromstring(mods.encode('utf8'))
    for metakey in TAGS:
        path = '/'.join(['/mods'] + [strip_tag(x) for x in TAGS[metakey]])
        el = tree.xpath(path)
        if len(el) > 0:
            metadata[metakey] = el[0].text.strip()

    metadata.update(parse_names(tree))
    metadata.update(parse_subjects(tree))
    return metadata

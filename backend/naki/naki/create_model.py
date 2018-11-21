import sys
from string import Template
CT_TEXT = u'CREATE TABLE'

def parse_id(text):
    #print('parsing %s'%text)
    text=text.lstrip()
    if not text[0] == '`':
        return None, None
    name = text[1:text.find('`',1)]
    text = text[len(name)+2:].strip()
    #print ('returning %s,%s' % (name, text))
    return name, text

def parse_column(text):
    col_name, text = parse_id(text)
    type = text.split()[0]
    l = 0
    if '(' in type:
        type, lt = type.split('(')
        l = int(lt.split(')')[0])
    return col_name, type, l

def parse_table(text):

    text = text.strip()
    if not text.startswith(CT_TEXT):
        return None
    tbl_name, text = parse_id(text[len(CT_TEXT):])
    if not text[0] == '(':
        return None
    text = text[1:].strip()
    columns = [parse_column(c) for c in text.split(',')]
    return (tbl_name, columns)


TPL_MODEL=u'''
class ${name1}(Base):
    __tablename__ = "${name0}"
    
${columns}
        
    def __init__(self, ${col_names}):
${columns_init}

    def get_dict(self):
        return ({
${col_get_dict}
        })
        
    def set_from_dict(self, d):        
${col_set_dict}
        

'''

TYPE_MAPPING={
    u'text': (u'UnicodeText', False),
    u'varchar': ('Unicode', True),
    u'int': ('Integer', False),
    u'datetime': ('DateTime', False),
    u'blob': ('LargeBinary', False),
    u'tinyint': ('Integer', False),
    u'double': ('Float', False)

}

def gen_col_name(name):
    return name[1:].lower()

def gen_column(col):
    t = TYPE_MAPPING[col[1]]
    cname = gen_col_name(col[0])
    df = u'%s = Column(\'%s\', %s)'% (cname, col[0], t[0] if not t[1] else '%s(%s)'%(t[0], str(col[2])))
    return df, t[0], cname

TPL_IMPORTS='''from sqlalchemy import Column, ForeignKey
from sqlalchemy.types import ${types}
from naki.model.meta import Base
'''

def gen_model(table):
    name = table[0]
    columns = [gen_column(c) for c in table[1]]
    imports = sorted(list(set((x[1] for x in columns))))
    text = Template(TPL_IMPORTS).substitute({'types': ', '.join(imports)})



    text = text + Template(TPL_MODEL).substitute({
        'name0': name,
        'name1': name[1:],
        'columns': '\n'.join(('    %s'%x[0] for x in columns)),
        'col_names': ', '.join((x[2] for x in columns)),
        'columns_init': '\n'.join(('        self.%s = %s'%(x[2], x[2]) for x in columns)),
        'col_get_dict': '\n'.join(('            \'%s\': self.%s,'%(x[2], x[2]) for x in columns)),
        'col_set_dict': '\n'.join(('        self.%s = d[\'%s\']' % (x[2], x[2]) for x in columns)),
    })



    return text

def model_file_name(table):
    name = table[0][1:]
    name = name[0].lower() + name[1:]
    n2 = ''
    for x in name:
        if x.isupper():
            n2 = n2 + '_' + x.lower()
        else:
            n2 = n2 + x
    return n2


def process_table(text):
    table = parse_table(text)
    #print(table)
    model = gen_model(table)
    fname =  model_file_name(table) + '.py'
    print ('Saving to a file: %s' % fname)
    open(fname, 'wt').write(model)

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print('Usage %s <sql_file_with_db_structure.sql>')
        print('Run this script in the directory naki/model')
        sys.exit(1)

    lines = open(sys.argv[1]).readlines()
    text = u''
    for line in lines:
        line = line.lstrip()
        if not line or line.startswith('--') or line.startswith('/*'):
            continue
        if line.startswith(CT_TEXT):
            text = line
        elif 'ENGINE' in line:
            text = text + line
            process_table(text)
            text = u''
        elif text:
            text = text + line

    print ('Models created')
    print ('You need to manualy set primary keys for the models to function!')
    #process_table(i)

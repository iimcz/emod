import csv
import gspread
from oauth2client.service_account import ServiceAccountCredentials
import sys
import os.path
sys.path.insert(0, os.path.join(os.path.abspath(os.path.dirname(sys.argv[0])), '../backend/naki'))

from naki.lib.mods import generate_mods
from naki.model.metadata import Metadata

scope = ['https://spreadsheets.google.com/feeds']

# TODO: get credentaials for google drive and point to it here ↓
credentials = ServiceAccountCredentials.from_json_keyfile_name('naki.json', scope)

# ID of the spreadsheet on google doc (or use full url and uncomment open_by_url 
docid = "xxxxx"

client = gspread.authorize(credentials)
spreadsheet = client.open_by_key(docid)
#spreadsheet = client.open_by_url(docid)

for i, worksheet in enumerate(spreadsheet.worksheets()):
    print(i, worksheet)
    data = worksheet.get_all_values()
    if len (data) < 2 or len(data[0]) < 4 or len(data[0][3]) == 0:
        print('Ignoring sheet %s'%worksheet.title)
        continue

    col = 3
    while col < len(data[0]) and len (data[0][col]) != 0:
        name = data[0][col]
        print ('Processing %s'%name)
        row = 1
        m = []
        while row < len(data) and len (data[row][1]) != 0:
            key = data[row][1]
            value = data[row][col]
            if len(key) == 0 or len(value) == 0:
                row = row + 1
                continue

            # print(key, value)
            m.append(Metadata('', '', key, value))
            row = row + 1

        x = generate_mods('', m)
        # print(x)
        open('%s.mods.xml'%name, 'wb').write(x.encode('utf8'))

        col = col + 1


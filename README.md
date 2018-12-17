# EMOD

## Installation

### Requirements:
- python3
- nodejs
- mysql/mariadb


### Backend server
Import empty tables into a database from file *db_template.sql*.
Edit file *backend/naki/development.ini* and set:
- **sqlalchemy.url** - connection string for the database. E.g. `sqlalchemy.url = mysql://USER:PASSWORD@DBSERVER/DATABASE?charset=utf8&ssl=1`
- **naki.storage.root** - path to root of the storage tree

Prepare environment for the server:
```bash
$ cd backend/naki
$ python3 -m venv venv
$ env/bin/pip install --upgrade pip setuptools
$ env/bin/pip install -e ".[testing]"
```

And run the server:
```bash
$ env/bin/pserve development.ini
```

### Frontend
Edit file *frontend/lm-naki/src/app/app.site-config.ts* and set:
- **base_url** - url of the backend server
- **cookie_name** - name of the cookie used for authnetication

E.g.:
```typescript
export const base_url = 'http://192.168.22.56:9988/api/v1/';
export const cookie_name = 'nakiAuthToken';
```
Prepare environment:
```bash
$ cd frontend/lm-naki
$ npm install
```

And start development server:
```bash
$ npm run start
```

Now the site should be available at `http://localhost:4200`.
Open the site in a browser, click on *Login* in the menu and enter name and password *admin* to the login dialog.
After logging in, navigate to the menu, item *admin* and change you *username*, *fullname* and most importantly, *password*.

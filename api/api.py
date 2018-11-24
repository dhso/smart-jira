# -*- coding: utf-8 -*-
# /usr/bin/python

# 使用方法 python ./api.py

from bottle_session import SessionPlugin
import sys
import requests
import json
import re
import ssl
from jira import JIRA
from bottle import request, run, post, get, install, error
from bottle_sqlite import SQLitePlugin
install(SQLitePlugin(dbfile='smart_jira.db'))
install(SessionPlugin(cookie_lifetime=None, host='127.0.0.1'))
ssl._create_default_https_context = ssl._create_unverified_context
jiras = {}


@post('/jira/login')
def jira_login(db, session):
    try:
        username = request.json.get('username')
        password = request.json.get('password')
        if not username or not password:
            raise Exception('Invalid username or password')
        cookie = session.get_cookie()
        jiras[cookie] = JIRA(options={
            'server': 'http://127.0.0.1:8080',
            'verify': False
        }, auth=(username, password))
        return message(200, 'success', {
            'token': cookie
        })
    except Exception, e:
        return message(401, str(e))


@get('/jira/current_user')
def jira_current_user(db, session):
    try:
        global jiras
        return getJira(session).current_user()
    except Exception, e:
        return message(500, str(e))


@error(404)
def error404(error):
    return message(404, 'Nothing here, sorry')


def message(code, message, data=None):
    result = {
        'code': code,
        'message': message
    }
    if data:
        result['data'] = data
    return result


def getJira(session):
    global jiras
    jira = jiras.get(session.get_cookie())
    if not jira:
        raise Exception('Invalid session')
    return jira


run(host='0.0.0.0', port=8081, reloader=True, debug=True)

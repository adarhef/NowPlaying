#!/usr/bin/env python3
# encoding: utf-8
"""Use instead of `python3 -m http.server` when you need CORS"""

from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler

class HTTPRequestHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET')
        self.send_header('Cache-Control', 'no-cache, must-revalidate')
        return super(HTTPRequestHandler, self).end_headers()   

httpd = ThreadingHTTPServer(('localhost', 8000), HTTPRequestHandler)
httpd.serve_forever()
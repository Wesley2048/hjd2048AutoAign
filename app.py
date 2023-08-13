# -*- coding: utf-8 -*-
import base64
import cv2
import ddddocr
import flask
import json
import numpy as np

server = flask.Flask(__name__)

det = ddddocr.DdddOcr(det=False, ocr=False)

@server.route('/slideMatch', methods=['POST'])
def slide_match():
    data = flask.request.get_json()
    target_base64 = data.get('slider')
    background_base64 = data.get('background')

    target_bytes = base64.b64decode(target_base64)
    background_bytes = base64.b64decode(background_base64)

    res = det.slide_match(target_bytes, background_bytes)

    return {
        'distance': res['target'][0] - 74
    }

@server.errorhandler(500)
def handle_error(e):
    res = {"msg": "服务器内部错误"}
    return json.dumps(res), 500


if __name__ == "__main__":
    server.run(port=9991, host='0.0.0.0', debug=True)
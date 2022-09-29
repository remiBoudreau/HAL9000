# Python
from flask import Flask
from flask import request, jsonify, send_file
import os
import requests
import base64
import io

# Blenderbot
from transformers import BlenderbotTokenizer, BlenderbotForConditionalGeneration, Conversation, ConversationalPipeline

app = Flask(__name__)

@app.before_first_request
def before_first_request():   
    model_name = 'facebook/blenderbot-400M-distill'
    tokenizer = BlenderbotTokenizer.from_pretrained(model_name)
    model = BlenderbotForConditionalGeneration.from_pretrained(model_name)

    global nlp
    global conversation
    nlp = ConversationalPipeline(model=model, tokenizer=tokenizer)
    conversation = Conversation()
    return 'before_first_request complete'

@app.route('/api/hal9000', methods = ['GET','POST'])
def chatbot():
    text = request.get_json(force=True)['text']
    conversation.add_user_input(text)
    result = nlp([conversation], do_sample=False, max_length=1000)
    messages = []
    for is_user, text in result.iter_texts():
        messages.append({
            'is_user': is_user,
            'text': text
        })
    resp = jsonify({"success": messages})
    resp.status_code = 200
    response = requests.post(
        os.getenv("TTS_API"), 
        data=({
            'uuid': result.uuid,
            'text': messages[-1]['text'].strip()
        }))
    return send_file(io.BytesIO(response.content), mimetype='audio/wav', as_attachment="true", download_name='wtf.wav');

    if (response.status_code == 200):
        print(response.body)
        resp = jsonify({"success":True, })
        resp.status_code = 200
    else:
        resp = jsonify({"success":False})
        resp.status_code = response.status_code
    return resp

@app.route('/api/reset', methods = ['GET'])
def reset():
    conversation = Conversation()
    resp = jsonify({"success":True}) 
    resp.status_code = 200
    return resp

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)

# Python
from flask import Flask
from flask import request, jsonify, send_file
import os
import requests
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
    return response.content

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)

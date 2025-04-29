from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import pipeline

app = Flask(__name__)
CORS(app)

model_name = "distilbert-base-uncased-finetuned-sst-2-english"
fake_news_detector = pipeline("text-classification", model=model_name, device=-1)

MAX_SEQUENCE_LENGTH = 512

@app.route('/analyze', methods=['POST'])
def analyze():
    data = request.json
    text = data.get('text', '')

    if not text.strip():
        return jsonify({"error": "No text provided for analysis."}), 400

    try:
        
        truncated_text = text[:MAX_SEQUENCE_LENGTH]
        result = fake_news_detector(truncated_text)
        label = result[0]['label']
        score = result[0]['score']

        
        return jsonify({
            "label": label,
            "score": score
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(port=5000, debug=True)

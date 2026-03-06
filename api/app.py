from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib

app = Flask(__name__)
CORS(app)

model = joblib.load("../model/fake_profile_model.pkl")
vectorizer = joblib.load("../model/vectorizer.pkl")

@app.route("/predict", methods=["POST"])
def predict():
    
    data = request.json
    text = data["text"]
    
    X = vectorizer.transform([text])
    prediction = model.predict(X)[0]
    proba = model.predict_proba(X)[0]
    confidence = float(max(proba)) * 100
    
    label = "Fake" if prediction == 1 else "Legit"
    
    return jsonify({"prediction": label, "confidence": f"{confidence:.2f}%"})

if __name__ == "__main__":
    app.run(debug=True)
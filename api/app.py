from flask import Flask, request, jsonify
import joblib

app = Flask(__name__)

model = joblib.load("../model/fake_profile_model.pkl")
vectorizer = joblib.load("../model/vectorizer.pkl")

@app.route("/predict", methods=["POST"])
def predict():
    
    data = request.json
    text = data["text"]
    
    X = vectorizer.transform([text])
    prediction = model.predict(X)[0]
    
    label = "Fake" if prediction == 1 else "Legit"
    
    return jsonify({"prediction": label})

if __name__ == "__main__":
    app.run(debug=True)
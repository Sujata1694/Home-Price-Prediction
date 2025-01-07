from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import numpy as np
import pandas as pd
import json

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Load the model and columns once when the app starts
def load_resources():
    with open('banglore_home_prices_model.pickle', 'rb') as f:
        model = pickle.load(f)
    with open('columns.json', 'r') as f:
        columns_data = json.load(f)

    return model, columns_data['data_columns']

model, expected_columns = load_resources()

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Get the JSON data sent by the frontend
        data = request.get_json()
        
        # Create the input data dictionary all at once to avoid DataFrame fragmentation
        input_features = {
            'total_sqft': [int(data['total_sqft'])],
            'bath': [int(data['bath'])],
            'bhk': [int(data['size'])],
            'location': [data['location'].lower()]
        }
        
        # Create DataFrame in one go
        input_df = pd.DataFrame(input_features)
        
        
        # Create the one-hot encoded columns efficiently
        location_dummies = pd.get_dummies(input_df['location'])
        
        
        # Combine numeric features with location dummies
        numeric_features = input_df[['total_sqft', 'bath', 'bhk']]
        input_df = pd.concat([numeric_features, location_dummies], axis=1)
        
        
        # Add missing columns with 0s
        for col in expected_columns:
            if col not in input_df.columns:
                input_df[col] = 0
        
        # Reorder columns to match training order
        input_df = input_df[expected_columns]
        
        
        # Make prediction
        prediction = model.predict(input_df.values)
        
        return jsonify({
            'status': 'success',
            'prediction': float(prediction[0]),
            'units': 'lakhs'
        })
        
    except KeyError as ke:
        return jsonify({
            'status': 'error',
            'error': f'Missing required field: {str(ke)}',
            'message': 'Please ensure all required fields are provided'
        }), 400
        
    except ValueError as ve:
        return jsonify({
            'status': 'error',
            'error': str(ve),
            'message': 'Please ensure all numeric fields contain valid numbers'
        }), 400
        
    except Exception as e:
        return jsonify({
            'status': 'error',
            'error': str(e),
            'message': 'An unexpected error occurred'
        }), 500

if __name__ == '__main__':
    app.run(debug=True)

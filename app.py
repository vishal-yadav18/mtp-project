from flask import Flask, request, jsonify
import numpy as np
import joblib
from flask_cors import CORS

app = Flask(__name__)
CORS(app, supports_credentials=True, methods=['POST'])

model = joblib.load('random_forest_model.pkl')
loaded_scaler_X = joblib.load('scaler_X.pkl')
loaded_scaler_y = joblib.load('scaler_y.pkl')


@app.route('/predict', methods=['POST', 'GET'])
def get_pred():
    try:
        data = request.json
        input_data = np.array(data['ip']).reshape(1, -1)

        # Transform the input data using the trained scaler
        scaled_input_data = loaded_scaler_X .transform(input_data)

        # Make predictions
        predictions_scaled = model.predict(scaled_input_data)

        # Inverse transform the scaled predictions to get the original scale
        predictions = loaded_scaler_y.inverse_transform(predictions_scaled)
        predictions_list = predictions.tolist()
        ans = [round(i, 3) for i in predictions_list[0]]
        return jsonify({'preds': ans})
    except Exception as e:
        return jsonify({'error': str(e)})


if __name__ == '__main__':
    app.run(debug=False)

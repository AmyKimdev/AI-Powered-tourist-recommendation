from flask import Flask, request, jsonify
import pandas as pd
import torch
import torch.nn as nn
import torchvision.transforms as transforms
from torchvision.models import densenet121, DenseNet121_Weights
from PIL import Image
from io import BytesIO
import requests

app = Flask(__name__)

# DenseNet 모델 불러오기 및 feature extractor 설정
weights = DenseNet121_Weights.IMAGENET1K_V1
model = densenet121(weights=weights)
model.classifier = nn.Identity()  # DenseNet의 분류기를 제거하고 feature extractor로 사용
model.eval()

# 이미지 전처리 함수
def preprocess_image(image, is_url=False):
    transform = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
    ])
    if is_url:
        response = requests.get(image)
        image = Image.open(BytesIO(response.content)).convert('RGB')
    else:
        image = Image.open(image).convert('RGB')
    image = transform(image).unsqueeze(0)
    return image

# 이미지 임베딩 생성 함수
def get_image_embedding(image, is_url=False):
    image_tensor = preprocess_image(image, is_url)
    with torch.no_grad():
        embedding = model(image_tensor)
    return embedding.numpy()  # numpy 배열로 변환

# 임베딩이 저장된 데이터프레임 불러오기
df = pd.read_pickle('densenet_embedding.pkl')

# 유사도 계산 함수
def calculate_similarity(input_image_embedding):
    similarities = []
    for idx, row in df.iterrows():
        if row['embedding'] is not None:
            db_image_embedding = row['embedding']
            similarity = torch.nn.functional.cosine_similarity(
                torch.tensor(input_image_embedding), torch.tensor(db_image_embedding)
            ).item()  # PyTorch 코사인 유사도 계산
            similarity_percentage = similarity * 100  # 유사도를 백분율로 변환
            similarities.append((similarity_percentage, row['sigungu'],row['id'], row['galWebImageUrl'], row['galTitle'], row['mapx'], row['mapy']))

    # 유사성 내림차순으로 정렬하여 가장 유사한 이미지 출력
    similarities.sort(reverse=True, key=lambda x: x[0])
    top_similarities = similarities[:3]

    results = [{"similarity": similarity, "location": sigungu, "location_id":sigungu_id, "image_url": url, "gal_title": title, "mapx":mapx, "mapy":mapy } for similarity, sigungu ,sigungu_id, url, title,mapx,mapy in top_similarities]
    return results


@app.route('/similarity', methods=['POST'])
def similarity_endpoint():
    image_url = request.json.get('image_url')
    if image_url:
        try:
            input_image_embedding = get_image_embedding(image_url, is_url=True)
        except Exception as e:
            return jsonify({"error": f"Error processing input image: {str(e)}"}), 500
    else:
        if 'file' not in request.files:
            return jsonify({"error": "No file part"}), 400
        file = request.files['file']
        if file.filename == '':
            return jsonify({"error": "No selected file"}), 400

        try:
            input_image_embedding = get_image_embedding(file)
        except Exception as e:
            return jsonify({"error": f"Error processing input image: {str(e)}"}), 500

    # 유사도 계산 함수 호출
    results = calculate_similarity(input_image_embedding)
    print(results)
    return jsonify(results)



if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5000)







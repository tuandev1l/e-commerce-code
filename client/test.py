import requests
from io import BytesIO

parser.add_argument('--output', type=str, default="", required=False)

cloth_res = requests.get(cloth_path)
model_res = requests.get(model_path)

cloth_img = Image.open(BytesIO(cloth_res.content)).resize((768, 1024))
model_img = Image.open(BytesIO(model_res.content)).resize((768, 1024))

image.save(f'./images_output/{args.output}')

from typing import Union
from fastapi import FastAPI
from sentence_transformers import SentenceTransformer
from imgbeddings import imgbeddings
import numpy as np
import requests
from PIL import Image
from pydantic import BaseModel

app = FastAPI()
model = SentenceTransformer('keepitreal/vietnamese-sbert')
ibed = imgbeddings()


class Body(BaseModel):
  data: str


@app.post("/convert/text")
def convert_text(body: Body):
  data = np.array(model.encode(body.data)).tolist()
  return {
      "status": "success",
      "data": data
  }


@app.post("/convert/img")
def convert_img(body: Body):
  image = Image.open(requests.get(body.data, stream=True).raw)
  data = np.array(ibed.to_embeddings([image])[0]).tolist()
  return {
      "status": "success",
      "data": data
  }

from fastapi import FastAPI, File, UploadFile
import shutil

app = FastAPI()

@app.post("/uploadfile")
async def create_upload_file(file: UploadFile = File(...)):
    folder = '/Users/leejaewon/Documents/KDT/FastAPI'

    if not file:
        return {"message": "파일이 존재하지 않음"}
    else:
        file_path = f"{folder}/{file.filename}"
        with open(file_path, "wb") as datas:
            shutil.copyfileobj(file.file, datas)

        return {"filename": file.filename}
from fastapi import FastAPI
from db_engine.mongo import DB_Cursor as db

# from starlette.responses import RedirectResponse
# from starlette.templating import Jinja2Templates

# templates = Jinja2Templates(directory="templates")


app = FastAPI(root_path="/api")


@app.get("/")
def return_root():
    return {"Ahoy": "Mateys!"}


# DB Engine 
@app.post("/db_engine/create")
def create_document(insert: dict):
    db.create_document(insert)
    return {"status": "Record Created", "id": f"{db.document_id}"}


@app.get("/db_engine/read")
def read_document(query:dict):
    doc = db.read_document(query)
    return {"query": f"{doc}"}


@app.put("/db_engine/update")
def update_document(query: dict, update: dict):
    db.update_document(query, update)
    return {"status": "Record Updated", "new_record": f"{update}"}


@app.delete("/db_engine/delete")
def delete_document(query: dict):
    db.delete_document(query)




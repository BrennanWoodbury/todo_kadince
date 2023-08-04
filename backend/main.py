from fastapi import FastAPI
from db_engine.mongo import DB_Cursor as db

# from starlette.responses import RedirectResponse
# from starlette.templating import Jinja2Templates

# templates = Jinja2Templates(directory="templates")


app = FastAPI(root_path="/api")

todo_db = db(database="todo", collection = "tasks")

@app.get("/")
def return_root():
    return {"Ahoy": "Mateys!"}


# DB Engine 
@app.post("/db_engine/create")
def create_document(insert: dict):
    todo_db.create_document(insert)
    return {"status": "Record Created", "id": f"{todo_db.document_id}"}


@app.get("/db_engine/read")
def read_document(query:dict):
    doc = todo_db.read_document(query)
    return {"query": f"{doc}"}


@app.put("/db_engine/update")
def update_document(query: dict, update: dict):
    todo_db.update_document(query, update)
    return {"status": "Record Updated", "new_record": f"{update}"}


@app.delete("/db_engine/delete")
def delete_document(query: dict):
    todo_db.delete_document(query)




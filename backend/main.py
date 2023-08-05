from fastapi import FastAPI
from fastapi.encoders import jsonable_encoder
from db_engine.mongo import DB_Cursor as db
from bson import json_util, ObjectId
from pydantic import BaseModel
import pydantic
import logging
import json

# pydantic.json.ENCODERS_BY_TYPE[ObjectId]=str

logging.basicConfig(filename="/var/log/fastapi/fastapi.log", level=logging.DEBUG)

# from starlette.responses import RedirectResponse
# from starlette.templating import Jinja2Templates

# templates = Jinja2Templates(directory="templates")


app = FastAPI(root_path="/api")
# app = FastAPI()

todo_db = db(database="todo", collection = "tasks")

# DB Methods
@app.get("/")
def return_root():
    return {"Ahoy": "Mateys!"}


# DB Engine 
@app.post("/api/db_engine/create")
def create_document(insert: dict):
    todo_db.create_document(insert)
    return {"status": "Record Created"}


@app.get("/api/db_engine/read")
def read_document(query:dict):
    doc = todo_db.read_document(query)
    return {"query": f"{doc}"}


@app.put("/api/db_engine/update")
def update_document(query: dict, update: dict):
    todo_db.update_document(query, update)
    return {"status": "Record Updated", "new_record": f"{update}"}


@app.delete("/api/db_engine/delete")
def delete_document(query: dict):
    todo_db.delete_document(query)

@app.get("/api/health_check")
def health_check():
    return todo_db.test_connection()
    


# Logic
@app.get("/api/tasks")
def get_tasks():
    document = todo_db.read_document(jsonable_encoder({}))
    tasks = {"tasks": []}
    for i in document:
        tasks["tasks"].append(i)
    return tasks


class Task(BaseModel):
    Name: str

@app.post("/api/new_task", status_code=201)
def new_task(task: Task):
    # add a task 
    # intake a singlular task, add it to the database 
    # task = {"Name": task}
    logging.debug(jsonable_encoder(task))
    new_task = todo_db.create_document(jsonable_encoder(task))
    return {"Status": "Success", "_id": json.loads(json_util.dumps(new_task))}
from fastapi import FastAPI
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse
from db_engine.mongo import DB_Cursor as db
from bson import json_util, ObjectId
from pydantic import BaseModel, Field
from typing import Optional
import pydantic
import logging
import json
import pymongo

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
    tasks = json.loads(json_util.dumps(tasks))
    return tasks


def return_oid():
    o = json.loads(json_util.dumps(ObjectId()))
    return o["_id"]["$oid"]



class Task(BaseModel):
    # id: Optional[str] = Field(alias="_id",default=json.loads(json_util.dumps(ObjectId()))["_id"]["$oid"]) 
    Name: Optional[str]
    Status: int | None = 0

class Update_Task(BaseModel):
   id: str = Field(alias="_id")
   Name: Optional[str] 

class Complete_Task(BaseModel):
    id: str = Field(alias="_id") 

# class Update_Task(BaseModel):



@app.post("/api/new_task")
def new_task(task: Task):
    task = jsonable_encoder(task)
    logging.debug(f"Incoming request: {task}")
    if task["Name"] == "":
        return JSONResponse(content = "Value cannot be null", status_code=200)
    check_task_exists = todo_db.read_document(task)
    
    results = []
    for i in check_task_exists:
        logging.debug(f"Task exists: {i}")
        results.append(i)
    
    if len(results) > 0:
        return JSONResponse(content="Duplicate Value", status_code=409)
    elif len(results) == 0: 
        new_task = todo_db.create_document(task)
        return JSONResponse(content="Success", status_code=201)


@app.delete("/api/delete_task")
def delete_task(task: Update_Task):
    task = jsonable_encoder(task)
    query = {"_id": ObjectId(task["_id"]), "Name": task["Name"]}
    todo_db.delete_document(query)
    return JSONResponse(content="Document Removed", status_code=200)


@app.put("/api/update_task")
def update_task(task: Update_Task):
    task = jsonable_encoder(task)
    query = {"_id": ObjectId(task["_id"])}
    update = {"Name": task["Name"]}
    todo_db.update_document(query, update)

    return JSONResponse(content="Document Updated", status_code=200)


@app.put("/api/complete_task")
def complete_task(task: Complete_Task):
    task = jsonable_encoder(task)
    logging.debug(task)
    query = {"_id": ObjectId(task["_id"])}
    update = {"Status": 1}
    todo_db.update_document(query, update)


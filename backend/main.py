"""
bulk of the backend logic, where the actual work is being done. 
Everything else in the backend is in service of main.py
"""

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
from data_models import models


logging.basicConfig(filename="/var/log/fastapi/fastapi.log", level=logging.DEBUG)




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
    document = todo_db.read_document(jsonable_encoder({"Status": 0}))
    tasks = {"tasks": []}
    for i in document:
        tasks["tasks"].append(i)
    tasks = json.loads(json_util.dumps(tasks))
    return tasks

@app.get("/api/completed_tasks")
def completed_task():
    document = todo_db.read_document(jsonable_encoder({"Status": 1}))
    tasks = {"tasks": []}
    for i in document:
        tasks["tasks"].append(i)
    tasks = json.loads(json_util.dumps(tasks))
    return tasks

@app.get("/api/tasks_all")
def tasks_all():
    document = todo_db.read_document(jsonable_encoder({}))
    tasks = {"tasks": []}
    for i in document:
        tasks["tasks"].append(i)
    tasks = json.loads(json_util.dumps(tasks))
    return tasks




@app.post("/api/new_task")
def new_task(task: models.Task):
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
def delete_task(task: models.Update_Task):
    task = jsonable_encoder(task)
    query = {"_id": ObjectId(task["_id"]), "Name": task["Name"]}
    todo_db.delete_document(query)
    return JSONResponse(content="Document Removed", status_code=200)


@app.put("/api/update_task")
def update_task(task: models.Update_Task):
    task = jsonable_encoder(task)
    query = {"_id": ObjectId(task["_id"])}
    update = {"Name": task["Name"]}
    todo_db.update_document(query, update)

    return JSONResponse(content="Document Updated", status_code=200)


@app.put("/api/remove_completed_task")
def remove_completed_task(task: models.Update_Task):
    task = jsonable_encoder(task)
    query = {"_id": ObjectId(task["_id"])}
    update = {"Status": 0}
    todo_db.update_document(query, update)


@app.put("/api/complete_task")
def complete_task(task: models.Complete_Task):
    task = jsonable_encoder(task)
    logging.debug(task)
    query = {"_id": ObjectId(task["_id"])}
    update = {"Status": 1}
    todo_db.update_document(query, update)
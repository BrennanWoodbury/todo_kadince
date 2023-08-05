from pymongo import MongoClient
from dotenv import dotenv_values


env = dotenv_values(dotenv_path="/code/todo_kadince/backend/.env")

class DB_Connect:  # one instance of this object per database
    def __init__(self, database: str, collection: str):
        self.database = database
        self.collection = collection
        self.user = env["MONGODB_USER"]
        self.passwd = env["MONGODB_PASSWD"]
        self.uri = env["MONGODB_URI"]
        self.connection_string = f"mongodb://{self.user}:{self.passwd}@{self.uri}"

        self.client = MongoClient(self.connection_string)
        self.db = self.client[database]  # user input

    def __enter__(self):
        pass

    def __exit__(self, exc_type, exc_val, exc_tb):
        self.client.close()


    # test connection  
    def test_connection(self):
        print(self.client.list_database_names())
        

    def close_connection(self):
        self.client.close()
        print("Client Closed")



    

class DB_Cursor(DB_Connect):
    def __init__(self, database: str, collection: str):
        super().__init__(database, collection)
        self.db_cursor = self.db[self.collection]
        self.document_id = None
        self.document_ids = None

    def create_document(self, insert: dict):
        inserted_doc = self.db_cursor.insert_one(insert)
        self.document_id = inserted_doc.inserted_id
        return self.document_id

    def create_documents(self, insert: list): 
        inserted_docs = self.db_cursor.insert_many(insert)
        self.document_ids = inserted_docs.inserted_ids
        return self.document_ids

    def read_document(self, query: dict): 
        document = self.db_cursor.find(query, {"_id": 0})
        return document
    
    def update_document(self, query: dict, update: dict):
        update = self.db_cursor.update_one(query, {"$set": {update}})

    def delete_document(self, query):
        delete = self.db_cursor.delete_one(query)
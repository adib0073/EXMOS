from pymongo import MongoClient
from constants import *
import uuid

def get_database(): 
   # Create a connection using MongoClient.
   client = MongoClient(CONNECTION_STRING)
   # Create the database
   return client, client[DBNAME]


def fetch_user_details(user):
    client, db = get_database()
    collection_name = db[USER_COLLECTION]
    user_details = collection_name.find_one({"UserName" : user})
    return client, user_details

def update_user_details(user, newValues):
    client, db = get_database()
    collection_name = db[USER_COLLECTION]
    collection_name.update_one({"UserName" : user}, { "$set": newValues })
    client.close()   

def insert_accuracy_detail(accuracy_detail):
    client, db = get_database()
    collection_name = db[ACCURACY_COLLECTION]
    accuracy_detail.update({"_id": uuid.uuid4().hex})
    collection_name.insert_one(accuracy_detail)
    client.close()
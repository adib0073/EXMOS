from pymongo import MongoClient
from constants import *

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
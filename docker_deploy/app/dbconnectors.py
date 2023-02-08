from pymongo import MongoClient
from constants import *

def get_database(): 
   # Create a connection using MongoClient.
   client = MongoClient(CONNECTION_STRING)
   # Create the database
   return client, client[DBNAME]
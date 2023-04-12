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
    user_details = collection_name.find_one({"UserName": user})
    return client, user_details


def fetch_autocorrect_configs(user):
    client, db = get_database()
    collection_name = db[AUTOCORRECT_CONFIG]
    autocorrect_configs = collection_name.find_one({"UserName": user})
    client.close()
    if autocorrect_configs is None:
        return None
    return autocorrect_configs["AutoCorrectConfig"]


def update_user_details(user, newValues):
    client, db = get_database()
    collection_name = db[USER_COLLECTION]
    collection_name.update_one({"UserName": user}, {"$set": newValues})
    client.close()


def insert_autocorrect_configs(autocorrect_configs):
    client, db = get_database()
    collection_name = db[AUTOCORRECT_CONFIG]
    autocorrect_configs.update(
        {"_id": autocorrect_configs["UserName"]+autocorrect_configs["Cohort"]})
    collection_name.insert_one(autocorrect_configs)
    client.close()


def update_autocorrect_details(user, newValues):
    client, db = get_database()
    collection_name = db[AUTOCORRECT_CONFIG]
    collection_name.update_one({"UserName": user}, {"$set": newValues})
    client.close()


def insert_accuracy_detail(accuracy_detail):
    client, db = get_database()
    collection_name = db[ACCURACY_COLLECTION]
    accuracy_detail.update({"_id": uuid.uuid4().hex})
    collection_name.insert_one(accuracy_detail)
    client.close()


def insert_interaction_data(interaction_detail):
    client, db = get_database()
    collection_name = db[INTERACTIONS_COLLECTION]
    interaction_detail.update(
        {"_id": interaction_detail["user"]+interaction_detail["cohort"]+uuid.uuid4().hex})
    collection_name.insert_one(interaction_detail)
    client.close()

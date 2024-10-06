import requests
import sqlite3

BASE_URL = "https://ssd-api.jpl.nasa.gov/sbdb_query.api"

queryParams = {
    "fields": "spkid,pdes,a,e,i,om,w,ma,per,neo,pha,class,first_obs,last_obs",
    "sb-group": "neo",
    "sb-kind": "a",
    "sb-class": "IEO,ATE,APO,AMO",
};

res = requests.get(BASE_URL, queryParams).json()

clean_data = []
for obj in res["data"]:
    the_obj = []
    the_obj.append(obj[0])
    try:
        the_obj.append(obj[1].strip())
        the_obj.append(float(obj[2]))
        the_obj.append(float(obj[3]))
        the_obj.append(float(obj[4]))
        the_obj.append(float(obj[5]))
        the_obj.append(float(obj[6]))
        the_obj.append(float(obj[7]))
        the_obj.append(float(obj[8]))
        the_obj.append(1 if obj[9] == "Y" else 0)
        the_obj.append(1 if obj[10] == "Y" else 0)
        the_obj.append(obj[11].strip())
        the_obj.append(obj[12].strip())
        the_obj.append(obj[13].strip())
        clean_data.append(the_obj)
    except:
        pass

print(len(clean_data))

conn = sqlite3.connect("holocron.db")
cur = conn.cursor()
cur.executemany("insert into small_body values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? ,?)", clean_data)
conn.commit()

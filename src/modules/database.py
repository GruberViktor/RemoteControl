import influxdb
from datetime import datetime
import urllib3

from config import config

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

conf = config['INFLUXDB']

if conf.get(host, False):
    client = influxdb.InfluxDBClient(
        host=conf['host'],
        port=conf['port'],
        username=conf['user'],
        password=conf['password'],
        ssl=conf.getboolean('ssl'),
        verify_ssl=conf.getboolean('verify_ssl'),
    )
    client.switch_database(conf['database'])
else:
    client = False



def write_to_db(data: dict):
    if not client:
        return
    now_iso = datetime.now().isoformat()
    json_body = [
        {
            "measurement": conf['measurement'],
            "time": now_iso,
            "fields": data,
        }
    ]
    try:
        client.write_points(json_body)
    except influxdb.exceptions.InfluxDBServerError:
        print("Server Timout")
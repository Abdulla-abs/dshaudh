import sqlite3

conn = sqlite3.connect('analysis/jsb-native.sqlite')
c = conn.cursor()
c.execute("DELETE FROM data WHERE key IN ('dino.local.native.v1', 'dino.local.native.status')")
conn.commit()
conn.close()
print("Cleaned sqlite save")

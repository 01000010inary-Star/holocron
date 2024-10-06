if [ -e "../public/data/holocron.db" ]
then
    rm "../public/data/holocron.db"
fi

sqlite3 "holocron.db" < "holocron-db.sql"

if [ ! -d "venv" ]
then
    python3 -m venv venv
fi

source venv/bin/activate
pip install -r requirements.txt
python dataFetcher.py
deactivate

mkdir -p "../public/data"
mv "holocron.db" "../public/data/holocron.db"

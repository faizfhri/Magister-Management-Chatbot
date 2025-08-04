from flask import Flask, request, jsonify
from flask_cors import CORS
import psycopg2
import uuid
import os

app = Flask(__name__)
CORS(app)

# Supabase credentials (gunakan env var di production)
DB_URL = os.getenv("SUPABASE_DB_URL", "postgresql://postgres:postgres@localhost:5432/postgres")

# DB connection
conn = psycopg2.connect(DB_URL)
conn.autocommit = True

# Route untuk ambil FAQ
@app.route('/faqs', methods=['GET'])
def get_faqs():
    with conn.cursor() as cur:
        cur.execute("SELECT id, question, answer FROM faq")
        faqs = [{"id": row[0], "question": row[1], "answer": row[2]} for row in cur.fetchall()]
    return jsonify(faqs)

# Route untuk buat FAQ baru
@app.route('/faqs', methods=['POST'])
def create_faq():
    data = request.get_json()
    question = data.get('question')
    answer = data.get('answer')

    new_id = str(uuid.uuid4())
    with conn.cursor() as cur:
        cur.execute("INSERT INTO faq (id, question, answer) VALUES (%s, %s, %s)", (new_id, question, answer))
    return jsonify({"id": new_id, "question": question, "answer": answer})

# Route untuk update FAQ
@app.route('/faqs/<faq_id>', methods=['PUT'])
def update_faq(faq_id):
    data = request.get_json()
    question = data.get('question')
    answer = data.get('answer')

    with conn.cursor() as cur:
        cur.execute("UPDATE faq SET question = %s, answer = %s WHERE id = %s", (question, answer, faq_id))
        if cur.rowcount == 0:
            return jsonify({"message": "FAQ not found"}), 404
    return jsonify({"id": faq_id, "question": question, "answer": answer})

# Route untuk hapus FAQ
@app.route('/faqs/<faq_id>', methods=['DELETE'])
def delete_faq(faq_id):
    with conn.cursor() as cur:
        cur.execute("DELETE FROM faq WHERE id = %s", (faq_id,))
        if cur.rowcount == 0:
            return jsonify({"message": "FAQ not found"}), 404
    return jsonify({"message": "FAQ deleted"})

if __name__ == '__main__':
    app.run(debug=True)

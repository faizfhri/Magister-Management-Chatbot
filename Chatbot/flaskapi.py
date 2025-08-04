from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
from sentence_transformers import SentenceTransformer, util
from langchain.prompts import PromptTemplate
from langchain_ollama import ChatOllama
from langchain.memory import ConversationBufferMemory

app = Flask(__name__)
CORS(app)

# === 1. Inisialisasi LLM (Ollama atau Hugging Face via Ollama wrapper) ===
ollama_model = "https://huggingface.co/gmonsoon/gemma2-9b-cpt-sahabatai-v1-instruct-GGUF"

llm = ChatOllama(
    model=ollama_model,
    temperature=0.5
)

# === 2. Inisialisasi Embedding Model ===
embedding_model = SentenceTransformer("all-MiniLM-L6-v2")

# URL Edge Function Supabase kamu
SUPABASE_FAQ_URL = "https://zpwasiqrcqvhdvyyskdv.supabase.co/functions/v1/crud/faqs"

# === 3. Ambil dan cari data dari Supabase ===
def retrieve_answer(query, top_k=3):
    try:
        response = requests.get(SUPABASE_FAQ_URL)
        if response.status_code != 200:
            return "Gagal mengambil data dari Supabase."

        faqs = response.json()
        if not faqs:
            return "Tidak ada data FAQ di Supabase."

        # Encode pertanyaan pengguna dan semua FAQ
        query_embedding = embedding_model.encode(query, convert_to_tensor=True)
        faq_texts = [f"{faq['question']} {faq['answer']}" for faq in faqs]
        faq_embeddings = embedding_model.encode(faq_texts, convert_to_tensor=True)

        # Hitung cosine similarity
        scores = util.pytorch_cos_sim(query_embedding, faq_embeddings)[0]
        top_results = scores.topk(k=top_k)

        context_list = []
        for idx in top_results.indices:
            faq = faqs[int(idx)]
            context_list.append(f"[{faq.get('category', 'Umum')}] {faq.get('answer', '')}")

        return "\n".join(context_list) if context_list else "Tidak ada informasi yang relevan."

    except Exception as e:
        return f"Terjadi kesalahan saat mengambil data: {str(e)}"

# === 4. Prompt Template ===
prompt_template = PromptTemplate(
    input_variables=["query", "context"],
    template=(
        "Anda adalah chatbot akademik yang menjawab pertanyaan mahasiswa dengan informasi yang akurat.\n"
        "Gunakan hanya informasi dari konteks berikut dan jangan mengarang jawaban.\n"
        "Konteks mencakup kategori seperti Pendaftaran, Perkuliahan, Kurikulum, dst.\n"
        "Jika pertanyaan bersifat umum, berikan jawaban selengkap mungkin.\n"
        "Jika tidak ada informasi, katakan 'Saya tidak tahu'.\n\n"
        "Konteks:\n{context}\n\n"
        "Pertanyaan:\n{query}\n\n"
        "Jawaban (gunakan format yang rapi dan informatif):\n"
    )
)

memory = ConversationBufferMemory()

# === 5. Endpoint untuk Chatbot ===
@app.route("/chat", methods=["POST"])
def chat():
    data = request.json
    user_message = data.get("message", "")

    if not user_message:
        return jsonify({"response": "Pesan tidak boleh kosong."})

    # Ambil konteks dari Supabase
    context = retrieve_answer(user_message, top_k=3)

    # Simpan riwayat percakapan
    memory.save_context({"query": user_message}, {"response": context})
    history = memory.load_memory_variables({}).get("history", "")

    # Bangun prompt
    formatted_prompt = prompt_template.format(query=user_message, context=f"{history}\n{context}")

    # Dapatkan jawaban dari LLM
    response = llm.invoke(formatted_prompt)

    # Simpan ke memori
    memory.save_context({"query": user_message}, {"response": response.content})

    return jsonify({"response": response.content})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)

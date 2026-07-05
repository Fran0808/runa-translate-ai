import sys

print("[*] Iniciando verificación del modelo local de traducción...")
print("[*] Importando librerías de IA (esto puede tomar unos segundos)...")

try:
    from transformers import AutoModelForSeq2SeqLM, AutoTokenizer
    import torch
except ImportError as ie:
    print(f"\n[-] ERROR: Faltan librerías requeridas de IA en tu entorno virtual: {ie}")
    print("    Asegúrate de haber ejecutado: pip install -r requirements.txt")
    sys.exit(1)

model_name = "facebook/nllb-200-distilled-600M"

try:
    print(f"[*] Cargando modelo '{model_name}' en la memoria RAM...")
    print("    (Si es la primera vez que se ejecuta en esta PC, iniciará la descarga de ~1.1GB de Hugging Face)...")
    
    tokenizer = AutoTokenizer.from_pretrained(model_name)
    model = AutoModelForSeq2SeqLM.from_pretrained(model_name)
    
    # Frase de prueba
    texto_prueba = "Buenos días, ¿cómo estás?"
    print(f"\n[*] Texto de prueba (Español): '{texto_prueba}'")
    
    # 1. Prueba a Quechua
    print("[*] Probando traducción a Quechua...")
    tokenizer.src_lang = "spa_Latn"
    inputs_qu = tokenizer(texto_prueba, return_tensors="pt")
    tokens_qu = model.generate(
        **inputs_qu,
        forced_bos_token_id=tokenizer.convert_tokens_to_ids("quy_Latn"),
        max_length=100
    )
    resultado_qu = tokenizer.batch_decode(tokens_qu, skip_special_tokens=True)[0]
    
    # 2. Prueba a Aimara
    print("[*] Probando traducción a Aimara...")
    inputs_ay = tokenizer(texto_prueba, return_tensors="pt")
    tokens_ay = model.generate(
        **inputs_ay,
        forced_bos_token_id=tokenizer.convert_tokens_to_ids("ayr_Latn"),
        max_length=100
    )
    resultado_ay = tokenizer.batch_decode(tokens_ay, skip_special_tokens=True)[0]
    
    print("\n[+] ===========================================")
    print("[+] VERIFICACIÓN EXITOSA DEL MODELO LOCAL")
    print(f"[+] Traducido a Quechua (quy_Latn): '{resultado_qu}'")
    print(f"[+] Traducido a Aimara (ayr_Latn):  '{resultado_ay}'")
    print("[+] El modelo NLLB-200 está listo para usarse localmente.")
    print("[+] ===========================================\n")
    
except Exception as e:
    print(f"\n[-] ERROR AL EJECUTAR LA TRADUCCIÓN: {e}")
    print("    Verifica que tu PC tenga conexión a internet para la descarga inicial y suficiente memoria RAM libre (~4GB).")

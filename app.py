from flask import Flask, render_template, request, jsonify
from scanner import scan_urls

app = Flask(__name__, static_folder="static", template_folder="templates")

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/scan", methods=["POST"])
def scan():
    try:
        data = request.get_json(force=True)
        urls = data.get("urls", [])
        options = data.get("options", {})
        
        if not urls:
            return jsonify({"error": "No URLs provided"}), 400

        results = scan_urls(urls, options)
        return jsonify(results)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    # For local dev
    app.run(host="0.0.0.0", port=5000, debug=True)

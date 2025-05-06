from flask import Blueprint, jsonify, request, current_app
from database import db_pool
from werkzeug.utils import secure_filename
import os

bp = Blueprint("images", __name__)

@bp.route("/", methods=["GET"])
def get_image_by_id():
    image_id = request.args.get("image_id")
    try:
        image_path = os.path.join(current_app.config["UPLOAD_FOLDER"], f"{image_id}.png")
        
        if not os.path.exists(image_path):
            return jsonify({"error" : f"No image with id {image_id}"}), 400
        
        return jsonify({"url": f"/images/{image_id}.png"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

#TODO
@bp.route("/", methods=["POST"])
def upload_image():
    data = request.get_json()
    event_id = data.get("event_id")
    try:
        if "image" not in request.files:
            return jsonify({"error": "No image part in the request"}), 400

        image = request.files["image"]

        if image.filename == "":
            return jsonify({"error": "Empty image"}), 400

        if not image.filename.lower().endswith("png"):
            return jsonify({"error": "Please use .png images only"}), 400


        next_filename = 1
        all_image_ids = []
        for filename in os.listdir(current_app.config["UPLOAD_FOLDER"]):
            if filename.endswith(".png"):
                name = filename.split(".")[0]
                if name.isdigit():
                    all_image_ids.append(int(name))

        next_filename = max(all_image_ids) + 1

        if not next_filename:
            next_filename = 1
         
        image.save(os.path.join(current_app.config["UPLOAD_FOLDER"], f"{next_filename}.png"))

        return jsonify({"message": "Image uploaded", "url": f"/images/{next_filename}.png"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
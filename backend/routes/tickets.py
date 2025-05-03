from flask import Blueprint, jsonify, request
from database import db_pool

bp = Blueprint("tickets", __name__)
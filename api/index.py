import os
import requests
from flask import Flask, jsonify, redirect, session, url_for, request
from dotenv import load_dotenv, find_dotenv

# Load environment variables from .env
load_dotenv()

app = Flask(__name__)

# NYT API constants
NYT_API_KEY = os.getenv("NYT_TIMES_API_KEY")
TOP_STORIES_URL = os.getenv("TOP_STORIES_URL")
ARTICLE_SEARCH_URL = os.getenv("ARTICLE_SEARCH_URL")


if not NYT_API_KEY:
    raise ValueError("Missing NYT_TIMES_API_KEY in environment variables.")
 
# ---------------------------
# NYT API Routes
# ---------------------------
@app.route('/api/top-stories', methods=['GET'])
def top_stories():
    section = request.args.get('section', 'home')
    url = f"{TOP_STORIES_URL}{section}.json"
    headers = {"Accept": "application/json"}
    try:
        response = requests.get(url, headers=headers, params={'api-key': NYT_API_KEY})
        response.raise_for_status()
        data = response.json()
        return jsonify({
            'results': data.get('results', []),
            'total': len(data.get('results', []))
        })
    except requests.exceptions.RequestException as e:
        return jsonify({'error': 'Request failed', 'details': str(e)}), 500
    except Exception as e:
        return jsonify({'error': 'Unexpected error', 'details': str(e)}), 500

@app.route('/api/search-articles', methods=['GET'])
def search_articles():
    q = request.args.get('q', '')
    fq = request.args.get('fq', '')
    begin_date = request.args.get('begin_date', '')
    end_date = request.args.get('end_date', '')
    page = request.args.get('page', '0')
    params = {'api-key': NYT_API_KEY, 'q': q, 'page': page}
    if fq:
        params['fq'] = fq
    if begin_date:
        params['begin_date'] = begin_date  # Format: YYYYMMDD
    if end_date:
        params['end_date'] = end_date
    try:
        response = requests.get(ARTICLE_SEARCH_URL, params=params)
        response.raise_for_status()
        data = response.json()
        return jsonify({
            'results': data.get('response', {}).get('docs', []),
            'meta': data.get('response', {}).get('meta', {})
        })
    except requests.exceptions.RequestException as e:
        return jsonify({'error': 'Request failed', 'details': str(e)}), 500
    except Exception as e:
        return jsonify({'error': 'Unexpected error', 'details': str(e)}), 500


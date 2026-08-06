import re
import os
from pathlib import Path
import requests
from groq import Groq
from dotenv import load_dotenv

env_path = Path(__file__).parent / ".env"
load_dotenv(dotenv_path=env_path)

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

UTM_PATTERN = re.compile(r"utm_[a-zA-Z]+=[\w\-\.]+")

def check_url_reachable(url):
    try:
        response = requests.get(url, timeout=5)
        passed = response.status_code < 400
        detail = "HTTP " + str(response.status_code)
        return passed, detail
    except requests.RequestException as e:
        return False, "Unreachable: " + str(e)

def check_tracking_tag(tag):
    passed = bool(UTM_PATTERN.search(tag))
    detail = "Valid UTM format" if passed else "No valid utm_ parameter found"
    return passed, detail

def check_ad_copy_alignment(ad_copy, destination_url):
    if not ad_copy:
        return True, "No ad copy provided, skipped"

    try:
        prompt = (
            "You are a QA reviewer for digital ad campaigns. "
            "Given this ad copy: \"" + ad_copy + "\" "
            "and this destination URL: \"" + destination_url + "\", "
            "flag ONLY if the ad copy makes a claim (like a discount, offer, or product) "
            "that seems clearly mismatched or misleading relative to the URL. "
            "Respond with exactly one line: either 'OK' or 'FLAG: <short reason>'."
        )

        completion = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=60,
            temperature=0,
        )

        result = completion.choices[0].message.content.strip()
        passed = result.startswith("OK")
        return passed, result
    except Exception as e:
        return True, "AI check skipped: " + str(e)

def run_all_checks(campaign):
    results = []

    url_passed, url_detail = check_url_reachable(campaign["destination_url"])
    results.append({"check_type": "url_reachable", "passed": url_passed, "detail": url_detail})

    tag_passed, tag_detail = check_tracking_tag(campaign["tracking_tag"])
    results.append({"check_type": "tracking_tag", "passed": tag_passed, "detail": tag_detail})

    ai_passed, ai_detail = check_ad_copy_alignment(campaign.get("ad_copy"), campaign["destination_url"])
    results.append({"check_type": "ai_copy_check", "passed": ai_passed, "detail": ai_detail})

    return results

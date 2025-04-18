#!/usr/bin/env python3

import requests
import json
import time

base_url = "https://api.ctext.org/gettext?urn=ctp:book-of-changes/"

names = [
  "qian", "kun", "zhun", "meng", "xu", "song", "shi", "bi",
  "xiao-xu", "lu", "tai", "pi", "tong-ren", "da-you", "qian1", "yu",
  "sui", "gu", "lin", "guan", "shi-he", "bi", "bo", "fu",
  "wu-wang", "da-xu", "yi", "da-guo", "kan", "li", "xian", "heng",
  "dun", "da-zhuang", "jin", "ming-yi", "jia-ren", "kui", "jian", "xie",
  "sun", "yi", "guai", "gou", "cui", "sheng", "kun", "jing",
  "ge", "ding", "zhen", "gen", "jian", "gui-mei", "feng", "lu1",
  "xun", "dui", "huan", "jie1", "zhong-fu", "xiao-guo", "ji-ji", "wei-ji"
]

gua_texts = {}

for gua in names:
    url = f"{base_url}{gua}"
    try:
        response = requests.get(url, timeout=10)
        print(url)
        if response.status_code == 200:
            data = response.json()
            gua_texts[gua] = {
                "fulltext": data.get("fulltext", []),
                "title": data.get("title", "")
            }
            print(f"✓ Retrieved: {data['title']}")
        else:
            print(f"✗ Failed to retrieve {gua} — HTTP {response.status_code}")
    except Exception as e:
        print(f"✗ Exception occurred for {gua}: {e}")

    time.sleep(0.5)

with open('hexagrams_text.json', 'w', encoding='utf-8') as f:
    json.dump(gua_texts, f, ensure_ascii=False, indent=4)

print("✅ All gua texts have been retrieved and saved.")

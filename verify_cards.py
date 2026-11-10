import sys
import urllib.request
import re

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8")

html = urllib.request.urlopen("http://127.0.0.1:5000/discover").read().decode("utf-8")

pips = re.findall(r'<div class="royal-front-pip"[^>]*>\s*([^<]+?)\s*</div>', html)
names = re.findall(r'<div class="card-front-name">\s*([^<]+?)\s*</div>', html)
locations = re.findall(r'<div class="card-front-location">\s*([^<]+?)\s*</div>', html)

print(f"Total cards on deck: {len(names)}")
for i in range(len(names)):
    pip = pips[i].strip() if i < len(pips) else "N/A"
    name = names[i].strip()
    loc = locations[i].strip() if i < len(locations) else "N/A"
    print(f"Card #{i+1:02d} | Pip: {pip:<5} | {name:<35} | {loc}")

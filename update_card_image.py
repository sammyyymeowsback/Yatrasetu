"""
YatraSetu — Utility to change or inspect card destination photos.

Usage:
    python update_card_image.py --list
    python update_card_image.py "Spiti Valley" "https://images.unsplash.com/new-photo-url..."
"""
import sys
import mysql.connector
from config import config

def get_connection():
    return mysql.connector.connect(
        host=config.MYSQL_HOST,
        port=config.MYSQL_PORT,
        user=config.MYSQL_USER,
        password=config.MYSQL_PASSWORD,
        database=config.MYSQL_DATABASE,
    )

def list_cards():
    conn = get_connection()
    cur = conn.cursor(dictionary=True)
    cur.execute("SELECT id, name, state, category, image_path FROM card_destinations ORDER BY id")
    rows = cur.fetchall()
    print("\n" + "=" * 80)
    print(f"{'ID':<4} {'Destination Name':<32} {'State':<20} {'Category':<12}")
    print("=" * 80)
    for r in rows:
        print(f"{r['id']:<4} {r['name']:<32} {r['state']:<20} {r['category']:<12}")
        print(f"     Image: {r['image_path']}\n")
    cur.close()
    conn.close()

def update_image(target_name_or_id, new_image_url):
    conn = get_connection()
    cur = conn.cursor(dictionary=True)
    
    # Try by ID first
    if target_name_or_id.isdigit():
        cur.execute("SELECT id, name FROM card_destinations WHERE id = %s", (int(target_name_or_id),))
    else:
        cur.execute("SELECT id, name FROM card_destinations WHERE name LIKE %s", (f"%{target_name_or_id}%",))
    
    matches = cur.fetchall()
    if not matches:
        print(f"Error: No card destination found matching '{target_name_or_id}'")
        cur.close()
        conn.close()
        return

    for m in matches:
        dest_id = m['id']
        dest_name = m['name']
        cur.execute("UPDATE card_destinations SET image_path = %s WHERE id = %s", (new_image_url, dest_id))
        cur.execute("UPDATE destinations SET image_path = %s WHERE id = %s", (new_image_url, dest_id))
        print(f"[OK] Successfully updated image for #{dest_id}: {dest_name}")
    
    conn.commit()
    cur.close()
    conn.close()

if __name__ == "__main__":
    if len(sys.argv) < 2 or sys.argv[1] == "--list":
        list_cards()
    elif len(sys.argv) == 3:
        update_image(sys.argv[1], sys.argv[2])
    else:
        print("Usage:")
        print("  python update_card_image.py --list")
        print("  python update_card_image.py \"<Destination Name or ID>\" \"<New Image URL>\"")

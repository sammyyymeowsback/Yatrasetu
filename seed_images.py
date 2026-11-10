"""
Seed high-resolution, curated, royalty-free photography for all destinations and card_destinations.
"""
from models.database import execute_query, execute_write

IMAGE_MAP = {
    "Spiti Valley": "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&auto=format&fit=crop&q=80",
    "Mawlynnong & Living Root Bridges": "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&auto=format&fit=crop&q=80",
    "Gandikota Gorge": "https://images.unsplash.com/photo-1518457607834-6e8d80c183c5?w=800&auto=format&fit=crop&q=80",
    "Ziro Valley": "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=800&auto=format&fit=crop&q=80",
    "Dzukou Valley": "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&auto=format&fit=crop&q=80",
    "Majuli Island": "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&auto=format&fit=crop&q=80",
    "Chopta & Tungnath Bugyal": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80",
    "Khajjiar & Kalatop Sanctuary": "https://images.unsplash.com/photo-1588714477688-cf28a50e94f7?w=800&auto=format&fit=crop&q=80",
    "Pattadakal & Aihole": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80",
    "Dholavira Harappan Metropolis": "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=800&auto=format&fit=crop&q=80",
    "Champaner-Pavagadh": "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&auto=format&fit=crop&q=80",
    "Poovar Estuary & Golden Sandbar": "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=800&auto=format&fit=crop&q=80",
    "Tawang & Sela Pass": "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=80",
    "Orchha Palaces & Cenotaphs": "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&auto=format&fit=crop&q=80",
    "Bundi Stepwells & Fort": "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&auto=format&fit=crop&q=80",
    "Anegundi (Hampi Riverside)": "https://images.unsplash.com/photo-1603288967394-0cf11c521eb8?w=800&auto=format&fit=crop&q=80",
    "Chettinad Heritage Villages": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80",
    "Gokarna & Om Beach": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80",
    "Chikmagalur Coffee Ridges": "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?w=800&auto=format&fit=crop&q=80",
    "Lamahatta Eco Park": "https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&auto=format&fit=crop&q=80",
    "Mandu Fortress & Jahaz Mahal": "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&auto=format&fit=crop&q=80",
    "Lonar Meteorite Crater Lake": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80",
    "Turtuk (Balti Heartland)": "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&auto=format&fit=crop&q=80",
    "Lepchajagat & Tinchuley Ridge": "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&auto=format&fit=crop&q=80",
}

def seed():
    # Update both card_destinations and destinations tables
    for table_name in ["card_destinations", "destinations"]:
        try:
            destinations = execute_query(f"SELECT id, name FROM {table_name}", fetch_all=True)
            if not destinations:
                continue
            count = 0
            for dest in destinations:
                name = dest["name"]
                # Match exact or partial name
                img = None
                if name in IMAGE_MAP:
                    img = IMAGE_MAP[name]
                else:
                    for k, v in IMAGE_MAP.items():
                        if k.lower() in name.lower() or name.lower() in k.lower():
                            img = v
                            break
                if not img:
                    img = "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&auto=format&fit=crop&q=80"
                
                execute_write(
                    f"UPDATE {table_name} SET image_path = %s WHERE id = %s",
                    (img, dest["id"])
                )
                count += 1
            print(f"Successfully seeded images for {count} records in {table_name}!")
        except Exception as e:
            print(f"Error seeding images for {table_name}: {e}")

if __name__ == "__main__":
    seed()

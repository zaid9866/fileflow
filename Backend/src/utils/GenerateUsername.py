import random
from unique_names_generator.data import ADJECTIVES, NAMES

def generate_username() -> str:
    username = f"{random.choice(ADJECTIVES).capitalize()} {random.choice(NAMES).capitalize()}"
    return username[:15] 

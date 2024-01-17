from faker import Faker
import random
import json

fake = Faker()

generatedIds=[]

# Define different skill sets by categories
skills_by_category = {
    "Programming": ["Python", "Java", "JavaScript", "C++", "Ruby"],
    "Languages": ["Spanish", "French", "Mandarin", "German", "Japanese"],
    "Culinary": ["Baking", "Sushi Making", "Gourmet Cooking", "Pastry Arts", "Mixology"],
    "Office Skills": ["Microsoft Word", "Microsoft Excel", "PowerPoint", "Data Entry", "Typing"],
    "Design": ["Photoshop", "Illustrator", "InDesign", "Typography", "User Interface Design"],
    "Healthcare": ["First Aid", "Patient Care", "Medical Terminology", "Phlebotomy", "CPR"],
    "Legal": ["Legal Research", "Case Management", "Document Drafting", "Courtroom Procedure", "Legal Writing"],
    "Sales": ["Negotiation", "Client Relationship Management", "Sales Strategy", "Cold Calling", "Networking"],
    "Education": ["Curriculum Development", "Classroom Management", "Student Assessment", "Special Education", "Teaching Methods"],
    "Engineering": ["Mechanical Engineering", "Electrical Engineering", "Civil Engineering", "Aerospace Engineering", "Chemical Engineering"],
    # Add more categories and skills here
}

# Define valid job positions for each category
valid_job_positions = {
    "Programming": ["Software Engineer", "Web Developer", "Data Scientist", "Systems Analyst", "Database Administrator"],
    "Languages": ["Translator", "Interpreter", "Linguist", "Language Teacher", "Localization Specialist"],
    "Culinary": ["Chef", "Sous Chef", "Baker", "Mixologist", "Pastry Chef"],
    "Office Skills": ["Administrative Assistant", "Data Entry Clerk", "Office Manager", "Secretary", "Receptionist"],
    "Design": ["Graphic Designer", "UI/UX Designer", "Art Director", "Creative Director", "Production Artist"],
    "Healthcare": ["Registered Nurse", "Medical Assistant", "Physical Therapist", "Medical Technologist", "Pharmacist"],
    "Legal": ["Lawyer", "Paralegal", "Legal Assistant", "Legal Secretary", "Legal Researcher"],
    "Sales": ["Sales Representative", "Account Executive", "Sales Manager", "Business Development Manager", "Sales Consultant"],
    "Education": ["Teacher", "Professor", "School Counselor", "Education Administrator", "Librarian"],
    "Engineering": ["Mechanical Engineer", "Electrical Engineer", "Civil Engineer", "Aerospace Engineer", "Chemical Engineer"],
    # Add more job positions here
}

def generateID():
    num = 0
    while (num in generatedIds):
        num = fake.random_number(digits=5)

    generatedIds.append(num)
    return num

# Function to generate skills required for a job
def generate_skills(job_category):
    return random.sample(skills_by_category[job_category], k=5)

# Function to generate valid job positions for a category
def generate_job_positions(job_category):
    return valid_job_positions[job_category]

# Function to generate job hours for the full week
def generate_job_hours():
    return (
    [
        {
            "weekDay":"Monday",
            "opening_time": "09:00 AM", 
            "closing_time": "05:00 PM"
        },
        {
            "weekDay":"Tuesday",
            "opening_time": "09:00 AM", 
            "closing_time": "05:00 PM"
        },
        {
            "weekDay":"Wednesday",
            "opening_time": "09:00 AM", 
            "closing_time": "05:00 PM"
        },
        {
            "weekDay":"Thursday",
            "opening_time": "09:00 AM", 
            "closing_time": "05:00 PM"
        },
        {
            "weekDay":"Friday",
            "opening_time": "09:00 AM", 
            "closing_time": "05:00 PM"
        },
        {
            "weekDay":"Saturday",
            "opening_time": "10:00 AM", 
            "closing_time": "04:00 PM"
        },
        {
            "weekDay":"Sunday",
            "opening_time": "", 
            "closing_time": ""
        },
    ]
    )
    

def generate_coordinates(bounds):
    return round(random.uniform(*bounds), 6)

# Function to generate an organization
def generate_organization():
    categories = list(skills_by_category.keys())
    category = random.choice(categories)
    
    city = fake.city()
    street = fake.street_address()
    zipcode = fake.zipcode()

    la_bounds = {
        'latitude': (33.985449, 34.334152),
        'longitude': (-117.9, -118.435642)

        # 'latitude': (32.32, 42.01),
        # 'longitude': (-124.26, -114.8)
    }

    organization = {
        "organization_id": str(generateID()),
        "organization_name": fake.company(),
        # "address": {
        #     "street": street,
        #     "city": city,
        #     "state": "California",
        #     "postal_code": zipcode,
        #     "country": "USA",
        #     "full_address": ', '.join([street, city, "CA"])+f" {zipcode}",
        #     "coordinates": {
        #         "latitude": str(generate_coordinates(la_bounds['latitude'])),
        #         "longitude": str(generate_coordinates(la_bounds['longitude']))
        #     }
        # },
        "organization_content": {
            "images": [
                {"id": i, "url": "https://source.unsplash.com/collection/484351", "caption": ' '.join(fake.words(nb=random.randint(2, 4)))} for i in range(5)
            ],
            "short_description": fake.sentence(),
            "long_description": fake.paragraph(),
            "reviews": {
                "average_rating": round(random.uniform(2.5, 5.0), 2),
                "individual_reviews": [
                    {"author": fake.name(),"rating": round(random.uniform(2.0, 5.0), 2), "comment": fake.sentence()} for _ in range(10)
                ]
            }
        },
        "jobs": [
            {
                "job_id": str(generateID()),
                "job_position": random.choice(generate_job_positions(category)),
                "available_positions": random.randint(1, 5),
                "job_location": {
                    "street": fake.street_address(),
                    "city": fake.city(),
                    "state": "California",
                    "postal_code": fake.zipcode(),
                    "country": "USA",
                    "full_address": ', '.join([street, city, "CA"])+f" {zipcode}",
                    "coordinates": {
                        "latitude": str(generate_coordinates(la_bounds['latitude'])),
                        "longitude": str(generate_coordinates(la_bounds['longitude']))
                    }
                },
                "job_hours": generate_job_hours(),
                "skills_required": generate_skills(category),
            } for _ in range(5)
        ]
    }
    return organization

# Generate 50 organizations
organizations = [generate_organization() for _ in range(50)]

# Save organizations as JSON
with open('Organization Generator/organizations_data.json', 'w') as json_file:
    json.dump(organizations, json_file, indent=4)
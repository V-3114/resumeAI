from resume_builder import build_resume

if __name__ == "__main__":
    name = "Yash Swami"

    email = "yash.swami@proton.me"

    phone = "9319621681"

    location = "New Delhi, India"


    # EDUCATION

    education = []
    count = 1

    for i in range(count):
        institute_name = "Delhi University"
        institute_location = "New Delhi, Delhi"
        degree_title = "Bachelor of Psychology"
        degree_year = "1st Year"
        major_subject = "Psychology"
        minor_subject = "Mathematics and Science"
        highlight = "Exploring internships in UX design"

        education.append({
            "institute_name": institute_name,
            "institute_location": institute_location,
            "degree_title": degree_title,
            "degree_year": degree_year,
            "major_subject": major_subject,
            "minor_subject": minor_subject,
            "highlight": highlight
        })

    # Experience
    experience = []
    count = 1

    for i in range(count):
        company = "Concentrix"
        dates = "Sep. 2024 – May 2024"
        role = "Senior Advisor"
        office = "Gurgaon, Haryana"
        description = "Concentrix is a global leader in customer experience solutions, with over $6 billion in annual revenue and 300,000 employees across 40+ countries. Serving 1,000+ clients globally, it leverages cutting-edge technology to deliver exceptional service and drive business growth."
        responsibility = "As a Senior Advisor in chat support, my primary responsibility is to enhance customer retention by ensuring they feel valued and providing effective solutions. By addressing customer needs promptly and efficiently, I contribute to the company's continued profitability."
        achievement = "Handled an average of 50 customer chats daily; Maintained a weekly quality score of 75%; Consistently achieved a resolution score of 80% or higher earning top scorer recognition; Proficient in using Office 365, Salesforce, and eCommerce platforms"
        achievement = [s.strip() for s in achievement.split(";")]

        experience.append({
            "company": company,
            "dates": dates,
            "role": role,
            "office": office,
            "description": description,
            "responsibility": responsibility,
            "achievement": achievement
        })

    technology = "CRM & Ticketing Systems, Live Chat Platforms, Troubleshooting & Debugging, Typing Speed & Accuracy, Knowledge Base & Documentation, Multitasking & Ticket Management, Scripting & Macros, Product Knowledge, Data Entry & Logs"    
    technology = [s.strip() for s in technology.split(",")]

    skill = "Communication, Active Listening, Empathy & Patience, Problem-Solving, Adaptability, Time Management, Attention to Detail, Collaboration & Teamwork, Critical Thinking, Conflict Resolution"
    skill = [s.strip() for s in skill.split(",")]

    interest = "Learning new and intriguing topics, Coding (basic Python), Sketching, and creative work, Developing an interest in books, Games (beaten Elden Ring), Music, Volleyball, Exploring"
    interest = [s.strip() for s in interest.split(",")]

    # Certificates
    certificate = []
    count = 1
    for i in range(count):
        certificate_name = "Google UX Design Professional Certificate"
        organisation = "Coursera"
        issue_date = "Sept 2024"
        course = "Foundations of User Experience (UX) Design, Build Wireframes and Low-Fidelity Prototypes, Conduct UX Research and Test Early Concepts, Create High-Fidelity Designs and Prototypes in Figma, Build Dynamic User Interfaces (UI) for Websites"
        course = [s.strip() for s in course.split(",")]

        certificate.append({
            "certificate_name": certificate_name,
            "organisation": organisation,
            "issue_date": issue_date,
            "course": course
        })
    data = {
        "name": name,
        "email": email,
        "phone": phone,
        "location": location,
        "education": education,
        "experience": experience,
        "technology": technology,
        "skill": skill,
        "interest": interest,
        "certificate": certificate
    }

    result = build_resume(data)
    print(f"Resume generated: {result}")
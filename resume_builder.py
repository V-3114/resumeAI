from docx import Document
from formatter import (
    add_heading, add_list_item, add_formatted_paragraph,
    add_horizontal_line, add_subheading_bold, add_subheading_italic,
    add_contact_info
)

def build_resume(data, output_file="resume.docx"):
    doc = Document()


    # PERSONAL INFO
    personal = data["personalInfo"]
    add_heading(doc, personal.get("fullName", ""))
    add_horizontal_line(doc)
    add_contact_info(
        doc,
        personal.get("email", ""),
        personal.get("phone", ""),
        personal.get("location", "")
    )


    # WORK EXPERIENCE
    work_experiences = data.get("workExperiences", [])
    if work_experiences:
        add_heading(doc, "WORK EXPERIENCE")
        add_horizontal_line(doc)

        for exp in work_experiences:
            add_subheading_bold(doc, exp.get("company", ""), exp.get("dates", ""))
            add_subheading_italic(doc, exp.get("role", ""), exp.get("office", ""))
            add_list_item(doc, exp.get("description", ""))
            add_list_item(doc, exp.get("responsibility", ""))

            # Achievements is always a list
            for ach in exp.get("achievement", []):
                add_list_item(doc, ach)


    # EDUCATION
    education_history = data.get("educationHistory", [])
    if education_history:
        add_heading(doc, "EDUCATION")
        add_horizontal_line(doc)

        for edu in education_history:
            add_subheading_bold(doc, edu.get("instituteName", ""), edu.get("instituteLocation", ""))
            add_subheading_italic(doc, edu.get("degreeTitle", ""), edu.get("graduationYear", ""))
            add_list_item(doc, f"Major: {edu.get('majorSubject', '')}")
            add_list_item(doc, f"Minor: {edu.get('minorSubject', '')}")
            highlight = edu.get("highlight", "")
            if highlight:
                add_list_item(doc, f"Highlight: {highlight}")


    # SKILLS & INTERESTS
    add_heading(doc, "SKILLS & INTERESTS")
    add_horizontal_line(doc)

    # These are STRINGS, so no join required
    technologies = data.get("technology", "")
    if technologies:
        if not technologies.endswith("."):
            technologies += "."
        add_formatted_paragraph(doc, "Technologies", technologies)

    soft_skills = data.get("softSkills", "")
    if soft_skills:
        if not soft_skills.endswith("."):
            soft_skills += "."
        add_formatted_paragraph(doc, "Soft Skills", soft_skills)

    interests = data.get("interest", "")
    if interests:
        if not interests.endswith("."):
            interests += "."
        add_formatted_paragraph(doc, "Interests", interests)



    # CERTIFICATIONS
    certifications = data.get("certifications", [])
    if certifications:
        add_heading(doc, "CERTIFICATIONS")
        add_horizontal_line(doc)

        for cert in certifications:
            # Certificate name, issuer, and date
            add_subheading_bold(
                doc,
                cert.get("title", ""),
                f"{cert.get('issuer', '')}, {cert.get('date', '')}"
            )
            # Optional: list of related courses or topics if available
            for course in cert.get("course", []):
                add_list_item(doc, course)

    # SAVE DOC
    doc.save(output_file)
    return output_file

from docx import Document
from formatter import (
    add_heading, add_list_item, add_formatted_paragraph,
    add_horizontal_line, add_subheading_bold, add_subheading_italic,
    add_contact_info
)

def clean_ai(text: str):
    """Remove <<start>> and <<end>> markers if present."""
    if not text:
        return ""
    return text.replace("<<start>>", "").replace("<<end>>", "").strip()


def build_resume(data) -> Document:
    doc = Document()

    # PERSONAL INFO
    personal = data.get("personalInfo", {})
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
            join = exp.get("joinDate", "")
            exit_ = exp.get("exitDate", "")
            dates_combined = f"{join} — {exit_}" if join or exit_ else ""

            add_subheading_bold(doc, exp.get("company", ""), dates_combined)
            add_subheading_italic(doc, exp.get("role", ""), exp.get("office", ""))

            # Only add AI fields if they exist and are not empty
            for key in ["description", "responsibility", "achievements", "tools", "projects"]:
                value = clean_ai(exp.get(key, ""))
                if value:
                    add_list_item(doc, value)

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

    if data.get("technology"):
        add_formatted_paragraph(doc, "Technologies", data["technology"].rstrip(".") + ".")
    if data.get("softSkills"):
        add_formatted_paragraph(doc, "Soft Skills", data["softSkills"].rstrip(".") + ".")
    if data.get("interest"):
        add_formatted_paragraph(doc, "Interests", data["interest"].rstrip(".") + ".")

    # CERTIFICATIONS
    certifications = data.get("certifications", [])
    if certifications:
        add_heading(doc, "CERTIFICATIONS")
        add_horizontal_line(doc)

        for cert in certifications:
            add_subheading_bold(
                doc,
                cert.get("title", ""),
                f"{cert.get('issuer', '')}, {cert.get('date', '')}"
            )
            for course in cert.get("courses", []):
                add_list_item(doc, course)

    # Return the Document object directly
    return doc

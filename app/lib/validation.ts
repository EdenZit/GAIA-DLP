// app/lib/validation.ts
interface ValidationError {
  field: string;
  message: string;
}

export function validateProfileData(data: any): ValidationError[] {
  const errors: ValidationError[] = [];

  // Validate image URL if present
  if (data.imageUrl && typeof data.imageUrl !== 'string') {
    errors.push({
      field: 'imageUrl',
      message: 'Image URL must be a string'
    });
  }

  // Validate education entries
  if (data.education) {
    if (!Array.isArray(data.education)) {
      errors.push({
        field: 'education',
        message: 'Education must be an array'
      });
    } else {
      data.education.forEach((edu: any, index: number) => {
        if (!edu.institution) {
          errors.push({
            field: `education[${index}].institution`,
            message: 'Institution is required'
          });
        }
        if (!edu.degree) {
          errors.push({
            field: `education[${index}].degree`,
            message: 'Degree is required'
          });
        }
        if (!edu.startDate) {
          errors.push({
            field: `education[${index}].startDate`,
            message: 'Start date is required'
          });
        }
      });
    }
  }

  // Validate experience entries
  if (data.experience) {
    if (!Array.isArray(data.experience)) {
      errors.push({
        field: 'experience',
        message: 'Experience must be an array'
      });
    } else {
      data.experience.forEach((exp: any, index: number) => {
        if (!exp.company) {
          errors.push({
            field: `experience[${index}].company`,
            message: 'Company is required'
          });
        }
        if (!exp.position) {
          errors.push({
            field: `experience[${index}].position`,
            message: 'Position is required'
          });
        }
        if (!exp.startDate) {
          errors.push({
            field: `experience[${index}].startDate`,
            message: 'Start date is required'
          });
        }
      });
    }
  }

  // Validate skills
  if (data.skills) {
    if (!Array.isArray(data.skills)) {
      errors.push({
        field: 'skills',
        message: 'Skills must be an array'
      });
    } else {
      data.skills.forEach((skill: any, index: number) => {
        if (!skill.name) {
          errors.push({
            field: `skills[${index}].name`,
            message: 'Skill name is required'
          });
        }
        if (!skill.category) {
          errors.push({
            field: `skills[${index}].category`,
            message: 'Skill category is required'
          });
        }
        if (!skill.proficiency || !['Beginner', 'Intermediate', 'Advanced', 'Expert'].includes(skill.proficiency)) {
          errors.push({
            field: `skills[${index}].proficiency`,
            message: 'Valid proficiency level is required'
          });
        }
      });
    }
  }

  return errors;
}

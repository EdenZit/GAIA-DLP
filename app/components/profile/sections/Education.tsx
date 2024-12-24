import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Education {
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  description: string;
}

interface EducationSectionProps {
  educationList: Education[];
  onUpdate: (education: Education[]) => void;
}

const EducationSection = ({ educationList, onUpdate }: EducationSectionProps) => {
  const [editing, setEditing] = useState(false);
  const [currentEducation, setCurrentEducation] = useState<Education[]>(educationList);

  const handleAdd = () => {
    const newEducation: Education = {
      institution: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: '',
      description: ''
    };
    setCurrentEducation([...currentEducation, newEducation]);
    setEditing(true);
  };

  const handleChange = (index: number, field: keyof Education, value: string) => {
    const updated = [...currentEducation];
    updated[index] = { ...updated[index], [field]: value };
    setCurrentEducation(updated);
  };

  const handleRemove = (index: number) => {
    const updated = currentEducation.filter((_, i) => i !== index);
    setCurrentEducation(updated);
  };

  const handleSave = () => {
    onUpdate(currentEducation);
    setEditing(false);
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Education</CardTitle>
        <div>
          {editing ? (
            <Button onClick={handleSave}>Save</Button>
          ) : (
            <Button onClick={() => setEditing(true)}>Edit</Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {currentEducation.map((edu, index) => (
          <div key={index} className="mb-6 last:mb-0">
            {editing ? (
              <div className="space-y-4">
                <div>
                  <Label>Institution</Label>
                  <Input
                    value={edu.institution}
                    onChange={(e) => handleChange(index, 'institution', e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Degree</Label>
                    <Input
                      value={edu.degree}
                      onChange={(e) => handleChange(index, 'degree', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Field of Study</Label>
                    <Input
                      value={edu.field}
                      onChange={(e) => handleChange(index, 'field', e.target.value)}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Start Date</Label>
                    <Input
                      type="date"
                      value={edu.startDate}
                      onChange={(e) => handleChange(index, 'startDate', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>End Date</Label>
                    <Input
                      type="date"
                      value={edu.endDate}
                      onChange={(e) => handleChange(index, 'endDate', e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <Label>Description</Label>
                  <Input
                    value={edu.description}
                    onChange={(e) => handleChange(index, 'description', e.target.value)}
                  />
                </div>
                <Button 
                  variant="destructive" 
                  onClick={() => handleRemove(index)}
                >
                  Remove
                </Button>
              </div>
            ) : (
              <div>
                <h4 className="font-semibold">{edu.institution}</h4>
                <p>{edu.degree} in {edu.field}</p>
                <p className="text-sm text-gray-600">
                  {edu.startDate} - {edu.endDate}
                </p>
                <p className="mt-2">{edu.description}</p>
              </div>
            )}
          </div>
        ))}
        {editing && (
          <Button onClick={handleAdd} className="mt-4">
            Add Education
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default EducationSection;

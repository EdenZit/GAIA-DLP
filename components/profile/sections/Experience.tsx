import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';

interface Experience {
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

interface ExperienceSectionProps {
  experienceList: Experience[];
  onUpdate: (experience: Experience[]) => void;
}

const ExperienceSection = ({ experienceList, onUpdate }: ExperienceSectionProps) => {
  const [editing, setEditing] = useState(false);
  const [currentExperience, setCurrentExperience] = useState<Experience[]>(experienceList);

  const handleAdd = () => {
    const newExperience: Experience = {
      company: '',
      position: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: ''
    };
    setCurrentExperience([...currentExperience, newExperience]);
    setEditing(true);
  };

  const handleChange = (index: number, field: keyof Experience, value: any) => {
    const updated = [...currentExperience];
    updated[index] = { ...updated[index], [field]: value };
    if (field === 'current' && value === true) {
      updated[index].endDate = '';
    }
    setCurrentExperience(updated);
  };

  const handleRemove = (index: number) => {
    const updated = currentExperience.filter((_, i) => i !== index);
    setCurrentExperience(updated);
  };

  const handleSave = () => {
    onUpdate(currentExperience);
    setEditing(false);
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Experience</CardTitle>
        <div>
          {editing ? (
            <Button onClick={handleSave}>Save</Button>
          ) : (
            <Button onClick={() => setEditing(true)}>Edit</Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {currentExperience.map((exp, index) => (
          <div key={index} className="mb-8 last:mb-0">
            {editing ? (
              <div className="space-y-4">
                <div>
                  <Label>Company</Label>
                  <Input
                    value={exp.company}
                    onChange={(e) => handleChange(index, 'company', e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Position</Label>
                    <Input
                      value={exp.position}
                      onChange={(e) => handleChange(index, 'position', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Location</Label>
                    <Input
                      value={exp.location}
                      onChange={(e) => handleChange(index, 'location', e.target.value)}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Start Date</Label>
                    <Input
                      type="date"
                      value={exp.startDate}
                      onChange={(e) => handleChange(index, 'startDate', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>End Date</Label>
                    <Input
                      type="date"
                      value={exp.endDate}
                      onChange={(e) => handleChange(index, 'endDate', e.target.value)}
                      disabled={exp.current}
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={exp.current}
                    onCheckedChange={(checked) => handleChange(index, 'current', checked)}
                  />
                  <Label>Current Position</Label>
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea
                    value={exp.description}
                    onChange={(e) => handleChange(index, 'description', e.target.value)}
                    className="h-24"
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
                <h4 className="font-semibold">{exp.company}</h4>
                <p className="text-lg">{exp.position}</p>
                <p className="text-sm text-gray-600">{exp.location}</p>
                <p className="text-sm text-gray-600">
                  {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                </p>
                <p className="mt-2 whitespace-pre-line">{exp.description}</p>
              </div>
            )}
          </div>
        ))}
        {editing && (
          <Button onClick={handleAdd} className="mt-4">
            Add Experience
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default ExperienceSection;

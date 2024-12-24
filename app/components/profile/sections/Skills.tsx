import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Skill {
  name: string;
  category: string;
  proficiency: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
}

interface SkillsSectionProps {
  skillsList: Skill[];
  onUpdate: (skills: Skill[]) => void;
}

const CATEGORIES = [
  'Programming Languages',
  'Frameworks',
  'Databases',
  'Tools',
  'Soft Skills',
  'Other'
];

const PROFICIENCY_LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

const SkillsSection = ({ skillsList, onUpdate }: SkillsSectionProps) => {
  const [editing, setEditing] = useState(false);
  const [currentSkills, setCurrentSkills] = useState<Skill[]>(skillsList);
  const [newSkill, setNewSkill] = useState<Skill>({
    name: '',
    category: CATEGORIES[0],
    proficiency: 'Beginner'
  });

  const handleAdd = () => {
    if (newSkill.name.trim()) {
      setCurrentSkills([...currentSkills, { ...newSkill }]);
      setNewSkill({
        name: '',
        category: newSkill.category,
        proficiency: 'Beginner'
      });
    }
  };

  const handleRemove = (index: number) => {
    const updated = currentSkills.filter((_, i) => i !== index);
    setCurrentSkills(updated);
  };

  const handleSave = () => {
    onUpdate(currentSkills);
    setEditing(false);
  };

  const groupedSkills = currentSkills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  const getProficiencyColor = (proficiency: string) => {
    switch (proficiency) {
      case 'Beginner':
        return 'bg-blue-100 text-blue-800';
      case 'Intermediate':
        return 'bg-green-100 text-green-800';
      case 'Advanced':
        return 'bg-purple-100 text-purple-800';
      case 'Expert':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Skills</CardTitle>
        <div>
          {editing ? (
            <Button onClick={handleSave}>Save</Button>
          ) : (
            <Button onClick={() => setEditing(true)}>Edit</Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {editing && (
          <div className="mb-6 space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>Skill Name</Label>
                <Input
                  value={newSkill.name}
                  onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                  placeholder="Enter skill name"
                />
              </div>
              <div>
                <Label>Category</Label>
                <Select
                  value={newSkill.category}
                  onValueChange={(value) => setNewSkill({ ...newSkill, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Proficiency</Label>
                <Select
                  value={newSkill.proficiency}
                  onValueChange={(value: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert') => 
                    setNewSkill({ ...newSkill, proficiency: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select proficiency" />
                  </SelectTrigger>
                  <SelectContent>
                    {PROFICIENCY_LEVELS.map((level) => (
                      <SelectItem key={level} value={level}>
                        {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button onClick={handleAdd} disabled={!newSkill.name.trim()}>
              Add Skill
            </Button>
          </div>
        )}

        {editing ? (
          <div className="space-y-4">
            {currentSkills.map((skill, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <div className="flex items-center space-x-4">
                  <span className="font-medium">{skill.name}</span>
                  <Badge variant="secondary">{skill.category}</Badge>
                  <Badge className={getProficiencyColor(skill.proficiency)}>
                    {skill.proficiency}
                  </Badge>
                </div>
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => handleRemove(index)}
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedSkills).map(([category, skills]) => (
              <div key={category}>
                <h4 className="font-semibold mb-2">{category}</h4>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, index) => (
                    <Badge 
                      key={index}
                      className={getProficiencyColor(skill.proficiency)}
                    >
                      {skill.name}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SkillsSection;

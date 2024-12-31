// app/test-ui/page.tsx
'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '../components/ui/alert';
import { Badge } from '../components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function TestUIPage() {
  const [showAlert, setShowAlert] = useState(false);
  const [inputValue, setInputValue] = useState('');

  return (
    <div className="container mx-auto p-8 space-y-8">
      <h1 className="text-2xl font-bold mb-6">UI Components Test</h1>

      {/* Card Test */}
      <Card>
        <CardHeader>
          <CardTitle>Card Component Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Alert Test */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Alert Component</h2>
            <Button 
              onClick={() => setShowAlert(!showAlert)}
              variant="outline"
            >
              Toggle Alert
            </Button>
            {showAlert && (
              <Alert>
                <AlertTitle>Alert Title</AlertTitle>
                <AlertDescription>
                  This is a test alert message.
                </AlertDescription>
              </Alert>
            )}
          </div>

          {/* Input Test */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Input Component</h2>
            <Input
              placeholder="Test input field"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="max-w-sm"
            />
            <p>Input value: {inputValue}</p>
          </div>

          {/* Button Variants Test */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Button Variants</h2>
            <div className="flex flex-wrap gap-4">
              <Button variant="default">Default</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="link">Link</Button>
            </div>
          </div>

          {/* Button Sizes Test */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Button Sizes</h2>
            <div className="flex flex-wrap gap-4 items-center">
              <Button size="sm">Small</Button>
              <Button size="default">Default</Button>
              <Button size="lg">Large</Button>
              <Button size="icon">
                <span className="h-4 w-4">×</span>
              </Button>
            </div>
          </div>

          {/* Badge Test */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Badge Component</h2>
            <div className="flex flex-wrap gap-4">
              <Badge>Default Badge</Badge>
              <Badge variant="secondary">Secondary Badge</Badge>
              <Badge variant="destructive">Destructive Badge</Badge>
              <Badge variant="outline">Outline Badge</Badge>
            </div>
          </div>

          {/* Dropdown Menu Test */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Dropdown Menu</h2>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">Open Dropdown</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>Item 1</DropdownMenuItem>
                <DropdownMenuItem>Item 2</DropdownMenuItem>
                <DropdownMenuItem>Item 3</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

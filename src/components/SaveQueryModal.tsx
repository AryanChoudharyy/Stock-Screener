'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Button } from './ui/Button';

interface SaveQueryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string, description: string, isPublic: boolean) => void;
  currentQuery: string;
  initialName?: string;
  initialDescription?: string;
}

export default function SaveQueryModal({
  isOpen,
  onClose,
  onSave,
  currentQuery,
  initialName = '',
  initialDescription = ''
}: SaveQueryModalProps) {
  const [name, setName] = useState(initialName);
  const [description, setDescription] = useState(initialDescription);
  const [isPublic, setIsPublic] = useState(true);

  // Update state when initial values change
  useEffect(() => {
    setName(initialName);
    setDescription(initialDescription);
  }, [initialName, initialDescription]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(name, description, isPublic);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-lg mx-4">
        <CardHeader>
          <CardTitle className="text-2xl">Save query</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium">
              Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="eg. The Cash Bargins"
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="block text-sm font-medium">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="eg. Companies with over 20% growth"
              className="w-full h-24 px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="public"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
              className="rounded bg-gray-700 border-gray-600 text-blue-500 focus:ring-blue-500"
            />
            <label htmlFor="public" className="text-sm">
              Make the query public?
            </label>
          </div>

          <div className="pt-4 space-y-2">
            <p className="text-sm text-gray-400">Query: {currentQuery}</p>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save Query</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
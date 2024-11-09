'use client';

import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { X, GripVertical } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Button } from './ui/Button';
import { Stock } from '@/types/stock';

interface ManageColumnsModalProps {
  isOpen: boolean;
  onClose: () => void;
  columns: Array<{ field: keyof Stock; label: string; width: string }>;
  onSave: (newColumns: Array<{ field: keyof Stock; label: string; width: string }>) => void;
  onReset: () => void;
}

export default function ManageColumnsModal({
  isOpen,
  onClose,
  columns,
  onSave,
  onReset,
}: ManageColumnsModalProps) {
  const [localColumns, setLocalColumns] = useState(columns);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted) return null;

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(localColumns);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setLocalColumns(items);
  };

  const handleRemoveColumn = (index: number) => {
    setLocalColumns(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl mx-4">
        <CardHeader>
          <CardTitle className="text-2xl">Manage columns</CardTitle>
          <p className="text-gray-400 text-sm mt-1">
            Drag names to reorder them.
          </p>
        </CardHeader>
        <CardContent>
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="droppable-columns">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="space-y-2"
                >
                  {localColumns.map((column, index) => (
                    <Draggable
                      key={column.field}
                      draggableId={column.field}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={`flex items-center justify-between bg-gray-800 rounded-md p-3 ${
                            snapshot.isDragging ? 'shadow-lg ring-2 ring-blue-500' : ''
                          } hover:bg-gray-700/50 transition-colors`}
                        >
                          <div className="flex items-center gap-3">
                            <span
                              {...provided.dragHandleProps}
                              className="text-gray-400 hover:text-white cursor-grab active:cursor-grabbing p-1 hover:bg-gray-600 rounded"
                            >
                              <GripVertical size={20} />
                            </span>
                            <span className="select-none">{column.label}</span>
                          </div>
                          <button
                            onClick={() => handleRemoveColumn(index)}
                            className="text-gray-400 hover:text-white p-1.5 rounded-md hover:bg-gray-600 transition-colors"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>

          <div className="flex justify-between mt-6">
            <div className="space-x-3">
              <Button 
                variant="default"
                onClick={() => {
                  onSave(localColumns);
                  onClose();
                }}
                className="px-6"
              >
                Save Columns
              </Button>
              <Button 
                variant="outline" 
                onClick={onClose}
              >
                Cancel
              </Button>
            </div>
            <Button 
              variant="outline" 
              onClick={() => {
                onReset();
                onClose();
              }}
              className="text-red-500 border-red-500 hover:bg-red-500/10"
            >
              Reset Defaults
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
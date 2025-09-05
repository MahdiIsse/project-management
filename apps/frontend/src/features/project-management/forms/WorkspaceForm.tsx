'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  useCreateWorkspace,
  useUpdateWorkspace,
  workspaceSchema,
  WorkspaceSchemaValues,
  WORKSPACE_COLORS,
  getWorkspaceColorProps,
  getWorkspaceColorByHex,
  getHexByWorkspaceColorName,
  Workspace,
} from '@/features/project-management';

import {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormField,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Input,
  Button,
  Textarea,
  cn,
} from '@/shared';

interface WorkspaceFormProps {
  workspaceToEdit?: Workspace;
  onClose: () => void;
  onWorkspaceCreated?: (workspaceId: string) => void;
}

export function WorkspaceForm({
  workspaceToEdit,
  onClose,
  onWorkspaceCreated,
}: WorkspaceFormProps) {
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
  const isEditMode = Boolean(workspaceToEdit);
  const { mutate: createWorkspace } = useCreateWorkspace();
  const { mutate: updateWorkspace } = useUpdateWorkspace();

  const getInitialColorName = (): string => {
    if (workspaceToEdit?.color) {
      const colorTheme = getWorkspaceColorByHex(workspaceToEdit.color);
      return colorTheme.name;
    }
    return 'Leisteen';
  };

  const form = useForm<WorkspaceSchemaValues>({
    resolver: zodResolver(workspaceSchema),
    defaultValues:
      isEditMode && workspaceToEdit
        ? {
            title: workspaceToEdit.title,
            description: workspaceToEdit.description || '',
            color: getInitialColorName(),
          }
        : {
            title: '',
            description: '',
            color: 'Leisteen',
          },
  });

  const handleSubmit = (data: WorkspaceSchemaValues) => {
    const dataToSend = {
      ...data,
      color: data.color ? getHexByWorkspaceColorName(data.color) : undefined,
    };

    if (isEditMode && workspaceToEdit) {
      updateWorkspace(
        { id: workspaceToEdit.id, data: dataToSend },
        { onSuccess: () => onClose() }
      );
    } else {
      createWorkspace(dataToSend, {
        onSuccess: (newWorkspace) => {
          form.reset();
          onClose();
          onWorkspaceCreated?.(newWorkspace.id);
        },
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Titel</FormLabel>
              <FormControl>
                <Input
                  placeholder="Vul hier de titel van de workspace in..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Beschrijving</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Vul hier de beschrijving van de workspace in..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="color"
          render={({ field }) => {
            const selectedColor = getWorkspaceColorProps(field.value);

            return (
              <FormItem>
                <FormLabel>Kleur</FormLabel>
                <Popover
                  open={isColorPickerOpen}
                  onOpenChange={setIsColorPickerOpen}
                >
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left h-10 px-3"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={cn(
                              'w-4 h-4 rounded-full',
                              selectedColor.bg
                            )}
                          />
                          <span className="font-normal">
                            {selectedColor.name}
                          </span>
                        </div>
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-64">
                    <div className="space-y-3">
                      <h4 className="font-medium leading-none">
                        Kies een kleur
                      </h4>
                      <div className="grid grid-cols-5 gap-3">
                        {WORKSPACE_COLORS.map((color) => (
                          <button
                            key={color.name}
                            type="button"
                            className={cn(
                              'w-8 h-8 rounded-full border-2 transition-transform',
                              'hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring',
                              color.bg,
                              field.value === color.name
                                ? 'border-white'
                                : 'border-transparent'
                            )}
                            onClick={() => {
                              field.onChange(color.name);
                              setIsColorPickerOpen(false);
                            }}
                            title={color.name}
                          />
                        ))}
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            );
          }}
        />

        <div className="flex gap-2 pt-4">
          <Button type="submit" className="flex-1">
            {isEditMode ? 'Bijwerken' : 'Aanmaken'}
          </Button>
          <Button type="button" variant="outline" onClick={onClose}>
            Annuleren
          </Button>
        </div>
      </form>
    </Form>
  );
}

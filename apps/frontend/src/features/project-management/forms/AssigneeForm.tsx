'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  assigneeSchema,
  AssigneeSchemaValues,
  Assignee,
  useCreateAssignee,
  useUpdateAssignee,
} from '@/features/project-management';
import {
  Form,
  FormField,
  FormLabel,
  FormItem,
  FormControl,
  FormMessage,
  Input,
  Button,
  Avatar,
  AvatarImage,
  AvatarFallback,
} from '@/shared';
import { Upload, X } from 'lucide-react';

interface AssigneeFormProps {
  assigneeToEdit?: Assignee;
  closeDialog: () => void;
  onAssigneeCreated?: (newAssignee: Assignee) => void;
}

export function AssigneeForm({
  assigneeToEdit,
  closeDialog,
  onAssigneeCreated,
}: AssigneeFormProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const isEditMode = Boolean(assigneeToEdit);
  const { mutate: createAssignee, isPending: isCreatePending } =
    useCreateAssignee();
  const { mutate: updateAssignee, isPending: isUpdatePending } =
    useUpdateAssignee();

  const form = useForm({
    resolver: zodResolver(assigneeSchema),
    defaultValues:
      isEditMode && assigneeToEdit
        ? {
            name: assigneeToEdit.name,
            avatarFile: undefined,
          }
        : {
            name: '',
            avatarFile: undefined,
          },
  });

  const handleFileChange = (file: File | undefined) => {
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      form.setValue('avatarFile', file);
    } else {
      setSelectedFile(null);
      setPreviewUrl(null);
      form.setValue('avatarFile', undefined);
    }
  };

  const clearFile = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    handleFileChange(undefined);
  };

  const onSubmit = (data: AssigneeSchemaValues) => {
    const formData = {
      name: data.name,
      avatarFile: data.avatarFile,
    };

    if (isEditMode) {
      if (!assigneeToEdit) return;
      updateAssignee(
        {
          assigneeId: assigneeToEdit.id,
          data: formData,
        },
        {
          onSuccess: () => {
            form.reset();
            clearFile();
            closeDialog();
          },
        }
      );
    } else {
      createAssignee(formData, {
        onSuccess: (newAssignee) => {
          form.reset();
          clearFile();
          closeDialog();
          onAssigneeCreated?.(newAssignee);
        },
      });
    }
  };

  const currentAvatarUrl = assigneeToEdit?.avatarUrl;
  const showAvatar = previewUrl || currentAvatarUrl;
  const avatarDisplayName = form.watch('name') || assigneeToEdit?.name || '';

  return (
    <Form {...form}>
      <div className="space-y-6">
        {showAvatar && (
          <div className="flex flex-col items-center justify-center gap-3">
            <FormLabel>
              {previewUrl ? 'Nieuwe Avatar Preview' : 'Huidige Avatar'}
            </FormLabel>
            <div className="flex items-center gap-4">
              <Avatar className="h-28 w-28">
                <AvatarImage
                  src={previewUrl || currentAvatarUrl || ''}
                  alt={avatarDisplayName}
                />
                <AvatarFallback className="text-lg">
                  {avatarDisplayName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
            {previewUrl && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={clearFile}
                className="text-muted-foreground hover:text-destructive"
              >
                <X className="h-4 w-4 mr-1" />
                Verwijder
              </Button>
            )}
          </div>
        )}

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Naam</FormLabel>
              <FormControl>
                <Input
                  placeholder="Vul hier de naam in van de team member"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="avatarFile"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Avatar</FormLabel>
              <FormControl>
                <div className="space-y-3">
                  <div className="flex items-center gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      className="relative overflow-hidden"
                      onClick={() =>
                        document.getElementById('avatar-upload')?.click()
                      }
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      {selectedFile ? 'Bestand wijzigen' : 'Bestand kiezen'}
                    </Button>

                    <span className="text-sm text-muted-foreground">
                      {selectedFile
                        ? selectedFile.name
                        : currentAvatarUrl
                          ? 'Huidige avatar behouden'
                          : 'Geen bestand geselecteerd'}
                    </span>
                  </div>

                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      handleFileChange(file);
                      field.onChange(file);
                    }}
                  />

                  <p className="text-xs text-muted-foreground">
                    Ondersteunde formaten: JPG, PNG, WEBP. Max 5MB.
                  </p>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            className="flex-1"
            disabled={isCreatePending || isUpdatePending}
            onClick={form.handleSubmit(onSubmit)}
          >
            {isCreatePending || isUpdatePending
              ? isEditMode
                ? 'Opslaan...'
                : 'Aanmaken...'
              : isEditMode
                ? 'Wijzigingen opslaan'
                : 'Team member aanmaken'}
          </Button>
          <Button type="button" variant="outline" onClick={closeDialog}>
            Annuleren
          </Button>
        </div>
      </div>
    </Form>
  );
}

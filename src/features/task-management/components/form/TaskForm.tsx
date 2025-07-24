"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  taskSchema,
  TaskSchemaValues,
} from "@/features/task-management/schemas/tasks";
import {
  useCreateTask,
  useUpdateTask,
  useColumns,
} from "@/features/task-management/hooks";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Calendar,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Button,
  Input,
  Textarea,
} from "@/shared";
import { Task, Priority, priorityOptions } from "@/features/task-management";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/shared";
import { format } from "date-fns";
import { nl } from "date-fns/locale";

interface TaskFormProps {
  workspaceId: string;
  taskToEdit?: Task;
  closeDialog: () => void;
}

export function TaskForm({
  workspaceId,
  taskToEdit,
  closeDialog,
}: TaskFormProps) {
  const isEditMode = Boolean(taskToEdit);
  const form = useForm<TaskSchemaValues>({
    resolver: zodResolver(taskSchema),
    defaultValues:
      isEditMode && taskToEdit
        ? {
            title: taskToEdit.title,
            description: taskToEdit.description || "",
            columnId: taskToEdit.columnId,
            priority: taskToEdit.priority as Priority,
            dueDate: taskToEdit.dueDate
              ? new Date(taskToEdit.dueDate)
              : undefined,
          }
        : {
            title: "",
            description: "",
            columnId: "",
            priority: undefined,
            dueDate: undefined,
          },
  });

  const { mutate: updateTask } = useUpdateTask();
  const { mutate: createTask } = useCreateTask();
  const { data: columns } = useColumns(workspaceId);

  const onSubmit = (data: TaskSchemaValues) => {
    if (isEditMode) {
      if (!taskToEdit) return;
      updateTask(
        {
          data: {
            ...data,
            dueDate: data.dueDate ? data.dueDate.toISOString() : undefined,
          },
          taskId: taskToEdit.id,
        },
        { onSuccess: () => closeDialog() }
      );
    } else {
      createTask({ workspaceId, data }, { onSuccess: () => closeDialog() });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Taak Naam</FormLabel>
              <FormControl>
                <Input
                  placeholder="Vul hier de titel van de taak in..."
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
                  placeholder="Vul hier de beschrijving in..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-between">
          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prioriteit</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecteer prioriteit" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {priorityOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <span className={option.color}>{option.label}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="columnId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecteer status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {columns?.map((column) => (
                      <SelectItem key={column.id} value={column.id}>
                        <span className={cn(column.border)}>
                          {column.title}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="dueDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Vervaldatum</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP", { locale: nl })
                      ) : (
                        <span>Selecteer datum</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date < new Date(new Date().setHours(0, 0, 0, 0))
                    }
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-2">
          <Button type="submit" className="flex-1">
            {isEditMode ? "Opslaan" : "Maak aan"}
          </Button>
          <Button type="button" variant="outline" onClick={closeDialog}>
            Annuleren
          </Button>
        </div>
      </form>
    </Form>
  );
}

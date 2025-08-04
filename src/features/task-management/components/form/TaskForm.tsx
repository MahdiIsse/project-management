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
import { format, parseISO, formatISO } from "date-fns";
import { nl } from "date-fns/locale";
import { getColumnTextStyle } from "../../utils";
import { useState } from "react";
import {
  AssigneeFormSelector,
  TagFormSelector,
} from "@/features/task-management";

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
  const { data: columns } = useColumns(workspaceId);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const form = useForm<TaskSchemaValues>({
    resolver: zodResolver(taskSchema),
    defaultValues:
      isEditMode && taskToEdit
        ? {
            title: taskToEdit.title,
            description: taskToEdit.description || "",
            columnId: taskToEdit.columnId,
            priority: taskToEdit.priority as Priority,
            dueDate: taskToEdit.dueDate || undefined,
            assigneeIds: taskToEdit.assignees.map((a) => a.id),
            tagIds: taskToEdit.tags.map((t) => t.id),
          }
        : {
            title: "",
            description: "",
            columnId: columns && columns.length > 0 ? columns[0].id : "",
            priority: "Low",
            dueDate: undefined,
            assigneeIds: [],
            tagIds: [],
          },
  });

  const { mutate: updateTask, isPending: isUpdatePending } = useUpdateTask();
  const { mutate: createTask, isPending: isCreatePending } = useCreateTask();

  const isPending = isEditMode ? isUpdatePending : isCreatePending;

  const onSubmit = (data: TaskSchemaValues) => {
    if (isEditMode) {
      if (!taskToEdit) return;
      updateTask(
        {
          data: {
            ...data,
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
                  disabled={isPending}
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
                  disabled={isPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">
                  Prioriteit
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={isPending}
                >
                  <FormControl>
                    <SelectTrigger className="h-10" disabled={isPending}>
                      <SelectValue placeholder="Selecteer prioriteit" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {priorityOptions.map((option) => (
                      <SelectItem
                        key={option.value}
                        value={option.value}
                        disabled={isPending}
                      >
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
                <FormLabel className="text-sm font-medium">Status</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={isPending}
                >
                  <FormControl>
                    <SelectTrigger className="h-10" disabled={isPending}>
                      <SelectValue placeholder="Selecteer status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {columns?.map((column) => (
                      <SelectItem
                        key={column.id}
                        value={column.id}
                        disabled={isPending}
                      >
                        <span className={getColumnTextStyle(column.border)}>
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
              <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                      disabled={isPending}
                    >
                      {field.value ? (
                        format(parseISO(field.value), "PPP", { locale: nl })
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
                    selected={field.value ? parseISO(field.value) : undefined}
                    onSelect={(date) => {
                      field.onChange(
                        date
                          ? formatISO(date, { representation: "date" })
                          : undefined
                      );
                      setIsPopoverOpen(false);
                    }}
                    disabled={isPending}
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <FormField
            control={form.control}
            name="assigneeIds"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <AssigneeFormSelector
                    value={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="tagIds"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <TagFormSelector
                    value={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            type="submit"
            className="flex-1 h-10 font-medium"
            disabled={isPending}
          >
            {isEditMode ? "Wijzigingen opslaan" : "Taak aanmaken"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={closeDialog}
            className="px-6 h-10"
            disabled={isPending}
          >
            Annuleren
          </Button>
        </div>
      </form>
    </Form>
  );
}

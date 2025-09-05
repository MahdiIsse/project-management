import { assigneeService, authService, columnService, tagService, taskService, uploadService, workspaceService } from "./services";

export const apiClient = {
  ...authService,
  ...workspaceService,
  ...columnService,
  ...taskService,
  ...assigneeService,
  ...tagService,
  ...uploadService,
};

export { 
  authService, 
  workspaceService, 
  columnService,
  taskService, 
  assigneeService, 
  tagService,
  uploadService 
};
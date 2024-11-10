import { Status } from "./create-task.dto";
export interface TaskResponse {
    id: number;
    title: string;
    description: string;
    dueDate: Date;
    status: Status;
    userId: number;
  }
  
  export interface PaginatedTaskResponse {
    data: TaskResponse[];
    meta: {
      totalCount: number;
      totalPages: number;
      currentPage: number;
      perPage: number;
    };
  }
  
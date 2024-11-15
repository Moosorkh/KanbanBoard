import { UserData } from './UserData';

export interface TicketData {
  id: number;
  name: string;
  description: string;
  status: string;
  createdAt: string;
  assignedUserId: number | null;
  assignedUser: UserData | null;
}

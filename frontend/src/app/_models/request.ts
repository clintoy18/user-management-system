export interface Request {
    id: string;
    title: string;
    description: string;
    status: 'pending' | 'approved' | 'rejected';
    createdAt: string;
    updatedAt: string;
    userId: string;
    userName?: string;
} 
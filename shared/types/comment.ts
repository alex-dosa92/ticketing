export type Comment = {
    _id: string;
    content: string;
    ticketId: string;
    userId: {
        _id: string;
        name: string;
        email: string;
    };
    createdAt: string;
    updatedAt: string;
};